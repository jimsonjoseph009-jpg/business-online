const errorHandler = (err, req, res, next) => {
  console.error('Error:', {
    message: err.message,
    code: err.code,
    status: err.status || 500,
    path: req.path,
    method: req.method
  });

  const status = err.status || 500;
  const message = err.message || 'Internal server error';
  const code = err.code || 'INTERNAL_ERROR';

  res.status(status).json({
    success: false,
    error: message,
    code: code,
    ...(process.env.NODE_ENV === 'development' && { details: err.details })
  });
};

module.exports = { errorHandler };
