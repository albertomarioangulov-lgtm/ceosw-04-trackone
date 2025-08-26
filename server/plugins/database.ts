import { Nitro } from 'nitropack'
import mongoose from 'mongoose'

// import { createRoles, createUsers } from "../libs/initialSetup"

export default async (nitroApp: Nitro) => {
  // Evitar múltiples conexiones si este plugin se ejecuta más de una vez.
  if (mongoose.connection.readyState === 1) {
    console.log('=> Using existing database connection.');
    return;
  }

  console.log('=> Creating new database connection.');
  const config = useRuntimeConfig()

  const uri = `${config.mongodbUri}/${config.mongodbName}?retryWrites=true&w=majority`

  try {
    // Configurar listeners de eventos ANTES de conectar
    mongoose.connection.on('connected', () => {
      console.log(`Connected to database: ${config.mongodbName}`);
    });

    mongoose.connection.on('error', (err) => {
      console.error('Mongoose connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose disconnected.');
    });

    // Conectar a MongoDB
    await mongoose.connect(uri);

    // Cierre elegante (Graceful Shutdown)
    nitroApp.hooks.hook('close', async () => {
      await mongoose.disconnect();
      console.log('Mongoose disconnected due to app shutdown.');
    });
  } catch (e) {
    console.error("Initial Mongoose connection failed:", e);
  }

// Initial Setup
// createRoles()
// createUsers()
}