import express from "express";
import {config} from "dotenv";
config({quiet: true});

const app = express();
const PORT = process.env.PORT || 8000

app.use(express.json());

app.get("/", (req, res)=> res.send("Hello World"));

app.listen(PORT, ()=> console.log("Server is running on Port: ",PORT));