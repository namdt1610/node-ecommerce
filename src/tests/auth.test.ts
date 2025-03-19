import request from 'supertest'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import app from '../app'
import User from '../models/UserModel'
import { Token } from '../models/TokenModel'

// Mock data
const testUser = {
    email: 'test@example.com',
    password: 'Password123!',
}

const adminUser = {
    email: 'admin@example.com',
    password: 'Admin123!',
    role: 'admin',
}

let userAccessToken: string
let adminAccessToken: string
let refreshToken: string
let userId: string
let resetToken: string
let otpCode: string

// Setup and teardown
beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(
        process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/test-db'
    )

    // Clear test data
    await User.deleteMany({})
    await Token.deleteMany({})

    // Create admin user for permission tests
    const admin = new User({
        email: adminUser.email,
        password: adminUser.password,
        role: 'admin',
    })
    await admin.save()
})

afterAll(async () => {
    await User.deleteMany({})
    await Token.deleteMany({})
    await mongoose.connection.close()
})

describe('Authentication API', () => {
    describe('POST /api/auth/register', () => {
        it('should register a new user', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send(testUser)
                .expect(201)

            expect(res.body).toHaveProperty('_id')
            expect(res.body.email).toBe(testUser.email)
            expect(res.body).not.toHaveProperty('password') // Password should not be returned

            // Save userId for later tests
            userId = res.body._id
        })

        it('should return 400 if email already exists', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send(testUser)
                .expect(400)

            expect(res.body).toHaveProperty('message')
            expect(res.body.message).toMatch(/already exists/)
        })

        it('should return 400 if email format is invalid', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'invalid-email',
                    password: 'Password123!',
                })
                .expect(400)

            expect(res.body).toHaveProperty('message')
        })
    })

    describe('POST /api/auth/login', () => {
        it('should login user and return tokens', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send(testUser)
                .expect(200)

            expect(res.body).toHaveProperty('user')
            expect(res.body).toHaveProperty('accessToken')
            expect(res.body.message).toBe('Log in successfully')

            // Save access token for protected routes
            userAccessToken = res.body.accessToken

            // Handle set-cookie which could be string, string[] or undefined
            const setCookieHeader = res.headers['set-cookie']
            expect(setCookieHeader).toBeDefined()

            // Convert to array if it's a string
            const cookies = Array.isArray(setCookieHeader)
                ? setCookieHeader
                : [setCookieHeader as string]

            // Extract refresh token from cookies
            const refreshTokenCookie = cookies?.find((cookie) =>
                cookie.startsWith('refreshToken=')
            )
            expect(refreshTokenCookie).toBeDefined()
            refreshToken = refreshTokenCookie
                ?.split(';')[0]
                .replace('refreshToken=', '') as string
        })

        it('should return 401 with invalid credentials', async () => {
            await request(app)
                .post('/api/auth/login')
                .send({
                    email: testUser.email,
                    password: 'wrongpassword',
                })
                .expect(401)
        })
    })

    describe('GET /api/auth/protected', () => {
        it('should allow access with valid token', async () => {
            const res = await request(app)
                .get('/api/auth/protected')
                .set('Authorization', `Bearer ${userAccessToken}`)
                .expect(200)

            expect(res.body.message).toBe('Access granted')
        })

        it('should deny access without token', async () => {
            await request(app).get('/api/auth/protected').expect(401)
        })

        it('should deny access with invalid token', async () => {
            await request(app)
                .get('/api/auth/protected')
                .set('Authorization', 'Bearer invalid_token')
                .expect(401)
        })
    })

    describe('GET /api/auth/refresh', () => {
        it('should issue new access token with valid refresh token', async () => {
            const res = await request(app)
                .get('/api/auth/refresh')
                .set('Cookie', `refreshToken=${refreshToken}`)
                .expect(200)

            expect(res.body).toHaveProperty('accessToken')
            userAccessToken = res.body.accessToken // Update access token
        })

        it('should return 403 without refresh token', async () => {
            await request(app).get('/api/auth/refresh').expect(403)
        })
    })

    describe('POST /api/auth/request-reset-password', () => {
        it('should send password reset email', async () => {
            const res = await request(app)
                .post('/api/auth/request-reset-password')
                .send({ email: testUser.email })
                .expect(200)

            expect(res.body.message).toMatch(/email sent/)

            // Get token from database for testing reset password
            const tokenDoc = await Token.findOne({ userId })
            resetToken = tokenDoc?.token || ''
            expect(resetToken).toBeTruthy()
        })

        it('should return success even if email does not exist (security)', async () => {
            const res = await request(app)
                .post('/api/auth/request-reset-password')
                .send({ email: 'nonexistent@example.com' })
                .expect(200)

            expect(res.body.message).toMatch(/email sent/)
        })
    })

    describe('POST /api/auth/reset-password', () => {
        it('should reset password with valid token', async () => {
            const newPassword = 'NewPassword123!'

            const res = await request(app)
                .post('/api/auth/reset-password')
                .send({
                    token: resetToken,
                    newPassword,
                })
                .expect(200)

            expect(res.body.message).toMatch(/success/)

            // Verify new password works
            const loginRes = await request(app)
                .post('/api/auth/login')
                .send({
                    email: testUser.email,
                    password: newPassword,
                })
                .expect(200)

            expect(loginRes.body).toHaveProperty('accessToken')

            // Update test user password
            testUser.password = newPassword
        })

        it('should reject invalid tokens', async () => {
            await request(app)
                .post('/api/auth/reset-password')
                .send({
                    token: 'invalid_token',
                    newPassword: 'NewPassword456!',
                })
                .expect(400)
        })
    })

    describe('POST /api/auth/request-otp-reset', () => {
        it('should send OTP to user email', async () => {
            const res = await request(app)
                .post('/api/auth/request-otp-reset')
                .send({ email: testUser.email })
                .expect(200)

            expect(res.body.message).toMatch(/OTP sent/)

            // Get OTP from database for testing
            const tokenDoc = await Token.findOne({
                userId,
                type: 'otp',
            })
            otpCode = tokenDoc?.token || ''
            expect(otpCode).toBeTruthy()
        })
    })

    describe('POST /api/auth/reset-password-otp', () => {
        it('should reset password with valid OTP', async () => {
            const newPassword = 'OtpPassword123!'

            const res = await request(app)
                .post('/api/auth/reset-password-otp')
                .send({
                    email: testUser.email,
                    otp: otpCode,
                    newPassword,
                })
                .expect(200)

            expect(res.body.message).toMatch(/success/)

            // Verify new password works
            await request(app)
                .post('/api/auth/login')
                .send({
                    email: testUser.email,
                    password: newPassword,
                })
                .expect(200)
        })

        it('should reject invalid OTP', async () => {
            await request(app)
                .post('/api/auth/reset-password-otp')
                .send({
                    email: testUser.email,
                    otp: '123456', // Invalid OTP
                    newPassword: 'NewPassword789!',
                })
                .expect(400)
        })
    })

    describe('PUT /api/auth/change-permission', () => {
        // First login as admin
        beforeAll(async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send(adminUser)

            adminAccessToken = res.body.accessToken
        })

        it('should allow admin to change user permission', async () => {
            const res = await request(app)
                .put('/api/auth/change-permission')
                .set('Authorization', `Bearer ${adminAccessToken}`)
                .send({
                    userId,
                    permission: 'editor',
                })
                .expect(200)

            expect(res.body.message).toMatch(/updated/)

            // Verify user role was updated
            const updatedUser = await User.findById(userId)
            expect(updatedUser?.role).toBe('editor')
        })

        it('should reject non-admin users', async () => {
            await request(app)
                .put('/api/auth/change-permission')
                .set('Authorization', `Bearer ${userAccessToken}`)
                .send({
                    userId,
                    permission: 'user',
                })
                .expect(403)
        })
    })

    describe('POST /api/auth/logout', () => {
        it('should clear refresh token cookie', async () => {
            const res = await request(app)
                .post('/api/auth/logout')
                .set('Cookie', `refreshToken=${refreshToken}`)
                .expect(200)

            expect(res.body.message).toBe('Logged out successfully')

            // Handle set-cookie which could be string, string[] or undefined
            const setCookieHeader = res.headers['set-cookie']
            expect(setCookieHeader).toBeDefined()

            // Convert to array if it's a string
            const cookies = Array.isArray(setCookieHeader)
                ? setCookieHeader
                : [setCookieHeader as string]

            // Check that refresh token cookie was cleared
            const clearedCookie = cookies?.find((cookie) =>
                cookie.includes('refreshToken=;')
            )
            expect(clearedCookie).toBeDefined()

            // Verify refresh token no longer works
            await request(app)
                .get('/api/auth/refresh')
                .set('Cookie', `refreshToken=${refreshToken}`)
                .expect(403)
        })
    })
})
