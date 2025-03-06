import { Request, Response } from 'express'
import upload from '../middlewares/multer-config' // Đảm bảo bạn đã import multer configuration

// API upload avatar
export const uploadImage = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        // Middleware Multer sẽ xử lý việc tải file lên
        upload.single('file')(req, res, (err: any) => {
            if (err) {
                return res.status(500).json({ message: 'File upload error' })
            }
            // Kiểm tra xem file đã được upload chưa
            if (!req.file) {
                return res.status(400).json({ message: 'No file uploaded' })
            }

            // Tiến hành xử lý file, ví dụ lưu đường dẫn vào cơ sở dữ liệu
            const filePath = req.file.path
            console.log('File uploaded:', filePath)

            // Trả về kết quả
            res.status(200).json({
                message: 'File uploaded successfully',
                filePath,
            })
        })
    } catch (error) {
        console.error('Error uploading file:', error)
        res.status(500).json({ message: 'Could not upload file' })
    }
}
