import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import authRouter from './routes/authRoute';
import adminRouter from './routes/adminRoute';
import productOwnerRouter from './routes/productOwnerRoute';
import scrumMasterRouter from './routes/scrumMasterRoute';
import teamMemberRouter from './routes/teamMemberRoute';
import errorHandler from './middleware/errorHandler';

dotenv.config();
const app = express();
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/teamMember", teamMemberRouter);
app.use("/api/scrumMaster", scrumMasterRouter);
app.use("/api/productOwner", productOwnerRouter);
app.use("/api/admin", adminRouter);

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