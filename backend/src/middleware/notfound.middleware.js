import { AppError } from '../utils/errors.util.js';

export default (req, _res, next) => {
  next(new AppError(404, 'NOT_FOUND', `Route ${req.method} ${req.url} not found.`));
};