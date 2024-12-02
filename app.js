import express, { urlencoded } from "express"
import mongoose from "mongoose"
import userRouter from "./Routes/user.router.js"
import 'dotenv/config'
import cookieParser from "cookie-parser"
import cors from "cors"

let app = express();
let PORT = 8000 || 8080;

app.use(express.json())
app.use(urlencoded({extended:true}));
app.use(cookieParser())
app.use(cors({
    origin: "https://tobishop.netlify.app",
    credentials: true
}))

app.use("/users", userRouter)

async function dbConnect() {
    await mongoose.connect(process.env.MONGODB_URI)
}

dbConnect().then(()=>{
    console.log("db connected");
    app.listen(PORT)
}).catch((err)=>{
    console.log(err);
})

