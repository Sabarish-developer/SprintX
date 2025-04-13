import userModel from "../models/user.js";
import projectModel from "../models/project.js";
import sprintModel from "../models/sprint.js";
import taskModel from "../models/task.js";
import mongoose from "mongoose";
import progressUpdater from "../utils/progressUpdater.js";


const homePageHandler = async(req,res)=>{
    
    try{
        const userId = req.user.id;
        if(!userId){
            return res.status(400).json({message: "User Id is required."});
        }
        const projects = await projectModel.find({teamMembersId: userId});
        if(projects.length == 0)
            return res.status(200).json({message: "No projects found.", projects: []});

        const sortedProjects = projects.sort((a,b)=> new Date(a.deadline) - new Date(b.deadline));
        const currentProject = sortedProjects[0];

        const tasks = await taskModel.find({projectId: currentProject._id});
        return res.status(200).json({
            message: "Welcome back!",
            project: currentProject,
            tasks
        });
    }catch(e){
        console.log("Error in home page block: ",e);
        return res.status(500).json({message: "Internal server error. Please try again later."});
    }
}

const projectsPageHandler = async(req,res)=>{
    
    try{
        const userId = req.user.id;
        if(!userId){
            return res.status(400).json({message: "User Id is required."});
        }
        const projects = await projectModel.find({teamMembersId: userId});
        if(projects.length == 0)
            return res.status(200).json({message: "No projects found.", projects: []});
        else
            return res.status(200).json({message: "Projects retrieved successfully.", projects});
    }catch(e){
        console.log("Error in projects block: ",e);
        return res.status(500).json({message: "Internal server error. Please try again later."});
    }
}

const readProjectHandler = async(req,res)=>{
    
    try{
        const projectId = req.params.projectId;
        if(!projectId){
            return res.status(400).json({message: "Project Id is required."});
        }
        const sprints = await sprintModel.find({projectId});
        if(sprints.length == 0)
            return res.status(200).json({message: "No sprints found", sprints: []});
        else
            return res.status(200).json({message: "Sprints retrieved successfully.", sprints});
    }catch(e){
        console.log("Error in read project block: ",e);
        return res.status(500).json({message: "Internal server error. Please try again later."});
    }
}

const readSprintHandler = async(req,res)=>{
    //only his assigned task
    try{
        const sprintId = req.params.sprintId;
        if(!sprintId){
            return res.status(400).json({message: "Sprint Id is required."});
        }
        const userId = req.user.id;
        if(!userId){
            return res.status(400).json({message: "User Id is required."});
        }

        const assignedTasks = await taskModel.find({sprintId, teamMemberId: userId});
        if(assignedTasks.length == 0)
            return res.status(200).json({message: "No tasks found.", assignedTasks: []});
        else
            return res.status(200).json({message: "Tasks retrieved successfully.", assignedTasks})
    }catch(e){
        console.log("Error in read sprint block: ",e);
        return res.status(500).json({message: "Internal server error. Please try again later."});
    }
}

const tasksPageHandler = async(req,res)=>{
    
    try{
        const projectId = req.params.id;
        if(!projectId){
            return res.status(400).json({message: "Project Id is required."});
        }
        const userId = req.user.id;
        if(!userId){
            return res.status(400).json({message: "User Id is required."});
        }
        const tasks = await taskModel.find({projectId, teamMemberId: userId});
        if(tasks.length == 0)
            return res.status(200).json({message: "No tasks found.", tasks: []});
        else
            return res.status(200).json({message: "Tasks retrieved successfully.", tasks});
    }catch(e){
        console.log("Error in task page block: ",e);
        return res.status(500).json({message: "Internal server error. Please try again later."});
    }
}

const taskUpdateHandler = async(req,res)=>{
    //when one task is completed -> check userstory completed -> check epic completed -> check project completed.
    try{
        const taskId = req.params.id;
        const {status} = req.body;

        const task = await taskModel.findByIdAndUpdate(taskId, {status});
        if(status === "Completed"){
            await progressUpdater(taskId);
        }

        return res.status(200).json({message: "Task updated successfully."});
    }catch(e){
        console.log("Error in task update block: ",e);
        return res.status(500).json({message: "Internal server error. Please try again later."});
    }
}

const teamMembersHandler = async(req,res)=>{
    
    try{
        const projectId = req.params.id;
        if(!projectId){
            return res.status(400).json({message: "Project Id is required."});
        }
        const project = await projectModel.findById(projectId);
        if(!project){
            return res.status(200).json({message: "Project doesn't exist."});
        }

        const productOwnerId = project.productOwnerId;
        const productOwner = await userModel.findById(productOwnerId).select("username email");

        const scrumMasterId = project.scrumMasterId;
        const scrumMaster = await userModel.findById(scrumMasterId).select("username email");

        let teamMembersId = project.teamMembersId;
        const userId = req.user.id;
        const newTeamMembersId = teamMembersId.filter((id)=> id.toString() !== userId.toString());
        const newTeamMembers = await userModel.find({_id: {$in: newTeamMembersId}}).select("username email subrole");

        if(productOwner && scrumMaster && newTeamMembers)
            return res.status(200).json({message: "All roles are present", productOwner, scrumMaster, teamMembers: newTeamMembers});
        else
            return res.status(200).json({message: "All roles are not present.", productOwner, scrumMaster, teamMembers: newTeamMembers});
    }catch(e){
        console.log("Error in team member block: ",e);
        return res.status(500).json("Internal server error. Please try again later.");
    }
}

const reportPageHandler = async(req,res)=>{
    
    try{
        const userId = req.user.id;
        
        const tasks = await taskModel.find({teamMemberId: userId});

        const userProjects = await project.aggregate([
            {
                $match: {
                    teamMembersId: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $lookup: {
                    from: "tasks",
                    localField: "_id",
                    foreignField: "projectId",
                    as: "tasks"
                }
            }
        ]);
        return res.status(200).json({
            message: "Report retrieved successfully.",
            projects: userProjects,
            tasks
         });
    }catch(e){
        console.log("Error in report block: ",e);
        return res.status(500).json({message: "Internal server error. Please try again later."});
    }
}

export {homePageHandler, projectsPageHandler, readProjectHandler,
    readSprintHandler, tasksPageHandler, taskUpdateHandler,
    teamMembersHandler, reportPageHandler
}