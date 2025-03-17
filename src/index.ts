import app from './app'
import connectDB from './config/dbConfig'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({
    path: path.resolve(__dirname, `../.env.${process.env.NODE_ENV}`),
})

console.log('Environment variables loaded:')
console.log('- NODE_ENV:', process.env.NODE_ENV)
console.log('- PORT:', process.env.PORT)
console.log('- MONGO_URI:', process.env.MONGO_URI ? '***exists***' : 'missing')
console.log('- MAIL_HOST:', process.env.MAIL_HOST)
console.log('- MAIL_USER:', process.env.MAIL_USER ? '***exists***' : 'missing')
console.log('Loading environment file:', `.env.${process.env.NODE_ENV}`)
console.log('NODE_ENV:', process.env.NODE_ENV)

connectDB()

const port = process.env.PORT

app.listen(port, () => {
    console.log(`Server running on port http://localhost:${port}`)
    console.log('Current evironment:', process.env.NODE_ENV)
})
