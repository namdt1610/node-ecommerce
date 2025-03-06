import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

/**
 * Xử lý upload ảnh và lưu vào thư mục /uploads
 * @param fileBuffer Buffer của file ảnh
 * @returns Đường dẫn file WebP
 */
export const uploadImage = async (fileBuffer: Buffer): Promise<string> => {
    const uploadDir = 'uploads'
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir)
    }

    const fileName = `${Date.now()}.webp`
    const webpPath = path.join(uploadDir, fileName)

    // ✅ Sửa lỗi: Chuyển đổi từ buffer
    await sharp(fileBuffer).toFormat('webp').toFile(webpPath)

    return fileName // Trả về tên file, không cần 'uploads/'
}
