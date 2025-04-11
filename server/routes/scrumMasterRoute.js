import {homePageHandler, 
    projectsPageHandler, readProjectHandler, projectEpicsHandler,
    userStoriesPageHandler, readUserStoriesHandler, createUserStoriesHandler, deleteUserStoriesHandler, editUserStoriesHandler,
    tasksPageHandler, projectsUserStoriesHandler, createTaskHandler, editTaskHandler, deleteTaskHandler, projectsTaskHandler,
    readSprintHandler, createSprintHandler, editSprintHandler, deleteSprintHandler, companyMembersHandler,
    teamMembersHandler, reportPageHandler} from "../controllers/scrumMasterController.js";
import auth from "../middleware/auth.js";
import roleHandler from "../middleware/roleHandler.js";
import { Router } from "express";

const scrumMasterRouter = Router();

scrumMasterRouter.use(auth);
scrumMasterRouter.use(roleHandler(['Scrum master']));

scrumMasterRouter.get("/home", homePageHandler);

scrumMasterRouter.get("/projects", projectsPageHandler);
scrumMasterRouter.get("/projects/:id", readProjectHandler);

scrumMasterRouter.get("/projects/:id/userstories", userStoriesPageHandler);
scrumMasterRouter.get("/projects/:id/userstories/:userStoryId", readUserStoriesHandler);
scrumMasterRouter.get("/projects/:id/epics", projectEpicsHandler);
scrumMasterRouter.post("/projects/:id/userstories", createUserStoriesHandler);
scrumMasterRouter.delete("/projects/:id/userstories", deleteUserStoriesHandler);
scrumMasterRouter.put("/projects/:id/userstories/:id", editUserStoriesHandler);

scrumMasterRouter.get("/projects/:id/tasks", tasksPageHandler);
scrumMasterRouter.get("/projects/:id/tasks/userstories", projectsUserStoriesHandler);
scrumMasterRouter.get("/projects/:id/tasks/companymembers", companyMembersHandler);
scrumMasterRouter.post("/projects/:id/tasks", createTaskHandler);
scrumMasterRouter.put("/projects/:id/tasks/:taskId", editTaskHandler);
scrumMasterRouter.delete("/projects/:id/tasks", deleteTaskHandler);

scrumMasterRouter.get("/projects/:id/sprints/:sprintId", readSprintHandler); 
scrumMasterRouter.get("/projects/:id/sprints/tasks", projectsTaskHandler);
scrumMasterRouter.post("/projects/:id/sprints", createSprintHandler);
scrumMasterRouter.put("/projects/:id/sprints/:sprintId", editSprintHandler);
scrumMasterRouter.delete("/projects/:id/sprints", deleteSprintHandler);

scrumMasterRouter.get("/teammembers", projectsPageHandler);
scrumMasterRouter.get("/projects/:id/teammembers", teamMembersHandler);

scrumMasterRouter.get("/report", reportPageHandler);

export default scrumMasterRouter;