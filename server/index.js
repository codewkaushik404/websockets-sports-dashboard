import express from "express";
import {config} from "dotenv";
config({quiet: true});
import connectDB from "./src/config/db.js"; 
import matchRoutes from "./src/routes/matches.routes.js";
import errorHandler from "./src/middleware/errorHandler.js";
import { createWebSocketServer } from "./src/ws/server.js";

import http from "http";

const PORT = process.env.PORT || 8000

const app = express();
const server = http.createServer(app);

app.use(express.json());

app.get("/", (req, res)=> res.send("Hello World"));
app.use("/matches", matchRoutes);

const { broadcastMatchCreated } = createWebSocketServer(server);
app.locals.broadcastMatchCreated = broadcastMatchCreated;

app.use(errorHandler);

(async function(){
    try{
        await connectDB();
        server.listen(PORT, ()=> console.log("Server is running on Port: ",PORT));
    }catch(err){
        console.error("Failed to start server:", err.message);
        process.exit(1);
    }
})();
