import projectModel from "../models/project.js";
import userStoryModel from "../models/userStory.js";
import taskModel from "../models/task.js";
import sprintModel from "../models/sprint.js";
import companyModel from "../models/company.js";
import epicModel from "../models/epic.js";
import userModel from "../models/user.js";

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

    try{
        const userId = req.user.id;
        const projects = await projectModel.find({scrumMasterId: userId}).select("name description start deadline status");
        if(projects.length == 0)
            return res.status(404).json({message: "No projects found."});
        else
            return res.status(200).json({message: "Projects retrieved successfully.",projects});
    }catch(e){
        console.log("Error in projects block: ",e);
        return res.status(500).json({message: "Internal server error. Please try again later."});
    }
}

const readProjectHandler = async(req,res)=>{

    try{
        const projectId = req.params.id;
        if(!projectId){
            return res.status(400).json({message: "Project Id is required."});
        }

        const sprints = await sprintModel.find({projectId});
        if(sprints.length == 0)
            return res.status(404).json({message: "No sprints found."});
        else
            return res.status(200).json({message: "Sprints retrieved successfully.", sprints});
    }catch(e){
        console.log("Error in read project block: ",e);
        return res.status(500).json({message: "Internal server error. Please try again later."});
    }
}

const userStoriesPageHandler = async(req,res)=>{
    
    try{
        const projectId = req.params.id;
        if(!projectId){
            return res.status(400).json({message: "Project Id is required."});
        }

        const userStories = await userStoryModel.find({projectId});
        if(userStories.length == 0)
            return res.status(404).json({message: "No user stories found."});
        else
            return res.status(200).json({message: "User stories retrieved successfully.", userStories});
    }catch(e){
        console.log("Error in user stories block: ",e);
        return res.status(500).json({message: "Internal server error. Please try again later."});
    }
}

const readUserStoriesHandler = async(req,res)=>{
    
    try{
        const userStoryId = req.params.userStoryId;
        if(!userStoryId){
            return res.status(400).json({message: "User story Id is required."});
        }

        const tasks = await taskModel.find({userStoryId});
        if(tasks.length == 0)
            return res.status(404).json({message: "No tasks found."});
        else
            return res.status(200).json({message: "Tasks retrieved successfully.", tasks});
    }catch(e){
        console.log("Error in read user story block: ",e);
        return res.status(500).json({message: "Internal server error. Please try again later"});
    }
}

const projectEpicsHandler = async(req,res)=>{
    
    try{
        const projectId = req.params.id;
        if(!projectId){
            return res.status(400).json({message: "Project Id is required."});
        }

        const epics = await epicModel.find({projectId});
        if(epics.length == 0)
            return res.status(404).json({message: "No epics found."});
        else
            return res.status(200).json({message: "Epics retrieved successfully.", epics})
    }catch(e){
        console.log("Error in project epics block: ",e);
        return res.status(500).json({message: "Internal server error. Please try again later."});
    }
}

const createUserStoriesHandler = async(req,res)=>{
    
    try{
        const projectId = req.params.id;
        if(!projectId){
            return res.status(400).json({message: "Project Id is required."});
        }

        const scrumMasterId = req.user.id;
        const {title, description, priority, deadline, epicId} = req.body;
        if(!title.trim() || !description.trim() || !priority || !deadline || !epicId){
            return res.status(400).json({message: "All fields are required."});
        }
        if(priority!="High" && priority!="Medium" && priority!="Low"){
            return res.status(400).json({message: "Priority is not valid."});
        }

        await userStoryModel.create({
            title: title.trim(),
            description: description.trim(),
            priority,
            deadline,
            scrumMasterId,
            projectId,
            epicId
        });
        return res.status(201).json({message: "User story created successfully."});
    }catch(e){
        console.log("Error in create user story block: ",e);
        return res.status(500).json({message: "Internal server error. Please try again later."});
    }
}

const deleteUserStoriesHandler = async(req,res)=>{
    
    try{
        const {userStoryId} = req.body;
        if(!userStoryId){
            return res.status(400).json({message: "User story Id is required."});
        }

        const result = await userStoryModel.deleteOne({_id: userStoryId});
        if(result.deletedCount == 1)
            return res.status(200).json({message: "User story deleted successfully."});
        else
            return res.status(404).json({message: "User story doesn't exist"});
    }catch(e){
        console.log("Error in delete user story block: ",e);
        return res.status(500).json({message: "Internal server error. Please try again later."});
    }
}

