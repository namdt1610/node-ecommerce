"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const login_dto_1 = require("../../application/dto/login.dto");
class AuthController {
    registerUseCase;
    loginUseCase;
    constructor(registerUseCase, loginUseCase) {
        this.registerUseCase = registerUseCase;
        this.loginUseCase = loginUseCase;
    }
    async register(req, res) {
        try {
            const result = await this.registerUseCase.execute(req.body);
            res.cookie('refreshToken', result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            res.status(201).json({
                user: result.user,
                accessToken: result.accessToken,
            });
        }
        catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
    async login(req, res) {
        try {
            const parsed = login_dto_1.LoginSchema.safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({ error: parsed.error.errors });
            }
            const result = await this.loginUseCase.execute(parsed.data);
            res.cookie('refreshToken', result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            res.status(200).json({
                user: result.user,
                accessToken: result.accessToken,
            });
        }
        catch (err) {
            res.status(401).json({ error: err.message });
        }
    }
    async logout(req, res) {
        try {
            // Clear the refresh token cookie
            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
            });
            res.status(200).json({
                message: 'Logout successful',
            });
        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}
exports.AuthController = AuthController;
