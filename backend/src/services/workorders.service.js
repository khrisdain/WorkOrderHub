import { randomUUID } from 'crypto';
import * as store from '../data/workorders.store.js';
import { AppError } from '../utils/errors.util.js';
import { ALLOWED_TRANSITIONS } from '../utils/constants.js';

export const createWorkOrder = ({ title, description, department, priority, requesterName, assignee }) => {
  const now = new Date().toISOString();
  const workOrder = {
    id: randomUUID(),
    title,
    description,
    department,
    priority,
    status: 'NEW',
    requesterName,
    assignee: assignee || null,
    createdAt: now,
    updatedAt: now,
  };
  return store.insert(workOrder);
};

export const listWorkOrders = ({ status, department, priority, assignee, q, page = 1, limit = 10 }) => {
  let items = store.findAll();

  if (status)     items = items.filter((wo) => wo.status === status);
  if (department) items = items.filter((wo) => wo.department === department);
  if (priority)   items = items.filter((wo) => wo.priority === priority);
  if (assignee)   items = items.filter((wo) => wo.assignee === assignee);
  if (q)          items = items.filter((wo) => wo.title.toLowerCase().includes(q.toLowerCase()));

  const total = items.length;
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.max(1, parseInt(limit));
  const start = (pageNum - 1) * limitNum;

  return { items: items.slice(start, start + limitNum), page: pageNum, limit: limitNum, total };
};

export const getWorkOrderById = (id) => {
  const wo = store.findById(id);
  if (!wo) throw new AppError(404, 'NOT_FOUND', `Work order ${id} not found.`);
  return wo;
};

export const updateWorkOrder = (id, { title, description, priority, assignee }) => {
  const wo = store.findById(id);
  if (!wo) throw new AppError(404, 'NOT_FOUND', `Work order ${id} not found.`);

  return store.update(id, {
    ...(title       !== undefined && { title }),
    ...(description !== undefined && { description }),
    ...(priority    !== undefined && { priority }),
    ...(assignee    !== undefined && { assignee }),
    updatedAt: new Date().toISOString(),
  });
};

export const changeStatus = (id, newStatus) => {
  const wo = store.findById(id);
  if (!wo) throw new AppError(404, 'NOT_FOUND', `Work order ${id} not found.`);

  const allowed = ALLOWED_TRANSITIONS[wo.status] || [];
  if (!allowed.includes(newStatus)) {
    throw new AppError(
      409,
      'INVALID_TRANSITION',
      `Cannot transition from ${wo.status} to ${newStatus}. Allowed: ${allowed.join(', ') || 'none'}.`
    );
  }

  return store.update(id, { status: newStatus, updatedAt: new Date().toISOString() });
};

export const deleteWorkOrder = (id) => {
  const wo = store.findById(id);
  if (!wo) throw new AppError(404, 'NOT_FOUND', `Work order ${id} not found.`);
  store.remove(id);
};