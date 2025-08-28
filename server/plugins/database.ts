import { Nitro } from 'nitropack'
import mongoose from 'mongoose'

export default async (nitroApp: Nitro) => {
  // Avoid creating duplicate connections, especially useful in development with HMR (Hot Module Replacement).
  if (mongoose.connection.readyState === 1) {
    console.log('\x1b[33m🔄 Using existing database connection.\x1b[0m');
    return;
  }

  console.log('\x1b[34m ➜ Creating new database connection.\x1b[0m');
  const config = useRuntimeConfig()

  const uri = `${config.mongodbUri}/${config.mongodbName}?retryWrites=true&w=majority`

  try {
    // Setting up event listeners BEFORE connecting is a good practice
    // to avoid missing any initial events.
    mongoose.connection.on('connected', () => {
      console.log(`\x1b[32m🔗 Connection to \x1b[1m${config.mongodbName}\x1b[22m established successfully.\x1b[0m`);
    });

    mongoose.connection.on('error', (err) => {
      console.error('\x1b[31m❌ Mongoose connection error:\x1b[0m', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('\x1b[33m❗  Mongoose disconnected.\x1b[0m');
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
      console.log('\x1b[33m🔌 Mongoose disconnected due to app shutdown.\x1b[0m');
    });
  } catch (e) {
    console.error("\x1b[31m💥 Initial Mongoose connection failed:\x1b[0m", e);
    // Re-throw the error to ensure the container crashes and Cloud Run shows the actual
    // connection error in the logs, instead of a generic timeout error.
    throw e;
  }
}
