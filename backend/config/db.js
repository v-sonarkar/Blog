import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();


export const connectDB = async () => {
    try {
   mongoose.connection.on('connected', () => {
     console.log('Mongoose connected to DB');
   });


        await mongoose.connect(`${process.env.MONGODB_URI}/Quick_Blog`

        );
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.log("MongoDB connection failed:", error);
    };
}
