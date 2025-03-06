import express from 'express'
import AuthController from '@/controllers/AuthController'
import verifyToken from '@/middlewares/verifyToken'

const router = express.Router()

// Auth routes
router.post('/login', AuthController.login)
router.post('/register', AuthController.register)
router.get('/refresh', AuthController.refreshToken)
router.post('/logout', AuthController.logout)
router.get('/protected', verifyToken, (req, res) => {
    res.json({ message: 'Access granted' })
})

export default router
