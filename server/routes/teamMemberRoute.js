import {homePageHandler, projectsPageHandler, readProjectHandler, 
    readSprintHandler, tasksPageHandler, taskUpdateHandler, 
    teamMembersHandler, reportPageHandler} from "../controllers/teamMemberController.js";
import auth from "../middleware/auth.js";
import roleHandler from "../middleware/roleHandler.js";
import { Router } from "express";

const teamMemberRouter = Router();

teamMemberRouter.use(auth);
teamMemberRouter.use(roleHandler(['Team member']));

teamMemberRouter.get("/home", homePageHandler);

teamMemberRouter.get("/projects", projectsPageHandler);
teamMemberRouter.get("/projects/:projectId", readProjectHandler);

teamMemberRouter.get("/projects/:id/sprints/:sprintId", readSprintHandler); 

teamMemberRouter.get("/projects/:id/tasks", tasksPageHandler);
teamMemberRouter.patch("/projects/:id/tasks/:taskId", taskUpdateHandler);

teamMemberRouter.get("/teammembers", projectsPageHandler);
teamMemberRouter.get("/projects/:id/teammembers", teamMembersHandler);

teamMemberRouter.get("/report", reportPageHandler);

export default teamMemberRouter;