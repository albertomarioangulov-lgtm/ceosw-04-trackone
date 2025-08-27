import { Nitro } from 'nitropack'
import mongoose from 'mongoose'

export default async (nitroApp: Nitro) => {
  // Evita crear conexiones duplicadas, especialmente útil en desarrollo con HMR (Hot Module Replacement).
  if (mongoose.connection.readyState === 1) {
    console.log('=> Using existing database connection.');
    return;
  }

  console.log('=> Creating new database connection.');
  const config = useRuntimeConfig()

  const uri = `${config.mongodbUri}/${config.mongodbName}?retryWrites=true&w=majority`

  try {
    // Configurar listeners de eventos ANTES de conectar es una buena práctica
    // para no perder ningún evento inicial.
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
    await mongoose.connect(uri, {
      // Fail faster if the database is not reachable
      serverSelectionTimeoutMS: 5000,
    });

    // Cierre elegante (Graceful Shutdown)
    // Esto asegura que la conexión a la base de datos se cierre correctamente
    // cuando la aplicación de Nuxt se detiene.
    nitroApp.hooks.hook('close', async () => {
      await mongoose.disconnect();
      console.log('Mongoose disconnected due to app shutdown.');
    });
  } catch (e) {
    console.error("Initial Mongoose connection failed:", e);
  }
}
