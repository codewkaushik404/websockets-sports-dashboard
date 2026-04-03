import express from "express";
import {config} from "dotenv";
config({quiet: true});
import connectDB from "./src/config/db.js"; 
import matchRoutes from "./src/routes/matches.routes.js";

const app = express();
const PORT = process.env.PORT || 8000

app.use(express.json());

app.get("/", (req, res)=> res.send("Hello World"));
app.use("/matches", matchRoutes);

(async function(){
    try{
        await connectDB();
        app.listen(PORT, ()=> console.log("Server is running on Port: ",PORT));
    }catch(err){
        console.error("Failed to start server:", err.message);
        process.exit(1);
    }
})();
