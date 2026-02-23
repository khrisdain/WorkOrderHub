import { Router } from 'express';
import workordersRouter from './workorders.routes.js';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

router.use('/api/workorders', workordersRouter);

export default router;