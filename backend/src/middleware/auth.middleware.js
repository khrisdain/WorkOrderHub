import { AppError } from '../utils/errors.util.js';

export default (req, _res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return next(new AppError(401, 'UNAUTHORIZED', 'Invalid or missing API key.'));
  }
  next();
};