import mongoose from "mongoose";
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const projectSchema = new Schema({
    title: {type: String, unique: true, required: true}, 
    description: {type: String},
    start: {type: Date, required: true},
    end: {type: Date},
    deadline: {type: Date, required: true},
    status: {type: String, enum: ["Active", "Completed"], default: "Active"},
    productOwnerId: {type: ObjectId, ref: "users", required: true},
    scrumMasterId: {type: ObjectId, ref: "users", required: true},
    teamMembersId: [{type: ObjectId, ref: "users"}]
})

//To ensure product owner can't have duplicate project names but different product owner can have that name
//This is done by compound indexing
projectSchema.index({title: 1, productOwnerId: 1}, {unique: true});

const projectModel = mongoose.model("projects",projectSchema);

export default projectModel;