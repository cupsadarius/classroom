import {Request, Response} from 'express';
import {authService} from '../services/authService';
import ErrorResponse from '../helpers/ErrorResponse';

export const authenticated = async (req: Request, res: Response, next: Function) => {
  const token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (!token) {
      res.status(401);
      res.json(new ErrorResponse('Invalid token.'));
  }
  try {
      const user = await authService.validate(token);
      if (user) {
          req.user = user;
          next();
      }
  } catch (e) {
      res.status(401);
      res.json(new ErrorResponse('Invalid token'));
  }
};