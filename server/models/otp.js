import mongoose from "mongoose";
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const otpSchema = new Schema({
    email: {type:String, unique:true, required:true},
    otp: {type:String, default:null},
    otpExpires: {type:Date, default:null},
    isVerified: {type:Boolean, default:false}
});

const otpModel = mongoose.model("otps",otpSchema);

export default otpModel;