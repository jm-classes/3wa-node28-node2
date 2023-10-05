import { Router } from 'express';
import HomeController from '../controllers/home.js';
import ProductsController from '../controllers/products.js';
import { LoginController, LogoutController, PostLoginController } from '../controllers/login.js';
import { authGuard, setTemplateVars } from '../middlewares/session.js';
import { BasketAddController, BasketController, BasketRemoveController } from '../controllers/basket.js';

const appRouter = Router()

appRouter.use(setTemplateVars)

appRouter.get('/login', LoginController);
appRouter.post('/login', PostLoginController);
appRouter.get('/', authGuard, HomeController);
appRouter.get('/products', authGuard, ProductsController);
appRouter.get('/logout', authGuard, LogoutController);

// @todo: Créer un routeur séparé pour les routes /basket

appRouter.get('/basket', BasketController);
appRouter.get('/basket/add/:product_id', BasketAddController);
appRouter.get('/basket/remove/:product_id', BasketRemoveController);


export default appRouter;
