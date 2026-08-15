// ============================================================
// Migra roles de usuarios: ObjectId (colección Role) -> strings
// y asigna roles según los permisos legacy cuando no hay roles.
// Uso: pnpm migrate:roles              (usa .env - dev local)
//      node scripts/migrate-roles.mjs .env.test
//      pnpm migrate:roles:test
//      pnpm migrate:roles:prod
// ============================================================
import mongoose from 'mongoose'

const envFile = process.argv[2] ?? '.env'
process.loadEnvFile(envFile)

const MONGODB_URI = process.env.MONGODB_URI_CEOSW
const MONGODB_NAME = process.env.MONGODB_NAME

if (!MONGODB_URI || !MONGODB_NAME) {
  console.error('Faltan MONGODB_URI_CEOSW o MONGODB_NAME en .env')
  process.exit(1)
}

const uri = `${MONGODB_URI}/${MONGODB_NAME}?retryWrites=true&w=majority`

try {
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 })
} catch (error) {
  console.error(`No se pudo conectar a MongoDB usando ${envFile} (${MONGODB_URI}/${MONGODB_NAME}).`)
  console.error('Verifica la URI o usa otro entorno, por ejemplo: pnpm migrate:roles:test')
  process.exit(1)
}

const db = mongoose.connection.db
const users = db.collection('users')
const roles = db.collection('roles')

// Mapa _id de la colección Role -> nombre del rol
const roleDocs = await roles.find({}).toArray()
const roleNameById = new Map(roleDocs.map((r) => [String(r._id), r.name]))

let updated = 0
const cursor = users.find({})

for await (const user of cursor) {
  const currentRoles = Array.isArray(user.roles) ? user.roles : []
  const permissions = Array.isArray(user.permissions) ? user.permissions : []

  const names = currentRoles
    .map((r) => {
      const id = r && typeof r === 'object' ? String(r._id ?? r) : String(r)
      return roleNameById.get(id) ?? id
    })
    .filter(Boolean)

  let newRoles = Array.from(new Set(names))

  // Sin roles previos: inferir desde los permisos legacy
  if (newRoles.length === 0) {
    if (permissions.includes('manage_users')) {
      newRoles = ['admin']
    } else if (permissions.some((p) => p.startsWith('manage_'))) {
      newRoles = ['moderator']
    } else if (permissions.some((p) => p.startsWith('view_'))) {
      newRoles = ['nutritionist']
    } else {
      newRoles = ['user']
    }
  }

  await users.updateOne({ _id: user._id }, { $set: { roles: newRoles } })
  updated++
}

console.log(`Usuarios migrados: ${updated}`)
await mongoose.disconnect()
