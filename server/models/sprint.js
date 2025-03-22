import mongoose from "mongoose";
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const sprintSchema = new Schema({
    title: {type:String, required:true},
    start: {type:Date, required:true},
    deadline: {type:Date, required:true},
    end: {type:Date},
    status: {type:String, enum:["Active", "Completed"], default:"Active"},
    projectId: {type:ObjectId, ref:"projects", required:true},
    scrumMasterId: {type:ObjectId, ref:"users", required:true}
})

sprintSchema.index({title:1, projectId:1}, {unique:true});

const sprintModel = mongoose.model("sprints",sprintSchema); 

export default sprintModel;