const editUserStoriesHandler = async(req,res)=>{
    
    try{
        const userStoryId = req.params.userStoryId;
        if(!userStoryId){
            return res.status(400).json({message: "User story Id is required."});
        }
        const userStory = await userStoryModel.findOne({_id: userStoryId});
        if(!userStory){
            return res.status(404).json({message: "User story not found."});
        }
        const {priority} = req.body;
        const allowedPriority = ["High", "Medium", "Low"];
        if(!allowedPriority.includes(priority)){
            return res.status(400).json({message: "Priority is not valid."});
        }
        userStory.set(req.body);
        await userStory.save();
        return res.status(200).json({message: "User story updated successfully."});
    }catch(e){
        console.log("Error in edit user story block: ",e);
        return res.status(500).json({message: "Internal server error. Please try again later."});
    }
}

const tasksPageHandler = async(req,res)=>{
    
    try{
        const projectId = req.params.id;
        if(!projectId){
            return res.status(400).json({message: "Project Id is required."});
        }
        const tasks = await taskModel.find({projectId});
        if(tasks.length == 0)
            return res.status(404).json({message: "Tasks not found."});
        else
            return res.status(200).json({message: "Tasks retrieved successfully.", tasks});
    }catch(e){
        console.log("Error in tasks page block: ",e);
        return res.status(500).json({message: "Internal server error. Please try again later."});
    }
}

const projectsUserStoriesHandler = async(req,res)=>{
    
    try{
        const projectId = req.params.id;
        if(!projectId){
            return res.status(400).json({message: "Project Id is required."});
        }
        const userStories = await userStoryModel.find({projectId});
        if(userStories.length == 0)
            return res.status(404).json({message: "User stories not found."});
        else
            return res.status(200).json({message: "User stories retrieved successfully.", userStories});
    }catch(e){
        console.log("Error in project user story block: ",e);
        return res.status(500).json({message: "Internal server error. Please try again later."});
    }
}

const companyMembersHandler = async(req,res)=>{

    try{
        const userId = req.user.id;
        const user = await userModel.findById(userId);
        if(!user){
            return res.status(404).json({message: "User not found."});
        }

        const companyId = user.companyId;
        const companymembers = await userModel.find({companyId, role: "Team member"}).select("username");
        if(companymembers.length == 0)
            return res.status(404).json({message: "No team members found."});
        else
            return res.status(200).json({message: "Team members retrieved successfully.", companymembers});
    }catch(e){
        console.log("Error in company members block: ",e);
        return res.status(500).json({message: "Internal server error. Please try again later."});
    }
}

const createTaskHandler = async(req,res)=>{
    
    try{
        const projectId = req.params.id;
        if(!projectId){
            return res.status(400).json({message: "Project Id is required."});
        }

        const {title, description, priority, deadline, userStoryId, teamMemberId} = req.body;
        if(!title.trim() || !description.trim() || !priority || !deadline || !userStoryId || !teamMemberId){
            return res.status(400).json({message: "All fields are required."});
        }
        const allowedPriority = ["High", "Medium", "Low"];
        if(!allowedPriority.includes(priority)){
            return res.status(400).json({message: "Priority is not valid."});
        }

        await taskModel.create({
            title,
            description,
            priority,
            deadline,
            projectId,
            userStoryId,
            teamMemberId
        });
        return res.status(201).json({message: "Task created successfully."});
    }catch(e){
        console.log("Error in task create block: ",e);
        return res.status(500).json({message: "Internal server error. Please try again later."});
    }
}

const editTaskHandler = async(req,res)=>{
    
    try{
        const taskId = req.params.id;
        if(!taskId){
            return res.status(400).json({message: "Task Id is required."});
        }
        const task = await taskModel.findById(taskId);
        if(!task){
            return res.status(404).json({message: "Task not found."});
        }
        const {priority} = req.body;
        const allowedPriority = ["High", "Medium", "Low"];
        if(!allowedPriority.includes(priority)){
            return res.status(400).json({message: "Priority is not valid."});
        }
        task.set(req.body);
        await task.save();
        return res.status(200).json({message: "Task updated successfully."});
    }catch(e){
        console.log("Error is edit task block: ",e);
        return res.status(500).json({message: "Internal server error. Please try again later."});
    }
}

const deleteTaskHandler = async(req,res)=>{
    
    try{
        const {taskId} = req.body;
        if(!taskId){
            return res.status(400).json({message: "Task Id is required."});
        }
        const result = await taskModel.deleteOne({_id: taskId});
        if(result.deletedCount == 1)
            return res.status(200).json({message: "Task deleted successfully."});
        else
            return res.status(404).json({message: "Task doesn't exist."});
    }catch(e){
        console.log("Error in delete task block: ",e);
        return res.status(500).json({message: "Internal server error. Please try again later."});
    }
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
    deleteSprintHandler, teamMembersHandler, reportPageHandler,
    companyMembersHandler
}