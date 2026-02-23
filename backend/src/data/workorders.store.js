const store = [];

export const findAll = () => store;

export const findById = (id) => store.find((wo) => wo.id === id) || null;

export const insert = (workOrder) => {
  store.push(workOrder);
  return workOrder;
};

export const update = (id, fields) => {
  const index = store.findIndex((wo) => wo.id === id);
  if (index === -1) return null;
  store[index] = { ...store[index], ...fields };
  return store[index];
};

export const remove = (id) => {
  const index = store.findIndex((wo) => wo.id === id);
  if (index === -1) return false;
  store.splice(index, 1);
  return true;
};