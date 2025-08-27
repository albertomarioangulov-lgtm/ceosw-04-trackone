import { Nitro } from 'nitropack'
import mongoose from 'mongoose'

export default async (nitroApp: Nitro) => {
  // Avoid creating duplicate connections, especially useful in development with HMR (Hot Module Replacement).
  if (mongoose.connection.readyState === 1) {
    console.log('=> Using existing database connection.');
    return;
  }

  console.log('=> Creating new database connection.');
  const config = useRuntimeConfig()

  const uri = `${config.mongodbUri}/${config.mongodbName}?retryWrites=true&w=majority`

  try {
    // Setting up event listeners BEFORE connecting is a good practice
    // to avoid missing any initial events.
    mongoose.connection.on('connected', () => {
      console.log(`Connected to database: ${config.mongodbName}`);
    });

    mongoose.connection.on('error', (err) => {
      console.error('Mongoose connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose disconnected.');
    });

    // Connect to MongoDB
    // Fail faster if the database is not reachable. This is crucial for serverless environments.
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000 // Falla después de 5 segundos en lugar de 30
    });

    // Graceful Shutdown
    // This ensures that the database connection is closed correctly
    // when the Nuxt application stops.
    nitroApp.hooks.hook('close', async () => {
      await mongoose.disconnect();
      console.log('Mongoose disconnected due to app shutdown.');
    });
  } catch (e) {
    console.error("Initial Mongoose connection failed:", e);
    // Re-throw the error to ensure the container crashes and Cloud Run shows the actual
    // connection error in the logs, instead of a generic timeout error.
    throw e;
  }
}
