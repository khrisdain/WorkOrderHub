import { randomUUID } from 'crypto';
import { parse } from 'csv-parse/sync';
import * as service from '../services/workorders.service.js';
import { sendSuccess } from '../utils/response.util.js';
import { AppError } from '../utils/errors.util.js';
import { DEPARTMENTS, PRIORITIES } from '../utils/constants.js';

export const list = (req, res, next) => {
  try {
    sendSuccess(res, service.listWorkOrders(req.query));
  } catch (err) {
    next(err);
  }
};

export const getById = (req, res, next) => {
  try {
    sendSuccess(res, service.getWorkOrderById(req.params.id));
  } catch (err) {
    next(err);
  }
};

export const create = (req, res, next) => {
  try {
    sendSuccess(res, service.createWorkOrder(req.body), 201);
  } catch (err) {
    next(err);
  }
};

export const update = (req, res, next) => {
  try {
    sendSuccess(res, service.updateWorkOrder(req.params.id, req.body));
  } catch (err) {
    next(err);
  }
};

export const changeStatus = (req, res, next) => {
  try {
    sendSuccess(res, service.changeStatus(req.params.id, req.body.status));
  } catch (err) {
    next(err);
  }
};

export const remove = (req, res, next) => {
  try {
    service.deleteWorkOrder(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

// ── Bulk Upload ──────────────────────────────────────────────────────────────

const REQUIRED_HEADERS = ['title', 'description', 'department', 'priority', 'requestername'];

const validateRow = (row, rowNum) => {
  const errors = [];
  const norm = Object.fromEntries(
    Object.entries(row).map(([k, v]) => [k.toLowerCase().trim(), typeof v === 'string' ? v.trim() : v])
  );

  if (!norm.title)       errors.push({ row: rowNum, field: 'title',         reason: 'title is required.' });
  if (!norm.description) errors.push({ row: rowNum, field: 'description',   reason: 'description is required.' });
  if (!DEPARTMENTS.includes(norm.department))
    errors.push({ row: rowNum, field: 'department', reason: `Must be one of: ${DEPARTMENTS.join(', ')}.` });
  if (!PRIORITIES.includes(norm.priority))
    errors.push({ row: rowNum, field: 'priority',   reason: `Must be one of: ${PRIORITIES.join(', ')}.` });
  if (!norm.requestername)
    errors.push({ row: rowNum, field: 'requesterName', reason: 'requesterName is required.' });

  return { errors, normalized: norm };
};

export const bulkUpload = (req, res, next) => {
  try {
    if (!req.file) {
      throw new AppError(400, 'VALIDATION_ERROR', 'No file uploaded. Use multipart/form-data with field name "file".');
    }

    const ext = req.file.originalname.split('.').pop().toLowerCase();
    if (ext !== 'csv') {
      throw new AppError(415, 'UNSUPPORTED_MEDIA_TYPE', 'Only .csv files are accepted.');
    }

    let records;
    try {
      records = parse(req.file.buffer, { columns: true, skip_empty_lines: true, trim: true });
    } catch {
      throw new AppError(400, 'VALIDATION_ERROR', 'Failed to parse CSV file. Ensure it is valid CSV.');
    }

    if (records.length === 0) {
      throw new AppError(400, 'VALIDATION_ERROR', 'CSV file is empty or contains only headers.');
    }

    const headers = Object.keys(records[0]).map((h) => h.toLowerCase().trim());
    const missingHeaders = REQUIRED_HEADERS.filter((h) => !headers.includes(h));
    if (missingHeaders.length > 0) {
      throw new AppError(400, 'VALIDATION_ERROR', `Missing required CSV columns: ${missingHeaders.join(', ')}.`);
    }

    // Strategy A — Partial Acceptance
    const rowErrors = [];
    const created = [];

    records.forEach((row, idx) => {
      const rowNum = idx + 2;
      const { errors, normalized } = validateRow(row, rowNum);
      if (errors.length > 0) {
        rowErrors.push(...errors);
      } else {
        created.push(service.createWorkOrder({
          title:         normalized.title,
          description:   normalized.description,
          department:    normalized.department,
          priority:      normalized.priority,
          requesterName: normalized.requestername,
          assignee:      normalized.assignee || null,
        }));
      }
    });

    sendSuccess(res, {
      uploadId: randomUUID(),
      strategy: 'PARTIAL_ACCEPTANCE',
      totalRows: records.length,
      accepted:  created.length,
      rejected:  records.length - created.length,
      errors:    rowErrors,
    }, 201);
  } catch (err) {
    next(err);
  }
};