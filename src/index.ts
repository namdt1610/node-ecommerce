import app from './app'
import connectDB from './config/dbConfig'
import dotenv from 'dotenv'

dotenv.config()
connectDB()

const port = process.env.PORT || 8888
app.listen(port, () => {
    console.log(`Server running on port http://localhost:${port}`)
})