"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const bcrypt = __importStar(require("bcryptjs"));
class UserService {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async createUser(createUserDto) {
        const { password, ...userData } = createUserDto;
        const hashedPassword = await bcrypt.hash(password, 10);
        const existingUser = await this.userRepository.findByEmail(createUserDto.email);
        if (existingUser) {
            throw new Error('User already exists');
        }
        const user = (await this.userRepository.create({
            ...userData,
            password: hashedPassword,
            role: {
                connect: { id: createUserDto.roleId },
            },
        }));
        return this.mapToResponseDto(user);
    }
    async getUserById(id) {
        const user = (await this.userRepository.findById(id));
        if (!user) {
            return null;
        }
        return this.mapToResponseDto(user);
    }
    async getUserByEmail(email) {
        const user = (await this.userRepository.findByEmail(email));
        if (!user) {
            return null;
        }
        return this.mapToResponseDto(user);
    }
    async getAllUsers(params) {
        const { skip, take, search } = params || {};
        const where = search
            ? {
                OR: [
                    {
                        name: {
                            contains: search,
                            mode: 'insensitive',
                        },
                    },
                    {
                        email: {
                            contains: search,
                            mode: 'insensitive',
                        },
                    },
                    {
                        username: {
                            contains: search,
                            mode: 'insensitive',
                        },
                    },
                ],
            }
            : undefined;
        const users = (await this.userRepository.findAll({
            skip,
            take,
            where,
            orderBy: { createdAt: 'desc' },
        }));
        return users.map((user) => this.mapToResponseDto(user));
    }
    async updateUser(id, updateUserDto) {
        const updateData = { ...updateUserDto };
        if (updateUserDto.roleId) {
            updateData.role = {
                connect: { id: updateUserDto.roleId },
            };
            delete updateData.roleId;
        }
        const user = (await this.userRepository.update(id, updateData));
        return this.mapToResponseDto(user);
    }
    async deleteUser(id) {
        await this.userRepository.delete(id);
    }
    async getUsersCount(search) {
        const where = search
            ? {
                OR: [
                    {
                        name: {
                            contains: search,
                            mode: 'insensitive',
                        },
                    },
                    {
                        email: {
                            contains: search,
                            mode: 'insensitive',
                        },
                    },
                    {
                        username: {
                            contains: search,
                            mode: 'insensitive',
                        },
                    },
                ],
            }
            : undefined;
        return this.userRepository.count(where);
    }
    mapToResponseDto(user) {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            username: user.username || undefined,
            avatar: user.avatar || undefined,
            status: user.status,
            role: {
                id: user.role.id,
                name: user.role.name,
            },
            favorites: user.favorites,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
}
exports.UserService = UserService;
