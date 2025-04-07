import { homePageHandler, projectsPageHandler, readProjectHandler, createProjectHandler, editProjectHandler, deleteProjectHandler,
    epicsPageHandler, createEpicHandler, editEpicHandler, deleteEpicHandler, 
    sprintsPageHandler, readSprintHandler, teamMembersHandler, reportPageHandler} from "../controllers/productOwnerController";
import {auth} from "../middleware/auth.js";
import {roleHandler} from "../middleware/roleHandler.js";
import { Router } from "express";
const productOwnerRouter = Router();

// Global and route level middleware for all the routes
productOwnerRouter.use(auth);
productOwnerRouter.use(role(['Product owner']));

productOwnerRouter.get("/home", homePageHandler);

productOwnerRouter.get("/projects", projectsPageHandler);
productOwnerRouter.get("/projects/:id", readProjectHandler);
productOwnerRouter.post("/projects", createProjectHandler);
productOwnerRouter.put("/projects/:id", editProjectHandler);
productOwnerRouter.delete("/projects/:id", deleteProjectHandler);

productOwnerRouter.get("/projects/:id/epics", epicsPageHandler);
productOwnerRouter.post("/projects/:id/epics", createEpicHandler);
productOwnerRouter.put("/projects/:id/epics/:epicId", editEpicHandler);
productOwnerRouter.delete("/projects/:id/epics/:epicId", deleteEpicHandler);

productOwnerRouter.get("/projects/:id/sprints", sprintsPageHandler);
productOwnerRouter.get("/projects/:id/sprints/:sprintId", readSprintHandler);
productOwnerRouter.get("/projects/:id/teammembers", teamMembersHandler);

productOwnerRouter.get("/report", reportPageHandler);


export default productOwnerRouter;