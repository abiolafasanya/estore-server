import { Express } from 'express';
import authRoute from './authRoute';


export default function (app: Express) {
  authRoute(app);
//   userRoute(app);
//   courseRoute(app);
//   menuRoute(app);
//   postRoute(app);
}