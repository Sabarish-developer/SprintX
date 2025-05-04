import projectModel from "../models/project.js";
import userStoryModel from "../models/userStory.js";
import taskModel from "../models/task.js";
import sprintModel from "../models/sprint.js";
import epicModel from "../models/epic.js";
import userModel from "../models/user.js";
import mongoose from "mongoose";

const homePageHandler = async(req,res)=>{

    try{
        const userId = req.user.id;
        const projects = await projectModel.find({scrumMasterId: userId, status: "Active"});
        if(projects.length == 0){
            return res.status(200).json({message: "No projects found.", project:null, userStories: []});
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

const projectsPageHandler = async (req, res) => {
    try {
      const userId = req.user.id;
      const userObjectId = new mongoose.Types.ObjectId(userId);
  
      const projects = await projectModel.aggregate([
        {
          $match: { scrumMasterId: userObjectId } // Match by scrum master
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
            from: "users", // Get Product Owner info
            localField: "productOwnerId",
            foreignField: "_id",
            as: "productOwnerInfo"
          }
        },
        {
          $unwind: {
            path: "$productOwnerInfo",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $project: {
            title: 1,
            description: 1,
            start: 1,
            deadline: 1,
            end: 1,
            status: 1,
            epics: 1,
            productOwner: "$productOwnerInfo.username", // or use fullName if you have it
          }
        }
      ]);
  
      if (projects.length === 0) {
        return res.status(200).json({
          message: "No projects found. Contact your Product Owner.",
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
      console.log("Error in Scrum Master projects handler: ", e);
      return res.status(500).json({
        message: "Error retrieving projects. Please try again later."
      });
    }
  };
  

const readProjectHandler = async(req,res)=>{

    try{
        const projectId = req.params.id;
        if(!projectId){
            return res.status(400).json({message: "Project Id is required."});
        }

        const sprints = await sprintModel.find({projectId});
        if(sprints.length == 0)
            return res.status(200).json({message: "No sprints found.", sprints:[]});
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
            return res.status(200).json({message: "No user stories found.", userStories: []});
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
            return res.status(200).json({message: "No tasks found.", tasks:[]});
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
            return res.status(200).json({message: "No epics found.", epics:[]});
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
        const {title, description, priority, deadline, epicId, sprintId} = req.body;
        if(!title.trim() || !description.trim() || !priority || !deadline || !epicId || !sprintId){
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
            epicId,
            sprintId
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
            return res.status(200).json({message: "User story doesn't exist"});
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
            return res.status(200).json({message: "User story doesn't exist."});
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
            return res.status(200).json({message: "Tasks not found.", tasks:[]});
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
            return res.status(200).json({message: "User stories not found.", userStories:[]});
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
            return res.status(200).json({message: "User doesn't exist."});
        }

        const companyId = user.companyId;
        const companymembers = await userModel.find({companyId, role: "Team member"}).select("username");
        if(companymembers.length == 0)
            return res.status(200).json({message: "No team members found.", companymembers:[]});
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
            return res.status(200).json({message: "Task doesn't exist."});
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
            return res.status(200).json({message: "Task doesn't exist."});
    }catch(e){
        console.log("Error in delete task block: ",e);
        return res.status(500).json({message: "Internal server error. Please try again later."});
    }
}

const readSprintHandler = async(req,res)=>{
    //kanban board of all task in sprint
    try{
        const sprintId = req.params.id;
        if(!sprintId){
            return res.status(400).json({message: "Sprint Id is required."});
        }
        const tasks = await taskModel.find({sprintId});
        if(tasks.length == 0)
            return res.status(200).json({message: "No tasks found.", tasks:[]});
        else
            return res.status(200).json({message: "Tasks retrieved successfully.", tasks});
    }catch(e){
        console.log("Error in read sprint block: ",e);
        return res.status(500).json({message: "Internal server error. Please try again later."});
    }
}

const projectsTaskHandler = async(req,res)=>{
    
    try{
        const projectId = req.params.id;
        if(!projectId){
            return res.status(400).json({message: "Project Id is required."});
        }
        
        const tasks = await taskModel.find({projectId});
        if(tasks.length == 0)
            return res.status(200).json({message: "No tasks found.", tasks:[]});
        else
            return res.status(200).json({message: "Tasks retrieved successfully.", tasks});
    }catch(e){
        console.log("Error in project task block: ",e);
        return res.status(500).json({message: "Internal server error. Please try again later."});
    }
}

const createSprintHandler = async (req, res) => {
    try {
      const projectId = req.params.id;
      if (!projectId) {
        return res.status(400).json({ message: "Project Id is required." });
      }

      const scrumMasterId = req.user.id;
  
      const { title, start, deadline } = req.body;
  
      if (!title?.trim() || !start || !deadline) {
        return res.status(400).json({ message: "All fields are required." });
      }
  
      const sprint = await sprintModel.create({
        title: title.trim(),
        start,
        deadline,
        projectId,
        scrumMasterId
      });
  
      return res.status(201).json({ message: "Sprint created successfully", sprint });
    } catch (err) {
      console.error("Error creating sprint:", err);
      return res.status(500).json({ message: "Error creating sprint", error: err.message });
    }
  };
  

  const editSprintHandler = async (req, res) => {
    try {
        const sprintId = req.params.sprintId;
        if (!sprintId) {
            return res.status(400).json({ message: "Sprint Id is required." });
        }

        const { title, start, deadline, status } = req.body;
        if (!title?.trim() || !start || !deadline || !status) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Validate status value
        const validStatuses = ["Active", "Completed"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid sprint status." });
        }

        const sprint = await sprintModel.findById(sprintId);
        if (!sprint) {
            return res.status(404).json({ message: "Sprint doesn't exist." });
        }

        sprint.title = title.trim();
        sprint.start = start;
        sprint.deadline = deadline;
        sprint.status = status;

        await sprint.save();

        return res.status(200).json({ message: "Sprint updated successfully." });

    } catch (e) {
        console.error("Error in edit sprint handler:", e);
        return res.status(500).json({ message: "Internal server error." });
    }
};


const deleteSprintHandler = async(req,res)=>{
    
    try{
        const sprintId = req.params.id;
        if(!sprintId){
            return res.status(400).json({message: "Sprint Id is required."});
        }

        await taskModel.updateMany(
            { sprintId: sprintId },
            { $unset: { sprintId: "" } }
        );

        const result = await sprintModel.deleteOne({_id: sprintId});
        if(result.deletedCount == 1)
            return res.status(200).json({message: "Sprint deleted successfully."});
        else
            return res.status(200).json({message: "Sprint doesn't exist."});
    }catch(e){
        console.log("Error in delete sprint block: ",e);
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

        const teammembersId = project.teamMembersId;
        const teamMembers = await userModel.find({_id: {$in: teammembersId}}).select("username email subrole");
        if(!productOwner || teamMembers.length==0)
            return res.status(200).json({message: "Product owner or Team members doesn't exist.", productOwner, teamMembers});
        else
            return res.status(200).json({message: "Team members found successfully.", productOwner, teamMembers});

    }catch(e){
        console.log("Error in team members block: ",e);
        return res.status(500).json({message: "Internal server error. Please try again later."});
    }
}

const reportPageHandler = async(req,res)=>{
    
    try{
        const scrumMasterId = req.user.id;
            
        const userStories = await userStoryModel.find({scrumMasterId});
        const sprints = await sprintModel.find({scrumMasterId});

        if(userStories.length == 0){
            return res.status(200).json({message: "Create a user story to view your report"});
        }
        if(sprints.length == 0){
            return res.status(200).json({message: "Create a sprint to view your report"});
        }

        //Total userStories and completed userStories
        let totalUserStories = 0; 
        totalUserStories = userStories.length;
        let completedUserStories = 0;
        userStories.forEach(u => {
            if(u.status === "Completed")
                completedUserStories++;
        });

        //User story completion rate and current project user story completion rate
        let userStoryCompletionRate = 0;
        userStoryCompletionRate = (completedUserStories/totalUserStories)*100;
        const projects = await projectModel.find({scrumMasterId, status: "Active"});
        let currentProjectUserStoryCompletionRate = 0;
        let currentProject;
        if(projects.length != 0){
            const sortedProjects = projects.sort((a,b) => new Date(a.deadline) - new Date(b.deadline));
            currentProject = sortedProjects[0];
            let currentProjectTotalUserStories = 0, currentProjectCompletedUserStories = 0;
            userStories.forEach(u => {
                if(u.projectId===currentProject._id)
                    currentProjectTotalUserStories++;
                if(u.projectId===currentProject._id && u.status==="Completed")
                    currentProjectCompletedUserStories++;
            })
            currentProjectUserStoryCompletionRate = (currentProjectCompletedUserStories/currentProjectTotalUserStories)*100;
        }

        //Average user Story Completion Time
        let totalCompletionTime = 0;
        userStories.forEach(u => {
            if(u.status === "Completed")
            totalCompletionTime += (u.end - u.start);
        })
        let averageUserStoryCompletionTime = 0;
        averageUserStoryCompletionTime = totalCompletionTime/completedUserStories;

        //Total successful userStories -> completed on time
        let successfulUserStories = 0;
        userStories.forEach(u => {
            if(u.status==="Completed" && (u.end < u.deadline) )
                successfulUserStories++;
        })
        let userStorySuccessRate = 0;
        userStorySuccessRate = (successfulUserStories/totalUserStories)*100;

        //UserStory spill over rate -> not completed on time
        let spillOverUserStories = 0;
        userStories.forEach(u => {
            if(u.status!=="Completed" && (new Date(u.deadline) < new Date()) )
                spillOverUserStories++;
        })
        let userStoriesSpillOverRate = 0;
        userStoriesSpillOverRate = (spillOverUserStories/totalUserStories)*100;

        //Total sprints and completed sprints
        let totalSprints = 0;
        totalSprints = sprints.length;
        let completedSprints = 0;
        sprints.forEach(s => {
            if(s.status === "Completed")
                completedSprints++;
        })
        
        //sprint completion rate and current project sprint completion rate
        let sprintCompletionRate = 0;
        sprintCompletionRate = (completedSprints/totalSprints)*100;
        let currentProjectSprintCompletionRate = 0;
        let currentProjectSprints = 0, currentProjectCompletedSprints = 0;
        sprints.forEach(s => {
            if(s.projectId === currentProject._id)
                currentProjectSprints++;
            if(s.projectId===currentProject._id && s.status==="Completed")
                currentProjectCompletedSprints++;
        })
        currentProjectSprintCompletionRate = (currentProjectCompletedSprints/currentProjectSprints)*100;

        //Average sprint Completion Time
        let totalSprintCompletionTime = 0;
        sprints.forEach(s => {
            if(s.status === "Completed")
            totalSprintCompletionTime += (new Date(s.end) - new Date(s.start));
        })
        let averageSprintCompletionTime = 0;
        averageSprintCompletionTime = totalSprintCompletionTime/completedSprints;

        //Total successful userStories -> completed on time
        let successfulSprints = 0;
        sprints.forEach(s => {
            if(s.status==="Completed" && (new Date(s.end) < new Date(s.deadline)))
                successfulSprints++;
        })
        let sprintSuccessRate = 0;
        sprintSuccessRate = (successfulSprints/totalSprints)*100;

        //UserStory spill over rate -> not completed on time
        let spillOverSprints = 0;
        sprints.forEach(s => {
            if(s.status!=="Completed" && (new Date(s.deadline) < new Date()))
                spillOverSprints++;
        })
        let sprintSpillOverRate = 0;
        sprintSpillOverRate = (spillOverSprints/totalSprints)*100;

        return res.status(200).json({
            message: "Reports fetched successfully",
            totalUserStories: totalUserStories || 0,
            completedUserStories: completedUserStories || 0,
            userStoryCompletionRate: userStoryCompletionRate || 0,
            currentProjectUserStoryCompletionRate: currentProjectUserStoryCompletionRate || 0,
            userStorySuccessRate: userStorySuccessRate || 0,
            userStoriesSpillOverRate: userStoriesSpillOverRate || 0,
            averageUserStoryCompletionTime: averageUserStoryCompletionTime || 0,

            totalSprints: totalSprints || 0,
            completedSprints: completedSprints || 0,
            sprintCompletionRate: sprintCompletionRate || 0,
            currentProjectSprintCompletionRate: currentProjectSprintCompletionRate || 0,
            sprintSuccessRate: sprintSuccessRate || 0,
            sprintSpillOverRate: sprintSpillOverRate || 0,
            averageSprintCompletionTime: averageSprintCompletionTime || 0
        })
    

    }catch(e){
        console.log("Error in report block: ",e);
        return res.status(500).json({message: "Internal server error. Please try again later."});
    }
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