import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const companySchema = new Schema({
    name: {type: String, required: true, unique: true},
    owner: {type:String, required: true},
    location: {type: String, default: "Not specified"}
})

companySchema.index({name: 1}, {unique: true});

const companyModel = mongoose.model("companies", companySchema);

export default companyModel;