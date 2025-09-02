import { Nitro } from 'nitropack'
import mongoose from 'mongoose'
import { consola } from 'consola'
import chalk from 'chalk'


const dbLog = consola.withTag('database')

export default async (nitroApp: Nitro) => {
  // Avoid creating duplicate connections, especially useful in development with HMR (Hot Module Replacement).
  if (mongoose.connection.readyState === 1) {
    dbLog.info(chalk.gray('Reusing existing connection.'));
    return;
  }

  const config = useRuntimeConfig()

  // 1. Validate required configuration
  if (!config.mongodbUri || !config.mongodbName) {
    dbLog.fatal('Missing `mongodbUri` or `mongodbName` in runtime config. Aborting connection.');
    // En un entorno de producción, esto debería detener el arranque de la aplicación.
    // En Nitro/Nuxt, lanzar un error aquí detendrá el servidor.
    throw new Error('Database configuration is incomplete.');
  }

  const uri = `${config.mongodbUri}/${config.mongodbName}?retryWrites=true&w=majority`

  // Sanitize URI for logging to avoid exposing credentials and cluster address.
  const sanitizedUri = uri
    .replace(/\/\/(.*?)@([^/]+)/, '//****@<cluster>') // Replaces user:pass@cluster-url with ****@<cluster>
    .replace(/\?.*$/, ''); // Removes query parameters

  dbLog.start(`Connecting to ${chalk.cyan(sanitizedUri)}...`);

  try {
    // Setting up event listeners BEFORE connecting is a good practice
    // to avoid missing any initial events.
    mongoose.connection.on('connected', () => {
      dbLog.success(`Connection to ${chalk.green.bold(config.mongodbName)} established successfully.`);
    });

    mongoose.connection.on('error', (err) => {
      dbLog.error(`Mongoose ${chalk.red('connection error')}:`, err);
    });

    mongoose.connection.on('disconnected', () => {
      dbLog.warn('Mongoose connection lost.');
    });

    // Connect to MongoDB
    // 2. Use configurable connection options
    const mongooseOptions = {
      serverSelectionTimeoutMS: config.mongodbServerSelectionTimeoutMS || 10000, // Fail after 10s instead of 30s
      maxPoolSize: config.mongodbMaxPoolSize || 10, // Maintain up to 10 socket connections
    };

    await mongoose.connect(uri, {
      ...mongooseOptions
    });

    // Graceful Shutdown
    // This ensures that the database connection is closed correctly
    // when the Nuxt application stops.
    nitroApp.hooks.hook('close', async () => {
      await mongoose.disconnect();
      dbLog.warn('Mongoose disconnected due to application shutdown.');
    });
  } catch (e) {
    dbLog.error('Initial connection failed:', e);
    // Re-throw the error to ensure the container crashes and Cloud Run shows the actual
    // connection error in the logs, instead of a generic timeout error.
    throw e;
  }
}
