import {config} from "dotenv";
config({quiet: true});

import mongoose from "mongoose";

export default async function connectDB(){
    try{
        const connect = await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to DB:", connect.connection.name);

    }catch(err){
        throw new Error("Error while connecting to database :", err.message);
    }
}