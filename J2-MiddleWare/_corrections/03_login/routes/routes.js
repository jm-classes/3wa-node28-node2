import { urlencoded } from "express"

import HomeController from "../controllers/home.js";
import LoginController from "../controllers/login.js";
import DashboardController from "../controllers/dashboard.js";
import LogoutController from "../controllers/logout.js";

import isNotLogged from "../middlewares/isNotLogged.js";
import isLogged from "../middlewares/isLogged.js";

import { Router } from "express";

const appRouter = Router();

appRouter.use(urlencoded({ extended: false }))

appRouter.get("/", isNotLogged, HomeController); // Route: Formulaire de connexion (login)
appRouter.post("/login", LoginController); // Route: Traitement du formulaire de connexion (POST)

appRouter.use("/panel", isLogged) // Ce middleware protège toutes les routes commançants par /panel/...
appRouter.get("/panel/dashboard", DashboardController); // Route: Page sécurisée
appRouter.get("/panel/logout", LogoutController); // Route: Page de déconnexion

appRouter.get("*", (_, res) => {
  res.status(404).send('<h1>404 Not Found</h1>')
})

export default appRouter;