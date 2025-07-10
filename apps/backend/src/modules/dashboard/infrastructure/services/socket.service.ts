import { Server as HttpServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'
import jwt from 'jsonwebtoken'
import { User, Role } from '@prisma/client'

type UserWithRole = User & {
    role: Role
}

export interface DashboardUpdateData {
    type: 'stats' | 'sales' | 'users' | 'products' | 'activity'
    data: any
    timestamp: Date
}

export class SocketService {
    private io: SocketIOServer
    private connectedAdmins = new Set<string>()

    constructor(httpServer: HttpServer) {
        this.io = new SocketIOServer(httpServer, {
            cors: {
                origin: ['http://localhost:3000', 'http://localhost:3001'],
                methods: ['GET', 'POST'],
                credentials: true,
            },
            path: '/socket.io',
        })

        this.setupMiddleware()
        this.setupEventHandlers()
    }

    private setupMiddleware() {
        // Authentication middleware for socket connections
        this.io.use(async (socket, next) => {
            try {
                const token = socket.handshake.auth.token
                if (!token) {
                    return next(
                        new Error('Authentication error: No token provided')
                    )
                }

                const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
                    userId: string
                }

                // Get user with role from database
                const { PrismaUserRepo } = await import(
                    '../../../user/infrastructure/repositories/user.repository'
                )
                const userRepository = new PrismaUserRepo()
                const user = (await userRepository.findById(
                    decoded.userId
                )) as UserWithRole | null

                if (!user || !user.role) {
                    return next(
                        new Error(
                            'Authentication error: User not found or role not found'
                        )
                    )
                }

                // Set user data
                const userRole = user.role.name?.toLowerCase()
                socket.data.userId = user.id
                socket.data.userRole = userRole
                socket.data.isAdmin = userRole === 'admin'
                
                next()
            } catch (error) {
                next(new Error('Authentication error: Invalid token'))
            }
        })
    }

    private setupEventHandlers() {
        this.io.on('connection', (socket) => {
            console.log(`User connected: ${socket.data.userId}`)
            
            // Check if user is admin
            if (socket.data.isAdmin) {
                this.connectedAdmins.add(socket.data.userId)
                // Join admin room for dashboard updates
                socket.join('admin-dashboard')

                // Send initial dashboard data
                socket.emit('dashboard:connected', {
                    message: 'Connected to admin dashboard',
                    timestamp: new Date(),
                })

                // Handle admin requesting specific data
                socket.on('dashboard:request-stats', () => {
                    this.emitToSocket(socket, 'dashboard:stats-requested', {})
                })

                socket.on('dashboard:request-sales', (data: { days?: number }) => {
                    this.emitToSocket(socket, 'dashboard:sales-requested', data)
                })

                socket.on('dashboard:request-users', () => {
                    this.emitToSocket(socket, 'dashboard:users-requested', {})
                })

                socket.on('dashboard:request-products', () => {
                    this.emitToSocket(socket, 'dashboard:products-requested', {})
                })

                socket.on('dashboard:request-activity', () => {
                    this.emitToSocket(socket, 'dashboard:activity-requested', {})
                })
            } else {
                // Regular user connections for order tracking
                socket.join(`user-${socket.data.userId}`)
                
                // Handle joining order tracking rooms
                socket.on('join', (room: string) => {
                    socket.join(room)
                    console.log(`User ${socket.data.userId} joined room: ${room}`)
                })

                socket.on('leave', (room: string) => {
                    socket.leave(room)
                    console.log(`User ${socket.data.userId} left room: ${room}`)
                })
            }

            // Handle disconnect
            socket.on('disconnect', () => {
                console.log(`User disconnected: ${socket.data.userId}`)
                if (socket.data.isAdmin) {
                    this.connectedAdmins.delete(socket.data.userId)
                }
            })
        })
    }

    // Emit updates to all connected admins
    public emitDashboardUpdate(updateData: DashboardUpdateData) {
        this.io.to('admin-dashboard').emit('dashboard:update', updateData)
    }

    // Emit stats update
    public emitStatsUpdate(stats: any) {
        this.emitDashboardUpdate({
            type: 'stats',
            data: stats,
            timestamp: new Date(),
        })
    }

    // Emit sales analytics update
    public emitSalesUpdate(salesData: any) {
        this.emitDashboardUpdate({
            type: 'sales',
            data: salesData,
            timestamp: new Date(),
        })
    }

    // Emit user analytics update
    public emitUsersUpdate(userData: any) {
        this.emitDashboardUpdate({
            type: 'users',
            data: userData,
            timestamp: new Date(),
        })
    }

    // Emit product analytics update
    public emitProductsUpdate(productData: any) {
        this.emitDashboardUpdate({
            type: 'products',
            data: productData,
            timestamp: new Date(),
        })
    }

    // Emit activity update
    public emitActivityUpdate(activity: any) {
        this.emitDashboardUpdate({
            type: 'activity',
            data: activity,
            timestamp: new Date(),
        })
    }

    // Emit notification to admins
    public emitNotification(notification: {
        title: string
        message: string
        type: 'info' | 'success' | 'warning' | 'error'
        data?: any
    }) {
        this.io.to('admin-dashboard').emit('dashboard:notification', {
            ...notification,
            timestamp: new Date(),
        })
    }

    // Private method to emit to specific socket
    private emitToSocket(socket: any, event: string, data: any) {
        socket.emit(event, {
            ...data,
            timestamp: new Date(),
        })
    }

    // Get connected admins count
    public getConnectedAdminsCount(): number {
        return this.connectedAdmins.size
    }

    // Get Socket.IO instance for external use
    public getIO(): SocketIOServer {
        return this.io
    }
}
