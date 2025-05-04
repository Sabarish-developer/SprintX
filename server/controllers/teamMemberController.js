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

const projectsPageHandler = async (req, res) => {
    try {
      const userId = req.user.id;
      const userObjectId = new mongoose.Types.ObjectId(userId);
  
      const projects = await projectModel.aggregate([
        {
          $match: { teamMembersId: userObjectId } // Match where user is in teamMembers
        },
        {
          $lookup: {
            from: "epics",
            localField: "_id",
            foreignField: "projectId",
            as: "epics"
          }
        },
        {
          $lookup: {
            from: "users", // Get Product Owner
            localField: "productOwnerId",
            foreignField: "_id",
            as: "productOwnerInfo"
          }
        },
        {
          $lookup: {
            from: "users", // Get Scrum Master
            localField: "scrumMasterId",
            foreignField: "_id",
            as: "scrumMasterInfo"
          }
        },
        {
          $unwind: {
            path: "$productOwnerInfo",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $unwind: {
            path: "$scrumMasterInfo",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $project: {
            title: 1,
            description: 1,
            start: 1,
            end: 1,
            deadline: 1,
            status: 1,
            epics: 1,
            productOwner: "$productOwnerInfo.username", // or .fullName if preferred
            scrumMaster: "$scrumMasterInfo.username"
          }
        }
      ]);
  
      if (projects.length === 0) {
        return res.status(200).json({
          message: "No projects found. Contact your Scrum Master.",
          projects: []
        });
      }
  
      const projectsWithCompletion = projects.map(project => {
        const totalEpics = project.epics.length;
        const completedEpics = project.epics.filter(epic => epic.status === "Completed").length;
  
        const completionPercentage = totalEpics === 0
          ? 0
          : Math.round((completedEpics / totalEpics) * 100);
  
        return {
          ...project,
          completionPercentage
        };
      });
  
      return res.status(200).json({
        message: "Projects retrieved successfully.",
        projects: projectsWithCompletion
      });
  
    } catch (e) {
      console.log("Error in Team Member projects handler: ", e);
      return res.status(500).json({
        message: "Error retrieving projects. Please try again later."
      });
    }
  };
  

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
        const teamMemberId = req.user.id;
        const tasks = await taskModel.find({teamMemberId});
        const projects = await projectModel.find({teamMembersId: teamMemberId});

        if(tasks.length == 0){
          return res.status(200).json({message: "You have no task to show in report"});
        }
        if(projects.length == 0){
          return res.status(200).json({message: "You are not part of any project to show in report"});
        }

        const sortedProjects = projects.sort((a,b) => new Date(a.deadline)-new Date(b.deadline));
        const currentProject = sortedProjects[0];

        let totalTasks = tasks.length, completedTasks = 0;
        let taskCompletionRate = 0, currentProjectTaskCompletionRate = 0;
        let taskSuccessRate = 0, taskSpillOverRate = 0;
        let averageTaskCompletionTime = 0;

        let currentProjectTotalTasks = 0, currentProjectCompletedTasks = 0, successFulTasks = 0, spillOverTasks = 0, totalTaskCompletionTime = 0;
        tasks.forEach(t => {
          if(t.status === "Completed"){
            completedTasks++;
            totalTaskCompletionTime += new Date(t.end) - new Date(t.start);
          }
          if(currentProject && currentProject._id===t.projectId)
            currentProjectTotalTasks++;
          if(currentProject && currentProject._id===t.projectId && t.status==="Completed")
            currentProjectCompletedTasks++;
          if(t.status==="Completed" && (new Date(t.end) < new Date(t.deadline)))
            successFulTasks++;
          if(t.status!=="Completed" && (new Date(t.deadline) < new Date()))
            spillOverTasks++;
        })

        taskCompletionRate = (completedTasks/totalTasks)*100;
        currentProjectTaskCompletionRate = (currentProjectCompletedTasks/currentProjectTotalTasks)*100;
        taskSuccessRate = (successFulTasks/totalTasks)*100;
        taskSpillOverRate = (spillOverTasks/totalTasks)*100;
        averageTaskCompletionTime = totalTaskCompletionTime/completedTasks;

        return res.status(200).json({
          message: "Reports fetched successfully",
          totalTasks,
          completedTasks,
          taskCompletionRate: taskCompletionRate || 0,
          currentProjectTaskCompletionRate: currentProjectTaskCompletionRate || 0,
          taskSuccessRate: taskSuccessRate || 0,
          taskSpillOverRate: taskSpillOverRate || 0,
          averageTaskCompletionTime: averageTaskCompletionTime || 0
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