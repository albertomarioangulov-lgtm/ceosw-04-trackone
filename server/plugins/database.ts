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
    // Fail faster if the database is not reachable. This is crucial for serverless environments.
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000, // Falla después de 5 segundos en lugar de 30
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
