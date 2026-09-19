const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const executionRoutes = require('./execution.routes');
const problemRoutes = require('./problem.routes');
const submissionRoutes = require('./submission.routes');
const userRoutes = require('./user.routes');
const { checkDockerAvailable } = require('../execution/dockerEngine');
const { testConnection } = require('../config/db');

// Health check endpoint
router.get('/health', async (req, res) => {
  const dbConnected = await testConnection();
  const dockerReady = await checkDockerAvailable();

  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      api: 'healthy',
      database: dbConnected ? 'connected' : 'disconnected',
      dockerEngine: dockerReady ? 'ready' : 'unavailable (daemon offline or not installed)'
    }
  });
});

router.use('/auth', authRoutes);
router.use('/', executionRoutes); // handles /api/execute
router.use('/problems', problemRoutes);
router.use('/submissions', submissionRoutes);
router.use('/users', userRoutes);

module.exports = router;
