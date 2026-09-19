const dotenv = require('dotenv');
dotenv.config();

const app = require('./app');
const { testConnection } = require('./config/db');
const { checkDockerAvailable } = require('./execution/dockerEngine');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  console.log('==================================================');
  console.log('       CodeForge Backend Server Starting...       ');
  console.log('==================================================');

  // 1. Verify MySQL connection
  const isDbConnected = await testConnection();
  if (!isDbConnected) {
    console.error('[CRITICAL] MySQL connection failed. Please ensure MySQL service is running and credentials in server/.env are valid.');
  }

  // 2. Check Docker availability
  const isDockerReady = await checkDockerAvailable();
  if (isDockerReady) {
    console.log('[DOCKER] Docker engine is available and active. Container sandbox is ready.');
  } else {
    console.warn('[DOCKER WARNING] Docker daemon is currently unreachable or Docker CLI is not installed on PATH.');
    console.warn('[DOCKER WARNING] The platform will serve API requests normally, but code execution requests will return a structured SYSTEM_ERROR until Docker is started.');
  }

  // 3. Start Express server
  const server = app.listen(PORT, () => {
    console.log(`[HTTP] CodeForge API server is running on port ${PORT}`);
    console.log(`[HTTP] Health check available at: http://localhost:${PORT}/api/health`);
    console.log('==================================================');
  });

  // Graceful shutdown
  const handleShutdown = () => {
    console.log('\nGracefully shutting down server...');
    server.close(() => {
      console.log('Server terminated. Goodbye!');
      process.exit(0);
    });
  };

  process.on('SIGINT', handleShutdown);
  process.on('SIGTERM', handleShutdown);
};

startServer();
