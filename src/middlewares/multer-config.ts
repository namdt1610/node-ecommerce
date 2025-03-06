import multer from 'multer'

const storage = multer.memoryStorage() // Không lưu file gốc vào ổ cứng

const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // Giới hạn 2MB
})

export default upload
