import mongoose from "mongoose";
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const userSchema = new Schema({
    username: {type: String, unique: true, required: true},
    email: {type:String, unique: true, required: true},
    password: {type: String, required: true},
    role: {type: String, enum: ["Team member", "Scrum master", "Product owner", "Admin"], default: "Team member"},
    subrole: {type: String},
    companyId: {type: ObjectId, ref: "companies", required: true}
})

const userModel = mongoose.model("users",userSchema);

export default userModel;
