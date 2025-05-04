import projectModel from "../models/project.js";
import epicModel from "../models/epic.js";
import userStoryModel from "../models/userStory.js";
import taskModel from "../models/task.js";
import sprintModel from "../models/sprint.js";

const progressUpdater = async(taskId)=>{

    const task = await taskModel.findById(taskId);
    if(!task) return;
    task.end = new Date();
    await task.save();

    const userStoryId = task.userStoryId;
    const allTasks = await taskModel.find({userStoryId});
    const allTasksCompleted = allTasks.every(t => t.status === "Completed");
    if(allTasksCompleted){
        await userStoryModel.findByIdAndUpdate(userStoryId,{status: "Completed", end: new Date()});
    }

    const userStory = await userStoryModel.findById(userStoryId);
    const epicId = userStory.epicId;
    const allUserStories = await userStoryModel.find({epicId});
    const allUserStoriesCompleted = allUserStories.every(u => u.status === "Completed");
    if(allUserStoriesCompleted){
        await epicModel.findByIdAndUpdate(epicId,{status: "Completed", end: new Date()});
    }

    const sprintId = userStory.sprintId;
    const allSprintUserStories = await userStoryModel.find({sprintId});
    const allSprintUserStoriesCompleted = allSprintUserStories.every(u => u.status === "Completed");
    if(allSprintUserStoriesCompleted){
        await sprintModel.findByIdAndUpdate(sprintId, {status: "Completed", end: new Date()});
    }

    const epic = await epicModel.findById(epicId);
    const projectId = epic.projectId;
    const allEpics = await epicModel.find({projectId});
    const allEpicsCompleted = allEpics.every(e => e.status === "Completed");
    if(allEpicsCompleted){
        await projectModel.findByIdAndUpdate(projectId, {status: "Completed", end: new Date()});
    }

}

export default progressUpdater;