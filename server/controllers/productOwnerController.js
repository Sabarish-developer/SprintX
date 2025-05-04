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
            return res.status(200).json({message: "No projects found", project: null, epics: []});
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

const projectsPageHandler = async (req, res) => {
    try {
      const userId = req.user.id;
      const userObjectId = new mongoose.Types.ObjectId(userId);
  
      const projects = await projectModel.aggregate([
        {
          $match: { productOwnerId: userObjectId }
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
            from: "users", // Assuming users collection
            localField: "scrumMasterId",
            foreignField: "_id",
            as: "scrumMasterInfo"
          }
        },
        {
          $unwind: {
            path: "$scrumMasterInfo",
            preserveNullAndEmptyArrays: true // In case scrumMaster is not assigned yet
          }
        },
        {
          $project: {
            title: 1,
            description: 1,
            start: 1,
            deadline: 1,
            status: 1,
            epics: 1,
            scrumMaster: "$scrumMasterInfo.username", // You can use .fullName if that's the field
          }
        }
      ]);
  
      if (projects.length === 0) {
        return res.status(200).json({
          message: "No projects found. Start by creating a project.",
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
      console.log(projectsWithCompletion);
      return res.status(200).json({
        message: "Projects retrieved successfully.",
        projects: projectsWithCompletion
      });
  
    } catch (e) {
      console.log("Error in projects page Handler block : ", e);
      return res.status(500).json({
        message: "Error in retrieving projects. Kindly try again later."
      });
    }
  };
  


const companyMembersHandler = async(req,res)=>{

    try{
        const user = await userModel.findById(req.user.id);
        const companyId = user.companyId;
        const teamMembers = await userModel.find({companyId, role: "Team member"}).select("username");
        const scrumMasters = await userModel.find({companyId, role: "Scrum master"}).select("username");
        if(teamMembers.length == 0)
            return res.status(200).json({message: "Add a team member to create a project."});
        else if(scrumMasters.length == 0)
                return res.status(200).json({message: "Add a scrum master to create a project."});
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
            return res.status(200).json({message: "Project doesn't exist."});
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
            return res.status(200).json({message: "Project doesn't exist."});

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
            return res.status(200).json({message: "No sprints found.", sprints: []});
        else
            return res.status(200).json({message: "Sprints found successfully.", sprints});

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
            return res.status(200).json({message: "No epics found.", epics: []});
        else
            return res.status(200).json({message: "Epics found successfully.", epics});
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
            return res.status(200).json({message: "Epic doesn't exist."});
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
            return res.status(200).json({message: "Epic doesn't exist."});

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
            return res.status(200).json({message: "Sprint doesn't exist."});
        }

        const tasks = await taskModel.find({sprintId});
        if(tasks.length == 0)
            return res.status(200).json({message: "Tasks not found.", tasks: []});
        else    
            return res.status(200).json({message: "Tasks found successfully.", tasks});
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
            return res.status(200).json({message: "Project doesn't exist."});
        }

        const scrumMasterId = project.scrumMasterId;
        const scrumMaster = await userModel.findById(scrumMasterId).select("username email");

        const teammembersId = project.teamMembersId;
        const teamMembers = await userModel.find({_id: {$in: teammembersId}}).select("username email subrole");
        if(!scrumMaster || teamMembers.length==0)
            return res.status(200).json({message: "Scrum master or Team members doesn't exist.", scrumMaster, teamMembers});
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

      const epics = await epicModel.find({productOwnerId});
      const projects = await projectModel.find({productOwnerId});

      if(projects.length==0){
        return res.status(200).json({message: "Start any project to view your report"});
      }
      if(epics.length == 0){
        return res.status(200).json({message: "Create any epic to view your report"});
      }

      const sortedProjects = projects.sort((a,b) => new Date(a.deadline) - new Date(b.deadline));
      const currentProject = sortedProjects[0];
      
      let totalEpics = 0, completedEpics = 0;
      let epicCompletionRate = 0, currentProjectEpicCompletionRate = 0;
      let epicSuccessRate = 0, epicSpillOverRate = 0;
      let averageEpicCompletionTime = 0;
      
      totalEpics = epics.length;
      let currentProjectTotalEpics = 0, currentProjectCompletedEpics = 0, spillOverEpics = 0, successfulEpics = 0, totalEpicCompletionTime = 0;
      epics.forEach(e => {
        if(e.status === "Completed")
            completedEpics++;
        if(currentProject && e.projectId===currentProject._id)
            currentProjectTotalEpics++;
        if(currentProject && e.projectId===currentProject._id && e.status==="Completed")
            currentProjectCompletedEpics++;
        if(e.status!=="Completed" && (new Date(e.deadline) < new Date()))
            spillOverEpics++;
        if(e.status==="Completed" && (new Date(e.end) < new Date(e.deadline)))
            successfulEpics++;
        totalEpicCompletionTime += (new Date(e.end) - new Date(e.start));
      })
      epicCompletionRate = (completedEpics/totalEpics)*100;
      currentProjectEpicCompletionRate = (currentProjectCompletedEpics/currentProjectTotalEpics)*100;
      epicSuccessRate = (successfulEpics/totalEpics)*100;
      epicSpillOverRate = (spillOverEpics/totalEpics)*100;
      averageEpicCompletionTime = (totalEpicCompletionTime/completedEpics);


      let totalProjects = 0, completedProjects = 0;
      let projectCompletionRate = 0;
      let projectSuccessRate = 0, projectSpillOverRate = 0;
      let averageProjectCompletionTime = 0;

      totalProjects = projects.length;
      let successfulProjects = 0, spillOverProjects = 0, totalProjectsCompletionTime = 0;
      projects.forEach(p => {
        if(p.status === "Completed")
            completedProjects++;
        if(p.status==="Completed" && (new Date(p.end) < new Date(p.deadline)))
            successfulProjects++;
        if(p.status!=="Completed" && (new Date(p.deadline) < new Date()))
            spillOverProjects++;
        totalProjectsCompletionTime += (new Date(p.end) - new Date(p.start));
      })
      projectCompletionRate = (completedProjects/totalProjects)*100;
      projectSuccessRate = (successfulProjects/totalProjects)*100;
      projectSpillOverRate = (spillOverProjects/totalProjects)*100;
      averageProjectCompletionTime = totalProjectsCompletionTime/completedProjects;

      return res.status(200).json({
        message: "Reports fetched successfully",
        totalEpics: totalEpics || 0,
        completedEpics: completedEpics || 0,
        epicCompletionRate: epicCompletionRate || 0,
        currentProjectEpicCompletionRate: currentProjectEpicCompletionRate || 0,
        epicSuccessRate: epicSuccessRate || 0,
        epicSpillOverRate: epicSpillOverRate || 0,
        averageEpicCompletionTime: averageEpicCompletionTime || 0,

        totalProjects: totalProjects || 0,
        completedProjects: completedProjects || 0,
        projectCompletionRate: projectCompletionRate || 0,
        projectSuccessRate: projectSuccessRate || 0,
        projectSpillOverRate: projectSpillOverRate || 0,
        averageProjectCompletionTime: averageProjectCompletionTime || 0
      })

    }catch(e){
        console.log("Error in report block: ",e);
        return res.status(500).json({message: "Internal server error. Please try again later."});
    }
}

export {homePageHandler, companyMembersHandler, projectsPageHandler, readProjectHandler, createProjectHandler, editProjectHandler, deleteProjectHandler, 
    epicsPageHandler, createEpicHandler, editEpicHandler, deleteEpicHandler,
    readSprintHandler, teamMembersHandler, reportPageHandler
}