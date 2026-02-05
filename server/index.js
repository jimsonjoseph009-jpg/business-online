const express = require('express');
const cors = require('cors');
require('dotenv').config();

const config = require('./config/env');
const { requestLogger } = require('./middleware/logger');
const { errorHandler } = require('./middleware/errorHandler');

// Import routes
const healthRoutes = require('./routes/health');
const customerRoutes = require('./routes/customers');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const messagesRoutes = require('./routes/messages');
const notificationsRoutes = require('./routes/notifications');
const searchesRoutes = require('./routes/searches');
const demoRoutes = require('./routes/demo');

const app = express();

// Middleware
app.use(cors({
  origin: config.CORS_ORIGIN,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Routes
app.use(`${config.API_PREFIX}/health`, healthRoutes);
app.use(`${config.API_PREFIX}/customers`, customerRoutes);
app.use(`${config.API_PREFIX}/products`, productRoutes);
app.use(`${config.API_PREFIX}/orders`, orderRoutes);
app.use(`${config.API_PREFIX}/messages`, messagesRoutes);
app.use(`${config.API_PREFIX}/conversations`, messagesRoutes);
app.use(`${config.API_PREFIX}/notifications`, notificationsRoutes);
app.use(`${config.API_PREFIX}/reviews`, searchesRoutes);
app.use(`${config.API_PREFIX}/searches`, searchesRoutes);
app.use(`${config.API_PREFIX}/demo`, demoRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    code: 'NOT_FOUND',
    path: req.path,
    method: req.method
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = config.PORT;
const server = app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════╗
║  🚀 Business Online API Server 🚀    ║
╚══════════════════════════════════════╝
📡 Server running on port ${PORT}
🌍 Environment: ${config.NODE_ENV}
🔗 CORS Origin: ${config.CORS_ORIGIN}
📅 Started at: ${new Date().toLocaleString()}
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

module.exports = app;
