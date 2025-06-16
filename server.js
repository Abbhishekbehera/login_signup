import express from 'express'
import { connectDB } from './config/db.js'
import dotenv from 'dotenv'
import { authMiddleware } from './middleware/authMiddleware.js'
import authRouter from './routes/authRoutes.js'

const app = express()
const jwt_secret_key=process.env.secret_key
//Configuring env variables
dotenv.config()


//Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))



//Database connection
connectDB()

//Router Middleware
app.use('/api',authRouter)

//Using AuthMiddleware
app.get('/dashboard',authMiddleware,(req,res)=>{
    res.json({msg:"Welcome"})
})

//Server
app.listen(process.env.PORT, () => {
    console.log(`Server is running on the port ${process.env.PORT}`)
})
