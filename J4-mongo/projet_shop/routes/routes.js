import { Router } from 'express';
import HomeController from '../controllers/home.js';

const appRouter = Router()

appRouter.get('/', HomeController);

export default appRouter;
