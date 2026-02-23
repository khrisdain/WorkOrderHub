import express from 'express';
import requestIdMiddleware from './middleware/requestid.middleware.js';
import notFoundMiddleware from './middleware/notfound.middleware.js';
import errorMiddleware from './middleware/error.middleware.js';
import routes from './routes/index.routes.js';

const app = express();

app.use(express.json());
app.use(requestIdMiddleware);

app.use((req, _res, next) => {
  console.log(`[${req.requestId}] ${req.method} ${req.url}`);
  next();
});

app.use('/', routes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;