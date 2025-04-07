import userModel from "../models/user.js";
import projectModel from "../models/project.js";
import sprintModel from "../models/sprint.js";
import epicModel from "../models/epic.js";


const homePageHandler = async(req,res)=>{

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

const createProjectHandler = async(req,res)=>{
    
}

const editProjectHandler = async(req,res)=>{

}

const deleteProjectHandler = async(req,res)=>{

}

const readProjectHandler = async(req,res)=>{

}

const epicsPageHandler = async(req,res)=>{

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

export {homePageHandler, projectsPageHandler, readProjectHandler, createProjectHandler, editProjectHandler, deleteProjectHandler, 
    epicsPageHandler, createEpicHandler, editEpicHandler, deleteEpicHandler,
    sprintsPageHandler, readSprintHandler, teamMembersHandler, reportPageHandler
}