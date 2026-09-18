// src/utils/apiResponse.js
export const apiResponse = {
  success(res, statusCode, message, data = null) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  },
  error(res, statusCode, message) {
    return res.status(statusCode).json({
      success: false,
      message,
    });
  }
};