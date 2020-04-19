import { Router } from 'express';

import multer from 'multer';

// Controllers
import RecipientController from './app/controllers/RecipientController';
import SessionController from './app/controllers/SessionController';
import CourierController from './app/controllers/CourierController';
import CourierOptionsController from './app/controllers/CourierOptionsController';
import FileController from './app/controllers/FileController';
import DeliveryController from './app/controllers/DeliveryController';
import DeliveryProblemsController from './app/controllers/DeliveryProblemsController';

import authMiddleware from './app/middlewares/auth';

import multerConfig from './config/multer';

const routes = new Router();

const upload = multer(multerConfig);

// Home
routes.get('/', (req, res) => {
  return res.json({ foi: 'Fala Dev' });
});

// Session routes
routes.post('/login', SessionController.store);

// Courier options
routes.get('/deliveryman/:courier_id', CourierOptionsController.login);

routes.get(
  '/deliveryman/:courier_id/deliveries',
  CourierOptionsController.index
);

routes.get(
  '/deliveryman/:courier_id/deliveries/:delivery_id',
  CourierOptionsController.startDelivery
);
routes.post(
  '/deliveryman/:courier_id/deliveries/:delivery_id',
  upload.single('file'),
  CourierOptionsController.finishDelivery
);
routes.post(
  '/deliveryman/:courier_id/deliveries/',
  CourierOptionsController.teste
);

// Delivery Problems
routes.get('/problems', DeliveryProblemsController.index);
routes.post('/problems/:delivery_id', DeliveryProblemsController.store);
routes.delete('/problems/:id', DeliveryProblemsController.delete);

// Using auth middleware after this
routes.use(authMiddleware);

// Recipient
routes.get('/recipients', RecipientController.index);
routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:id', RecipientController.update);
routes.delete('/recipients/:id', RecipientController.delete);

// Couriers routes
routes.post('/couriers', CourierController.store);
routes.get('/couriers', CourierController.index);
routes.put('/couriers', CourierController.update);
routes.delete('/couriers/:id', CourierController.delete);

// Delivery routes
routes.post('/delivery', DeliveryController.store);
routes.get('/delivery', DeliveryController.index);
routes.put('/delivery/:id', DeliveryController.update);
routes.delete('/delete-delivery/:id', DeliveryController.delete);
routes.get('/delivery/:id', DeliveryController.cancel);

// Avatar ID
routes.post('/files', upload.single('file'), FileController.store);

export default routes;
