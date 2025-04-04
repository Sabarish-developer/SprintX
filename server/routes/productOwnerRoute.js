import { homePageHandler, projectsPageHandler, readProjectHandler, createProjectHandler, editProjectHandler, deleteProjectHandler,
    epicsPageHandler, createEpicHandler, editEpicHandler, deleteEpicHandler, 
    sprintsPageHandler, readSprintHandler, teamMembersHandler, reportPageHandler} from "../controllers/productOwnerController";
import { Router } from "express";
const productOwnerRouter = Router();


productOwnerRouter.get("/home", homePageHandler);
productOwnerRouter.get("/projects", projectsPageHandler);
productOwnerRouter.get("/projects/:id", readProjectHandler);
productOwnerRouter.post("/project", createProjectHandler);
productOwnerRouter.put("/project/:id", editProjectHandler);
productOwnerRouter.delete("/project/:id", deleteProjectHandler);
productOwnerRouter.get("/epics", epicsPageHandler);
productOwnerRouter.post("/epic", createEpicHandler);
productOwnerRouter.put("/epic/:id", editEpicHandler);
productOwnerRouter.delete("/epic/:id", deleteEpicHandler);
productOwnerRouter.get("/sprints", sprintsPageHandler);
productOwnerRouter.get("/sprints/:id", readSprintHandler);
productOwnerRouter.get("/teammembers", teamMembersHandler);
productOwnerRouter.get("/report", reportPageHandler);


export default productOwnerRouter;