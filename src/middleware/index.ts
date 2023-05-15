import { Request, Response, NextFunction } from 'express';
import { errorHandler, notFoundHandler, onRequestHandler } from './error';
interface CustomError extends Error {
  kind?: string;
}
export const errorMiddleware = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  errorHandler(err, req, res, next);
  notFoundHandler(req, res, next);
  onRequestHandler(req, res, next);
};
