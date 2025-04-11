import projectModel from "../models/project.js";
import userStoryModel from "../models/userStory.js";
import taskModel from "../models/task.js";
import sprintModel from "../models/sprint.js";
import companyModel from "../models/company.js";

const homePageHandler = async(req,res)=>{

    try{
        const userId = req.user.id;
        const projects = await projectModel.find({scrumMasterId: userId, status: "Active"});
        if(projects.length == 0){
            return res.status(404).json({message: "No projects found."});
        }

        const sortedProjects = projects.sort((a,b)=> new Date(a.deadline) - new Date(b.deadline));
        const currentProject = sortedProjects[0];

        const userStories = await userStoryModel.find({projectId: currentProject._id});

        return res.status(200).json({
            message: "Welcome back!",
            username: req.user.username,
            project: currentProject,
            userStories
        });
    }catch(e){
        console.log("Error in home block: ",e);
        return res.status(500).json({message: "Internal server error. Please try again later."});
    }
}

const projectsPageHandler = async(req,res)=>{

}

const readProjectHandler = async(req,res)=>{

}

const userStoriesPageHandler = async(req,res)=>{
    
}

const readUserStoriesHandler = async(req,res)=>{
    
}

const projectEpicsHandler = async(req,res)=>{
    
}

const createUserStoriesHandler = async(req,res)=>{
    
}

const deleteUserStoriesHandler = async(req,res)=>{
    
}

const editUserStoriesHandler = async(req,res)=>{
    
}

const tasksPageHandler = async(req,res)=>{
    
}

const projectsUserStoriesHandler = async(req,res)=>{
    
}

const createTaskHandler = async(req,res)=>{
    
}

const editTaskHandler = async(req,res)=>{
    
}

const deleteTaskHandler = async(req,res)=>{
    
}

const readSprintHandler = async(req,res)=>{
    //kanban board of all task in sprint
}

const projectsTaskHandler = async(req,res)=>{
    
}

const createSprintHandler = async(req,res)=>{
    
}

const editSprintHandler = async(req,res)=>{
    
}

const deleteSprintHandler = async(req,res)=>{
    
}

const teamMembersHandler = async(req,res)=>{
    
}

const reportPageHandler = async(req,res)=>{
    
}

export {homePageHandler, projectsPageHandler, readProjectHandler,
    userStoriesPageHandler, readUserStoriesHandler, projectEpicsHandler,
    createUserStoriesHandler, deleteUserStoriesHandler, editUserStoriesHandler,
    tasksPageHandler, projectsUserStoriesHandler, createTaskHandler,
    editTaskHandler, deleteTaskHandler, projectsTaskHandler,
    readSprintHandler,createSprintHandler, editSprintHandler, 
    deleteSprintHandler, teamMembersHandler, reportPageHandler
}