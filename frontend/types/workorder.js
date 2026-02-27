export const DEPARTMENTS = ['FACILITIES', 'IT', 'SECURITY', 'HR'];
export const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'];
export const STATUSES = ['NEW', 'IN_PROGRESS', 'BLOCKED', 'DONE'];

export const ALLOWED_TRANSITIONS = {
  NEW: ['IN_PROGRESS'],
  IN_PROGRESS: ['BLOCKED', 'DONE'],
  BLOCKED: ['IN_PROGRESS'],
  DONE: [],
};
