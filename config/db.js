import mongoose from "mongoose";
import dotenv from 'dotenv'


dotenv.config()

export const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log("Connected to DB")
    }
    catch(e){
        console.log(e)
    }
    
}

