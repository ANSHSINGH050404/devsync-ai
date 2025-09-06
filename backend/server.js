import app from "./app.js";
import http from 'http'
import dotenv from 'dotenv'
import { connectDB } from "./db/db.js";


dotenv.config();
connectDB();

const port=process.env.PORT;

const server= http.createServer(app)


server.listen(port,()=>{
    console.log(`Server running on port:${port}`);
    
})