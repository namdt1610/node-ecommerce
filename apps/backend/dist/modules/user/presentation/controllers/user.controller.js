"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const dto_1 = require("../../application/dto");
class UserController {
    getUserProfileUseCase;
    updateUserProfileUseCase;
    getAllUsersUseCase;
    deleteUserUseCase;
    constructor(getUserProfileUseCase, updateUserProfileUseCase, getAllUsersUseCase, deleteUserUseCase) {
        this.getUserProfileUseCase = getUserProfileUseCase;
        this.updateUserProfileUseCase = updateUserProfileUseCase;
        this.getAllUsersUseCase = getAllUsersUseCase;
        this.deleteUserUseCase = deleteUserUseCase;
    }
    async getProfile(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res
                    .status(401)
                    .json({ error: 'Authentication required' });
            }
            const user = await this.getUserProfileUseCase.execute(userId);
            res.json({
                success: true,
                data: user,
            });
        }
        catch (err) {
            res.status(404).json({ error: err.message });
        }
    }
    async updateProfile(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res
                    .status(401)
                    .json({ error: 'Authentication required' });
            }
            const parsed = dto_1.UpdateUserSchema.safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({ error: parsed.error.errors });
            }
            const user = await this.updateUserProfileUseCase.execute(userId, parsed.data);
            res.json({
                success: true,
                data: user,
            });
        }
        catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
    async getAllUsers(req, res) {
        try {
            const { page = '1', limit = '10', search } = req.query;
            const skip = (parseInt(page) - 1) * parseInt(limit);
            const take = parseInt(limit);
            const users = await this.getAllUsersUseCase.execute({
                skip,
                take,
                search: search,
            });
            res.json({
                success: true,
                data: users,
            });
        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
    async deleteUser(req, res) {
        try {
            const { id } = req.params;
            await this.deleteUserUseCase.execute(id);
            res.json({
                success: true,
                message: 'User deleted successfully',
            });
        }
        catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
}
exports.UserController = UserController;
