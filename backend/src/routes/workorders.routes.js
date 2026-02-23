import { Router } from 'express';
import multer from 'multer';
import * as controller from '../controllers/workorders.controllers.js';
import auth from '../middleware/auth.middleware.js';
import validate from '../middleware/validate.middleware.js';
import { AppError } from '../utils/errors.util.js';
import { DEPARTMENTS, PRIORITIES, STATUSES } from '../utils/constants.js';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new AppError(415, 'UNSUPPORTED_MEDIA_TYPE', 'Only .csv files are accepted.'));
    }
  },
});

const createSchema = {
  title:         { required: true,  type: 'string' },
  description:   { required: true,  type: 'string' },
  department:    { required: true,  enum: DEPARTMENTS },
  priority:      { required: true,  enum: PRIORITIES },
  requesterName: { required: true,  type: 'string' },
};

const updateSchema = {
  priority: { required: false, enum: PRIORITIES },
};

const statusSchema = {
  status: { required: true, enum: STATUSES },
};

router.use(auth);

router.post('/bulk-upload', upload.single('file'), controller.bulkUpload);

router.get('/',              controller.list);
router.get('/:id',           controller.getById);
router.post('/',             validate(createSchema), controller.create);
router.put('/:id',           validate(updateSchema), controller.update);
router.patch('/:id/status',  validate(statusSchema), controller.changeStatus);
router.delete('/:id',        controller.remove);

export default router;