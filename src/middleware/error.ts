import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

interface CustomError extends Error {
  kind?: string;
}

const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode: number = res.statusCode === 200 ? 500 : res.statusCode;
  let message: string;

  if (err instanceof mongoose.Error) {
    if (err.name === 'CastError' && err?.kind === 'ObjectId') {
      statusCode = 400;
      message = 'Resource not found';
    } else {
      message = err.message;
    }
  } else {
    message = err.message;
  }

  // additional error handling logic here

  res.status(statusCode).json({
    message: message,
    stack: process.env.NODE_ENV !== 'production' ? err.stack : null,
  });
};

const onRequestHandler = (req: Request, res: Response, next: NextFunction) => {
  // On request method
  res.on('finish', () =>
    console.log(
      `Incoming request: -> Method: [${req.method}] -> Url [${req.url}]
    -> IP [${req.socket.remoteAddress}] -> status: [${res.statusCode}]`
    )
  );

  next();
};

export { notFoundHandler, errorHandler, onRequestHandler };
