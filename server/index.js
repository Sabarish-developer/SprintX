import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from "cors";
import errorHandler from './middleware/errorHandler.js';
import authRouter from './routes/authRoute.js';
import productOwnerRouter from './routes/productOwnerRoute.js';
import scrumMasterRouter from './routes/scrumMasterRoute.js';
import teamMemberRouter from './routes/teamMemberRoute.js';

dotenv.config();
const app = express();
//app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/productowner", productOwnerRouter);
app.use("/api/scrummaster", scrumMasterRouter);
app.use("/api/teammember", teamMemberRouter);

app.use(errorHandler);

const dbConnect = async ()=>{
    try{
        const conn = await mongoose.connect(process.env.DB_CONNECTION_URL);
        console.log("Database connected successfully.");
    }catch(e){
        console.log("Error in connecting db : ",e);
        process.exit(1);
    }
}

const startServer = async ()=>{
    await dbConnect();
    const PORT = process.env.PORT || 3031;
    app.listen(PORT, ()=>{
        console.log(`Server is listening at port ${PORT}`);
    });
}

startServer();