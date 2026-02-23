import { randomUUID } from 'crypto';

export default (req, _res, next) => {
  req.requestId = randomUUID();
  next();
};