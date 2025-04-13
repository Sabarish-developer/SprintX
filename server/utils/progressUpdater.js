import projectModel from "../models/project.js";
import epicModel from "../models/epic.js";
import userStoryModel from "../models/userStory.js";
import taskModel from "../models/task.js";

const progressUpdater = async(taskId)=>{

    const task = await taskModel.findById(taskId);
    if(!task) return;

    const userStoryId = task.userStoryId;
    const allTasks = await taskModel.find({userStoryId});
    const allTasksCompleted = allTasks.every(t => t.status === "Completed");
    if(allTasksCompleted){
        await userStoryModel.findByIdAndUpdate(userStoryId,{status: "Completed"});
    }

    const userStory = await userStoryModel.findById(userStoryId);
    const epicId = userStory.epicId;
    const allUserStories = await userStoryModel.find({epicId});
    const allUserStoriesCompleted = allUserStories.every(u => u.status === "Completed");
    if(allUserStoriesCompleted){
        await epicModel.findByIdAndUpdate(epicId,{status: "Completed"});
    }

    const epic = await epicModel.findById(epicId);
    const projectId = epic.projectId;
    const allEpics = await epicModel.find({projectId});
    const allEpicsCompleted = allEpics.every(e => e.status === "Completed");
    if(allEpicsCompleted){
        await projectModel.findByIdAndUpdate(projectId, {status: "Completed"});
    }

}

export default progressUpdater;