import userModel from "../models/user.js";
import projectModel from "../models/project.js";
import sprintModel from "../models/sprint.js";
import epicModel from "../models/epic.js";
import taskModel from "../models/task.js";
import mongoose from "mongoose";

const homePageHandler = async(req,res)=>{

    try{
        const userId = req.user.id;
        const projects = await projectModel.find({productOwnerId: userId, status: "Active"});
        if(projects.length == 0){
            return res.status(404).json({message: "No projects found."});
        }

        const sortedProjects = projects.sort((a,b)=> new Date(a.deadline) - new Date(b.deadline));
        const currentProject = sortedProjects[0];

        const epics = await epicModel.find({projectId: currentProject._id});
        
        return res.status(200).json({
            message: "Welcome back!", 
            username: req.user.username,
            project: currentProject, 
            epics: epics
        });

    }catch(e){
        console.log("Error in home page block : ",e);
        return res.status(500).json({message: "Internal server error. Please try again later."});
    }
}

const projectsPageHandler = async(req,res)=>{

    try{
        const userId = req.user.id;
        const projects = await projectModel.find({productOwnerId: userId}).select("name description start deadline status");

        if(projects.length == 0)
            return res.status(200).json({message: "No projects found. Start by creating a project."});
        else
            return res.status(200).json({data: projects, message: "Projects retrieved successfully."});
    }catch(e){
        console.log("Error in projects page Handler block : ",e);
        return res.status(500).json({message: "Error in retrieving projects. Kindly try again later."});
    }
    
}

const companyMembersHandler = async(req,res)=>{

    try{
        const user = await userModel.findById(req.user.id);
        const companyId = user.companyId;
        const teamMembers = await userModel.find({companyId, role: "Team member"}).select("username");
        const scrumMasters = await userModel.find({companyId, role: "Scrum master"}).select("username");
        if(teamMembersMembers.length == 0)
            return res.status(404).json({message: "No team members found."});
        else if(scrumMasters.length == 0)
                return res.status(404).json({message: "No scrum masters found."});
        else
            return res.status(200).json({message: "Members found successfully.", scrumMasters, teamMembers});
    }catch(e){
        console.log("Error in retreiving company members block : ",e);
        return res.status(500).json({message: "Internal server error. Please try again later."});
    }
}

const createProjectHandler = async(req,res)=>{
    
    try{
        const productOwnerId = req.user.id;
        const {title, description, start, deadline, scrumMasterId, teamMembersId} = req.body;
        if(!title.trim() || !description.trim() || !start || !deadline || !scrumMasterId || !teamMembersId || teamMembersId.length==0){
            return res.status(400).json({message: "All fields are required."});
        }

        await projectModel.create({
            title: title.trim(),
            description: description.trim(),
            start,
            deadline,
            productOwnerId,
            scrumMasterId,
            teamMembersId
        });

        return res.status(200).json({message: "Project created successfully."});

    }catch(e){
        console.log("Error in create project handler block : ",e);
        return res.status(500).json({message: "Internal server error. Please try again later."});
    }
}

const editProjectHandler = async(req,res)=>{

    try{
        const projectId = req.params.id;
        if(!projectId){
            return res.status(400).json({message: "Project Id is required."});
        }

        let project = await projectModel.findById(projectId);
        if(!project){
            return res.status(404).json({message: "Project not found."});
        }

        project.set(req.body); // Here project is mongoose document, if we assign = it becomes a plain object, so no mongoose methods will be available
        await project.save();
        return res.status(200).json({message: "Project updated successfully."});

    }catch(e){
        console.log("Error in edit project block: ",e);
        return res.status(500).json({message: "Internal server error. Please try again later."});
    }
}

const deleteProjectHandler = async(req,res)=>{

    try{
        const {projectId} = req.body;
        const result = await projectModel.deleteOne({_id: projectId});
        if(result.deletedCount == 1)
            return res.status(200).json({message: "Project deleted successfully."});
        else
            return res.status(404).json({message: "Project not found."});

    }catch(e){
        console.log("Error in delete project block: ",e);
        return res.status(500).json({message: "Internal server error. Please try again later."});
    }
}

const readProjectHandler = async(req,res)=>{

    try{
        const projectId = req.params.id;
        if(!projectId){
            return res.status(400).json({message: "Project Id id required."});
        }

        const sprints = await sprintModel.find({projectId});
        if(sprints.length == 0)
            return res.status(404).json({message: "No sprints found."});
        else
            return res.status(200).json({message: "Sprints found successfully.", data: sprints});

    }catch(e){
        console.log("Error in read project block: ",e);
        return res.status(500).json({message: "Internal server error. Please try again later."});
    }
}

const epicsPageHandler = async(req,res)=>{
    
    try{
        const projectId = req.params.id;
        if(!projectId){
            return res.status(400).json({message: "Project Id is required."});
        }
        const epics = await epicModel.find({projectId});
        if(epics.length == 0)
            return res.status(404).json({message: "No epics found."});
        else
            return res.status(200).json({message: "Epics found successfully.", data: epics});
    }catch(e){
        console.log("Error in epic page block: ",e);
        return res.status(500).json({message: "Internal server error. Please try again later."});
    }
}

