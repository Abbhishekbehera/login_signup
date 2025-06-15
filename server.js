import express from 'express'
import bcrypt from 'bcrypt'
import { connectDB } from './config/db.js'
import dotenv from 'dotenv'
import User from './models/userModel.js'
import jwt from 'jsonwebtoken'
import { authMiddleware } from './middleware/authMiddleware.js'

const app = express()
const jwt_secret_key=process.env.secret_key
//Configuring env variables
dotenv.config()


//Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))



//Database connection
connectDB()

//Register
app.post('/api/register', async (req, res) => {

    const { username, email, password } = req.body
    try {
        const existingEmail = await User.findOne({ email })

        if (existingEmail) {
            res.status(409).send("User already exists")
            console.log(existingEmail)
        }

        const hashedPass = await bcrypt.hash(password, 10)

        const newUser = new User({
            username,
            email,
            password: hashedPass
        })
        await newUser.save()
        console.log(newUser)

        res.status(201).send('User registered successfully');
    }
    catch (e) {
        res.status(500).json({ msg: "Error while registering" })
    }
})
//Login
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body

    try {
        const existingUser = await User.findOne({ username })

        if (!existingUser) {
            res.status(404).send("User does not exist")
        }

        const comparePassword = await bcrypt.compare(password, existingUser.password)
        if (!comparePassword) {
            return res.status(401).send("Incorrect Password")
        }
        const token = jwt.sign({
            username: existingUser.username
        },jwt_secret_key, {
            expiresIn: '1h'
        })
        res.json({ token })
    } catch (e) {
        res.status(500).json({ msg: "Error in login process" })
    }
})

//Using AuthMiddleware
app.get('/dashboard',authMiddleware,(req,res)=>{
    res.json({msg:"Welcome"})
})

//Server
app.listen(process.env.PORT, () => {
    console.log(`Server is running on the port ${process.env.PORT}`)
})
