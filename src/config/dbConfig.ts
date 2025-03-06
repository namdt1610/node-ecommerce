const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('Connected to database')
    } catch (error: any) {
        console.error(`Error: ${error.message}`)
        process.exit(1)
    }
}

export default connectDB
