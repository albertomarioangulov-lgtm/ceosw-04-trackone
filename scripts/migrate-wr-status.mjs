// ============================================================
// Deriva el estado de cada WR según sus paquetes:
//   0 paquetes          -> pending
//   con disponibles     -> opened
//   todos en CR         -> finalized
// Uso: pnpm migrate:wr-status:test
//      node scripts/migrate-wr-status.mjs .env.test
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

try {
  await mongoose.connect(`${MONGODB_URI}/${MONGODB_NAME}?retryWrites=true&w=majority`, { serverSelectionTimeoutMS: 10000 })
} catch (error) {
  console.error(`No se pudo conectar a MongoDB usando ${envFile} (${MONGODB_URI}/${MONGODB_NAME}).`)
  console.error('Verifica la URI o usa otro entorno, por ejemplo: pnpm migrate:wr-status:test')
  process.exit(1)
}

const db = mongoose.connection.db
const wrs = db.collection('wrs')
const packages = db.collection('packages')

let updated = 0
const cursor = wrs.find({})

for await (const wr of cursor) {
  const total = await packages.countDocuments({ wr: wr._id })
  const available = await packages.countDocuments({
    wr: wr._id,
    $or: [{ cr: { $exists: false } }, { cr: null }],
  })

  const status = total === 0 ? 'pending' : available > 0 ? 'opened' : 'finalized'
  await wrs.updateOne({ _id: wr._id }, { $set: { status } })
  updated++
}

console.log(`WRs migrados: ${updated}`)
await mongoose.disconnect()
