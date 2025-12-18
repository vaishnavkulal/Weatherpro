import express from "express";
const app = express()
import cors from "cors";
app.use(express.json());
app.use(cors());
import dotenv from "dotenv";
dotenv.config();
const PORT=process.env.PORT;

import weatherRouter from "../routes/userRoutes.js";

app.use('/weather',weatherRouter);

app.get(`/health`,()=>{
    console.log("port working fine\n");
})
app.listen(PORT,()=>{
    console.log(`server is live at port ${PORT}`);
})

