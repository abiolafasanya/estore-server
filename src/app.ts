import express, { Request, Response, NextFunction } from 'express';
import http from 'http';
import mongoose from 'mongoose';
import config from './config/';
import routers from './router';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { randomUUID } from 'crypto';
import cors from 'cors'

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
  .then(() => console.log('connected to mongoose and mongodb', config.mongo.url))
  .catch((error) => console.error(error.message));

const startServer = () => {
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(cookieParser());
  app.use(session(sess));
  app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
  }))

  app.use((req: Request, res: Response, next: NextFunction) => {
    // On request method
    res.on('finish', () =>
      console.log(
        `Incoming request: -> Method: [${req.method}] -> Url [${req.url}]
    -> IP [${req.socket.remoteAddress}] -> status: [${res.statusCode}]`
      )
    );

    next();
  });

  // error handler
  app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    error = new Error('Server Error');
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  });

  app.get('/ping', (req, res, next) =>
    res.status(200).json({ message: 'pong' })
  );

  // Routes
  routers(app);

  const server = http.createServer(app);
  server.listen(config.server.port, () =>
    console.log(`Server running on port ${config.server.port}`)
  );
};

startServer();