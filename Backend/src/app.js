import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { toNodeHandler } from "better-auth/node";
// import { auth } from "./auth";
import { auth } from "./libs/auth.js";





const app = express()

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}))
app.all('/api/auth/*splat', toNodeHandler(auth));
// Mount express json middleware after Better Auth handler
// or only apply it to routes that don't interact with Better Auth

app.use(express.json())
app.use(express.urlencoded({extended:true}))

// app.use(express.static('public'))

app.use(cookieParser())


import reportRoutes from './routes/reportRoutes.js';

app.use("/api/reports", reportRoutes)



app.get("/", (req, res)=>{
    return res.status(200).json({message:"Welcome to SweePokhara Backend"})
})

app.post("/api/v1/test", (req, res)=>{
    return res.status(201).json({data:"hi"})
})

// const response = await auth.api.signInEmail({
//     body: {
//         email,
//         password
//     },
//     asResponse: true // returns a response object instead of data
// });

// const session = await auth.api.getSession({
//     headers: await headers()
// });


export default app