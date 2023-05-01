import { Express } from 'express';
import controller from '../controller/AuthController';

export default function (app: Express) {
  app.post('/auth', controller.authenticate);
  app.post('/auth/signup', controller.signUp);
  app.get('/auth/logout', controller.logout);
}
