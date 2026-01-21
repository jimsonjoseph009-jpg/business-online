const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  // Log response when it's sent
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
  });

  next();
};

module.exports = { requestLogger };
