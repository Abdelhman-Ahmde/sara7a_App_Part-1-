import mongoose from "mongoose";
import { DB_URL } from "../../config/config.service.js";

const connectDB = async () => {
    try {
        mongoose.connection.on("connected", () => {
            console.log("Connected to MongoDB");
        });
        mongoose.connect(DB_URL,{
            serverSelectionTimeoutMS: 5000
        })
    } catch (error) {
        console.log("Error connecting to MongoDB:", error);
    }
}

export default connectDB;