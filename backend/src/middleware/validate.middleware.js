import { AppError } from '../utils/errors.util.js';

const validate = (schema) => (req, _res, next) => {
  const errors = [];

  for (const [field, rules] of Object.entries(schema)) {
    const value = req.body[field];

    if (rules.required && (value === undefined || value === null || value === '')) {
      errors.push({ field, reason: `${field} is required.` });
      continue;
    }

    if (value !== undefined && value !== null && value !== '') {
      if (rules.enum && !rules.enum.includes(value)) {
        errors.push({ field, reason: `${field} must be one of: ${rules.enum.join(', ')}.` });
      }
      if (rules.type === 'string' && typeof value !== 'string') {
        errors.push({ field, reason: `${field} must be a string.` });
      }
    }
  }

  if (errors.length > 0) {
    return next(new AppError(400, 'VALIDATION_ERROR', 'Validation failed.', errors));
  }
  next();
};

export default validate;