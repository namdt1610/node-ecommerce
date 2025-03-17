import express from 'express'
import AuthController from '@/controllers/AuthController'
import verifyToken from '@/middlewares/verifyToken'
import { isAdmin } from '@/middlewares/isAdmin'

const router = express.Router()

// Auth routes
router.post('/login', AuthController.login)
router.post('/register', AuthController.register)
router.get('/refresh', AuthController.refreshToken)
router.post('/logout', AuthController.logout)

router.post('/request-reset-password', AuthController.requestPasswordReset)
router.post('/reset-password', AuthController.resetPassword)
router.post('/request-otp-reset', AuthController.requestOtpReset);
router.post('/reset-password-otp', AuthController.verifyOtpAndResetPassword);

router.put(
    '/change-permission',
    verifyToken,
    isAdmin,
    AuthController.changePermission
)

router.get('/protected', verifyToken, (req, res) => {
    res.json({ message: 'Access granted' })
})

export default router
