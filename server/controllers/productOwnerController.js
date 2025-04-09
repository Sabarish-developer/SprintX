import userModel from "../models/user.js";
import projectModel from "../models/project.js";
import sprintModel from "../models/sprint.js";
import epicModel from "../models/epic.js";
import taskModel from "../models/task.js";


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
        
        return res.status(200).json({message: "Welcome back!", project: currentProject, epics: epics});

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
        const companyMembers = await userModel.find({companyId, role: "Team member"}).select("username");
        if(companyMembers.length == 0)
            return res.status(404).json({message: "No members found."});
        else
            return res.status(200).json({message: "Members found successfully.", data: companyMembers});
    }catch(e){
        console.log("Error in retreiving company members block : ",e);
        return res.status(500).json({message: "Internal server error. Please try again later."});
    }
}

const createProjectHandler = async(req,res)=>{
    
    try{
        const productOwnerId = req.user.id;
        const {name, description, start, deadline, scrumMasterId, teamMembersId} = req.body;
        if(!name || !description || !start || !deadline || !scrumMasterId || !teamMembersId || teamMembersId.length==0){
            return res.status(400).json({message: "All fields are required."});
        }

        await projectModel.create({
            name,
            description,
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

}

const editEpicHandler = async(req,res)=>{

}

const deleteEpicHandler = async(req,res)=>{

}

const sprintsPageHandler = async(req,res)=>{

}

const readSprintHandler = async(req,res)=>{

}

const teamMembersHandler = async(req,res)=>{

}

const reportPageHandler = async(req,res)=>{

}

export {homePageHandler, companyMembersHandler, projectsPageHandler, readProjectHandler, createProjectHandler, editProjectHandler, deleteProjectHandler, 
    epicsPageHandler, createEpicHandler, editEpicHandler, deleteEpicHandler,
    sprintsPageHandler, readSprintHandler, teamMembersHandler, reportPageHandler
}