import express, { Request, Response } from 'express'
import upload from '../middlewares/multer-config'
import { uploadImage } from '../utils/uploadImage'
import Product from '../models/ProductModel'
import User from '../models/UserModel'
import Category from '../models/CategoryModel'
import mongoose from 'mongoose'

const router = express.Router()

const modelMap: Record<string, mongoose.Model<any>> = {
    product: Product,
    user: User,
    category: Category,
}

router.post(
    '/upload',
    upload.single('file'),
    async (req: Request, res: Response): Promise<void> => {
        try {
            if (!req.file) {
                res.status(400).json({ message: 'No file uploaded' })
                return
            }

            const { modelType, id } = req.body
            console.log('modelType:', modelType)
            console.log('id:', id)

            if (!modelType || !id) {
                res.status(400).json({ message: 'Missing modelType or id' })
                return
            }

            if (!mongoose.Types.ObjectId.isValid(id)) {
                res.status(400).json({ message: 'Invalid ID format' })
                return
            }

            const model = modelMap[modelType]
            if (!model) {
                res.status(400).json({ message: 'Invalid modelType' })
                return
            }

            const imageUrl = await uploadImage(req.file.buffer)

            const updatedDoc = await model.findOneAndUpdate(
                { _id: id },
                { imageUrl },
                { new: true }
            )

            if (!updatedDoc) {
                res.status(404).json({ message: 'Document not found' })
                return
            }
            res.setHeader('Content-Type', 'application/json')
            res.status(200).json({
                message: 'Upload successfully',
                imageUrl,
            })
        } catch (error) {
            console.error('Upload error:', error)
            res.status(500).json({ message: 'Upload failed', error })
        }
    }
)

export default router
