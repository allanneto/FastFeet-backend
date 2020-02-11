import { Router } from 'express';

// Controllers
import RecipientController from './app/controllers/RecipientController';
import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middlewares/auth';

const routes = new Router();

// Home
routes.get('/', (req, res) => {
  return res.json({ foi: 'Fala Dev' });
});

// Session routes
routes.post('/login', SessionController.store);

// Using auth middleware after this
routes.use(authMiddleware);

// Recipient routes
routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:id', RecipientController.update);

export default routes;
