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
    await mongoose.connect(uri)

    // Graceful Shutdown
    // This ensures that the database connection is closed correctly
    // when the Nuxt application stops.
    nitroApp.hooks.hook('close', async () => {
      await mongoose.disconnect();
      console.log('Mongoose disconnected due to app shutdown.');
    });
  } catch (e) {
    console.error("Initial Mongoose connection failed:", e);
  }
}
