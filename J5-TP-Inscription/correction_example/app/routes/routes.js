import express from 'express';
const router = express.Router();

import HomeController from '../controllers/home.js';
import LoginController from '../controllers/login.js';
import { CreateUserController, LoginUserController } from '../controllers/user.js';
import DashboardController from '../controllers/dashboard.js';
import LogoutController from '../controllers/logout.js';

import { authMiddleware } from '../middlewares.js';

router.get('/', HomeController);
router.get('/login', LoginController);
router.get('/dashboard', authMiddleware, DashboardController);
router.get('/logout', LogoutController);

router.post('/', CreateUserController);
router.post('/login', LoginUserController);

export default router;
