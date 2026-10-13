import app from './app.js';
import { config } from './config/env.js';
import { connectDB, disconnectDB } from './config/db.js';

const PORT = config.port;

let server;

async function startServer() {
  try {
    // 1. Establish database connection
    await connectDB();

    // 2. Start HTTP server
    server = app.listen(PORT, () => {
      console.log(`===============================================`);
      console.log(` APTIVELLA Backend Server Started`);
      console.log(` Environment : ${config.nodeEnv}`);
      console.log(` Port        : ${PORT}`);
      console.log(` URL         : http://localhost:${PORT}`);
      console.log(` Health Check: http://localhost:${PORT}/api/health`);
      console.log(` Auth Route  : http://localhost:${PORT}/api/auth`);
      console.log(` Allowed CORS: ${config.clientUrl}`);
      console.log(`===============================================`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

// Graceful shutdown handling
async function shutdown(signal) {
  console.log(`${signal} received: closing server and disconnecting database...`);
  if (server) {
    server.close(async () => {
      console.log('HTTP server closed');
      await disconnectDB();
      process.exit(0);
    });
  } else {
    await disconnectDB();
    process.exit(0);
  }
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

startServer();