const createEpicHandler = async(req,res)=>{
    
    try{
        const projectId = req.params.id;
        if(!projectId){
            return res.status(400).json({message: "Project Id is required."});
        }
        const {title, description, priority, deadline} = req.body;
        if(!title.trim() || !description.trim() || !priority || !deadline){
            return res.status(400).json({message: "All fields are required."});
        }
        if(priority!="High" && priority!="Medium" && priority!="Low"){
            return res.status(400).json({message: "Priority field is not valid."});
        }

        const productOwnerId = req.user.id;
        await epicModel.create({
            title: title.trim(),
            description: description.trim(),
            priority,
            deadline,
            productOwnerId,
            projectId
        });
        return res.status(201).json({message: "Epic created successfully."});

    }catch(e){
        console.log("Error in create epic block: ",e);
        return res.status(500).json({message: "Internal server error. Please try again later."});
    }
}

const editEpicHandler = async(req,res)=>{

    try{
        const epicId = req.params.epicId;
        if(!epicId){
            return res.status(400).json({message: "Epic Id is required."});
        }
        const epic = await epicModel.findById(epicId);
        if(!epic){
            return res.status(404).json({message: "Epic not found."});
        }
        const { priority } = req.body;
        if (priority != "High" && priority != "Medium" && priority != "Low"){
            return res.status(400).json({ message: "Priority field is not valid." });
        }   
        epic.set(req.body);
        await epic.save();
        return res.status(200).json({message: "Epic updated successfully."});

    }catch(e){
        console.log("Error in edit epic block: ",e);
        return res.status(500).json({message: "Internal server error. Please try again later."});
    }
}

const deleteEpicHandler = async(req,res)=>{

    try{
        const {epicId} = req.body;
        if(!epicId){
            return res.status(400).json({message: "Epic Id is required."});
        }
        const result = await epicModel.deleteOne({_id: epicId});
        if(result.deletedCount == 1)
            return res.status(200).json({message: "Epic deleted succesfully."});
        else
            return res.status(404).json({message: "Epic not found."});

    }catch(e){
        console.log("Error in delete epic block: ",e);
        return res.status(500).json({message: "Internal server error. Please try again later."});
    }
}

const readSprintHandler = async(req,res)=>{

    try{
        const sprintId = req.params.id;
        if(!sprintId){
            return res.status(400).json({message: "Sprint Id is required."});
        }
        const sprint = await sprintModel.findById(sprintId);
        if(!sprint){
            return res.status(404).json({message: "Sprint doesn't exist."});
        }

        const tasks = await taskModel.find({sprintId});
        if(tasks.length == 0)
            return res.status(404).json({message: "Tasks not found."});
        else    
            return res.status(200).json({message: "Tasks found successfully.", data: tasks});
    }catch(e){
        console.log("Error in read sprint block: ",e);
        return res.status(500).json({message: "Internal server error. Please try again later."});
    }
}

const teamMembersHandler = async(req,res)=>{

    //Before hitting this endpoint, first display all projects by hitting projects page handler endpoint and in that user clicks any project
    //send with that id

    try{
        const projectId = req.params.id;
        if(!projectId){
            return res.status(400).json({message: "Project Id is required."});
        }
        const project = await projectModel.findById(projectId);
        if(!project){
            return res.status(404).json({message: "Project not found."});
        }

        const scrumMasterId = project.scrumMasterId;
        const scrumMaster = await userModel.findById(scrumMasterId).select("username email");

        const teammembersId = project.teamMembersId;
        const teamMembers = await userModel.find({_id: {$in: teammembersId}}).select("username email subrole");
        if(!scrumMaster || teamMembers.length==0)
            return res.status(404).json({message: "Scrum master or Team members doesn't exist."});
        else
            return res.status(200).json({message: "Team members found successfully.", scrumMaster, teamMembers});

    }catch(e){
        console.log("Error in team members block: ",e);
        return res.status(500).json({message: "Internal server error. Please try again later."});
    }
}

const reportPageHandler = async(req,res)=>{

    try{
        const productOwnerId = req.user.id;
        
        const userEpics = await epicModel.find({productOwnerId});

        //Fetching in hierarchy {{project,sprint,epic},....}
        const userProjects = await projectModel.aggregate([
            {
                $match: {
                    productOwnerId: new mongoose.Types.ObjectId(productOwnerId)
                }
            },
            {
                $lookup: {
                    from: 'sprints',
                    localField: '_id',
                    foreignField: 'projectId',
                    as: 'sprints'
                }
            },
            {
                $lookup: {
                    from: 'epics',
                    localField: '_id',
                    foreignField: 'projectId',
                    as: 'epics'
                }
            }
        ]);

        return res.status(200).json({
            message: "Reports fetched successfully.", 
            projects: userProjects, 
            epics: userEpics
        });

    }catch(e){
        console.log("Error in report block: ",e);
        return res.status(500).json({message: "Internal server error. Please try again later."});
    }
}

export {homePageHandler, companyMembersHandler, projectsPageHandler, readProjectHandler, createProjectHandler, editProjectHandler, deleteProjectHandler, 
    epicsPageHandler, createEpicHandler, editEpicHandler, deleteEpicHandler,
    readSprintHandler, teamMembersHandler, reportPageHandler
}