import mongoose from "mongoose";
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const taskSchema = new Schema({
    title: {type:String, required:true},
    description: {type:String},
    priority: {type:String, enum:["High", "Medium", "Low"], default: "Medium"},
    status: {type:String, enum:["Todo", "In Progress", "Testing", "Completed", "Need Review"], default:"Todo"},
    deadline: {type:Date, required:true},
    end: {type:Date},
    teamMemberId: {type:ObjectId, ref:"users", required:true},
    projectId: {type:ObjectId, ref:"projects", required:true},
    sprintId: {type:ObjectId, ref:"sprints"},
    epicId: {type:ObjectId, ref:"epics"},
    userStoryId: {type:ObjectId, ref:"userStories", required:true}
})

taskSchema.index({title:1, projectId:1}, {unique:true});

const taskModel = mongoose.model("tasks", taskSchema);

export default taskModel;