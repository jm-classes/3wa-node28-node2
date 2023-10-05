import { Router } from 'express';
import HomeController from '../controllers/home.js';
import ProductsController from '../controllers/products.js';
import { LoginController, PostLoginController } from '../controllers/login.js';

const appRouter = Router()

appRouter.use((req, res, next) => {
  res.locals.user = req.session?.user ?? null
  next()
})

appRouter.get('/login', LoginController);
appRouter.post('/login', PostLoginController);
appRouter.get('/', HomeController);
appRouter.get('/products', ProductsController);

export default appRouter;
