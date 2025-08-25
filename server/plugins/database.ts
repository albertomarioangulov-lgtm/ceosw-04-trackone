import { Nitro } from 'nitropack'
import mongoose from 'mongoose'

// import { createRoles, createUsers } from "../libs/initialSetup"

export default async (_nitroApp: Nitro) => {
  console.log('Nitro is working :)')

  const config = useRuntimeConfig()

  // const db_name = 'gogodev01-dev'
  const uri_default = `${ config.mongodbUri }/${ config.mongodbName }?retryWrites=true&w=majority`
  // const uri = config.mongodbUri || uri_default
  const uri = uri_default

  try {
    await mongoose.connect( uri );
    console.log(`Connected to database: ${ config.mongodbName }`);
  } catch (e) {
    console.error(e);
  }

// Initial Setup
// createRoles()
// createUsers()
}