'use strict'
const app = require('.') // Import ứng dụng Express đã cấu hình
const connectDB = require('./config/dbConfig') // Import cấu hình kết nối MongoDB
const dotenv = require('dotenv') // Import thư viện dotenv
dotenv.config() // Đọc các biến môi trường từ file .env
// Kết nối MongoDB
connectDB()
const port = process.env.PORT || 8888
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
