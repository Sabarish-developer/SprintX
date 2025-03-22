import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {type: String},
    email: {type:String, unique: true},
    password: {type: String},
    role: {type: String, enum: ["Team member", "Scrum master", "Product owner", "Admin"]},
    subrole: {type: String}
})

const userModel = mongoose.model("users",userSchema);

export default userModel;
