import mongoose from 'mongoose';
import { config } from './env.js';

let memoryServer = null;

/**
 * Establish connection to MongoDB using Mongoose.
 * Connects to config.mongodbUri. In development environments where a local
 * MongoDB daemon is not running, seamlessly initializes an in-memory instance
 * to guarantee 100% real Mongoose query and indexing execution.
 */
export async function connectDB() {
  try {
    // Set strictQuery for modern Mongoose 7/8/9
    mongoose.set('strictQuery', true);

    let targetUri = config.mongodbUri;

    // Attempt connecting to the configured URI with a 2-second timeout
    try {
      const conn = await mongoose.connect(targetUri, {
        serverSelectionTimeoutMS: 2000,
      });
      console.log(`✓ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
      return conn;
    } catch (primaryErr) {
      // If external or local daemon connection failed, seamlessly use in-memory fallback
      const shouldUseFallback =
        config.nodeEnv === 'development' ||
        !process.env.MONGODB_URI ||
        targetUri.includes('localhost') ||
        targetUri.includes('127.0.0.1');

      if (shouldUseFallback) {
        console.warn(`! Primary MongoDB connection to "${targetUri}" failed (${primaryErr.message}).`);
        console.log(`  Starting in-memory MongoDB instance fallback...`);

        try {
          const { MongoMemoryServer } = await import('mongodb-memory-server');
          memoryServer = await MongoMemoryServer.create();
          targetUri = memoryServer.getUri();

          const memoryConn = await mongoose.connect(targetUri);
          console.log(`✓ In-Memory MongoDB Connected: ${memoryConn.connection.host}/${memoryConn.connection.name}`);
          return memoryConn;
        } catch (memErr) {
          console.error('Failed to initialize in-memory MongoDB:', memErr.message);
          throw primaryErr;
        }
      } else {
        throw primaryErr;
      }
    }
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
    throw error;
  }
}

/**
 * Disconnect MongoDB connection cleanly
 */
export async function disconnectDB() {
  try {
    await mongoose.disconnect();
    if (memoryServer) {
      await memoryServer.stop();
      memoryServer = null;
    }
    console.log('MongoDB disconnected successfully');
  } catch (err) {
    console.error('Error disconnecting MongoDB:', err.message);
  }
}
