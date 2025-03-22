import mongoose from "mongoose";
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const userStorySchema = new Schema({
    title: {type:String, required:true},
    description: {type:String},
    priority: {type:String, enum:["High", "Medium", "Low"], default: "Medium"},
    status: {type:String, enum:["Active", "Completed"], default:"Active"},
    deadline: {type:Date, required:true},
    end: {type:Date},
    scrumMasterId: {type:ObjectId, ref:"users", required:true},
    projectId: {type:ObjectId, ref:"projects", required:true},
    sprintId: {type:ObjectId, ref:"sprints", required:true},
    epicId: {type:ObjectId, ref:"epics", required:true}
})

userStorySchema.index({title:1,projectId:1}, {unique:true});

const userStoryModel = mongoose.model("userStories", userStorySchema);

export default userStoryModel;