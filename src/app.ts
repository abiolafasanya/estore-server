import express, { Request, Response, NextFunction } from 'express';
import http from 'http';
import mongoose from 'mongoose';
import config from './config/';
import routers from './router';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { randomUUID } from 'crypto';
import cors from 'cors'
import { errorHandler, notFoundHandler, onRequestHandler } from './middleware/error';

const app = express();

interface I_Session extends session.SessionOptions {}
const sess: I_Session = {
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60000 },
  name: 'estore-session',
  genid: function (req: Request) {
    return randomUUID(); // use UUIDs for session IDs
  },
};

mongoose
  .connect(config.mongo.url, { retryWrites: true, w: 'majority' })
  .then(() =>
    console.log('connected to mongoose and mongodb', config.mongo.url)
  )
  .catch((error) => console.error(error.message));

const startServer = () => {
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(cookieParser());
  app.use(session(sess));
  app.use(
    cors({
      origin: ['https://eshop-fashion.netlify.app', 'http://localhost:3500'],
      credentials: true,
    })
    );
    
    app.get('/ping', (req, res, next) =>
    res.status(200).json({ message: 'pong' })
    );
    
    // Routes
    routers(app);

    app.use(onRequestHandler)
    app.use(notFoundHandler);
    app.use(errorHandler);
    
  const server = http.createServer(app);
  server.listen(config.server.port, () =>
    console.log(`Server running on port ${config.server.port}`)
  );
};

startServer();