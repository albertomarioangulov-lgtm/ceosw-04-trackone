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
    // Para entornos de producción, es una buena práctica añadir opciones de conexión más específicas.
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // Timeout después de 5s en lugar de 30s
      autoIndex: false, // No construir índices automáticamente, especialmente en producción
    });

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