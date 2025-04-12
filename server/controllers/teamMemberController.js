import userModel from "../models/user";
import projectModel from "../models/project";
import sprintModel from "../models/sprint";
import taskModel from "../models/task";
import { projectsTaskHandler } from "./scrumMasterController";


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
    
}

const taskUpdateHandler = async(req,res)=>{
    //when one task is completed -> check userstory completed -> check epic completed -> check project completed.
}

const teamMembersHandler = async(req,res)=>{
    
}

const reportPageHandler = async(req,res)=>{
    
}

export {homePageHandler, projectsPageHandler, readProjectHandler,
    readSprintHandler, tasksPageHandler, taskUpdateHandler,
    teamMembersHandler, reportPageHandler
}