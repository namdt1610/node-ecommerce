import cors from 'cors'
import express from 'express'

const app = express()

const corsOptions = {
    origin: 'http://localhost:3000', // Địa chỉ frontend của bạn
    credentials: true, // Cho phép gửi cookie
}

app.use(cors(corsOptions))

export default corsOptions
