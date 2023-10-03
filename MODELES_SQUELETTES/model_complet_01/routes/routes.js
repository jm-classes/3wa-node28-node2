import HomeController from "../controllers/home.js";
import { Router } from "express";

const appRouter = Router();

appRouter.get("/", HomeController);

export default appRouter;
