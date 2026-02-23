export const sendSuccess = (res, data, statusCode = 200) => {
  return res.status(statusCode).json({
    requestId: res.req.requestId,
    success: true,
    data,
  });
};

export const sendError = (res, statusCode, code, message, details = []) => {
  return res.status(statusCode).json({
    requestId: res.req.requestId,
    success: false,
    error: { code, message, details },
  });
};