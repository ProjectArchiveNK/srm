// db.js
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);
console.log("MongoDB connected");
console.log(mongoose.connection.name);
