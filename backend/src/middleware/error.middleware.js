import { AppError } from '../utils/errors.util.js';

// eslint-disable-next-line no-unused-vars
export default (err, req, res, _next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      requestId: req.requestId,
      success: false,
      error: { code: 'PAYLOAD_TOO_LARGE', message: 'File exceeds size limit.', details: [] },
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      requestId: req.requestId,
      success: false,
      error: { code: err.code, message: err.message, details: err.details || [] },
    });
  }

  console.error(err);
  return res.status(500).json({
    requestId: req.requestId,
    success: false,
    error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred.', details: [] },
  });
};