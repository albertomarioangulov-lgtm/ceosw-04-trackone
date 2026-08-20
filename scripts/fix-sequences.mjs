// ============================================================
// Repara secuencias duplicadas (wrId, crId, pkgId).
//
// 1. Renumera los documentos cuyo consecutivo está duplicado
//    (conserva el más antiguo con el número original y, si se pasa
//    `--since <fecha>`, solo toca documentos creados desde esa fecha;
//    los anteriores nunca se modifican).
// 2. Consolida los contadores: elimina los duplicados (con y sin
//    sufijo `_seq`) y deja UNO solo con la llave que usa el código
//    y seq = máximo final.
//
// Uso: node scripts/fix-sequences.mjs .env.test --dry-run
//      node scripts/fix-sequences.mjs .env.prod --since 2026-08-15
//      node scripts/fix-sequences.mjs .env.prod
// ============================================================
import mongoose from 'mongoose'

const envFile = process.argv[2] ?? '.env'
const dryRun = process.argv.includes('--dry-run')
const sinceIdx = process.argv.indexOf('--since')
const sinceArg = sinceIdx !== -1 ? process.argv[sinceIdx + 1] : undefined
const since = sinceArg ? new Date(sinceArg) : null

if (since && Number.isNaN(since.getTime())) {
  console.error(`Fecha inválida para --since: ${sinceArg}`)
  process.exit(1)
}

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
  process.exit(1)
}

const db = mongoose.connection.db
const counters = db.collection('counters')

const sequences = [
  { collection: 'wrs', field: 'wrId', counterKey: 'wrId' },
  { collection: 'crs', field: 'crId', counterKey: 'crId' },
  { collection: 'packages', field: 'pkgId', counterKey: 'pkgId' },
]

for (const seq of sequences) {
  const coll = db.collection(seq.collection)
  const docs = await coll
    .find({ [seq.field]: { $type: 'number' } })
    .sort({ createdAt: 1, _id: 1 })
    .toArray()

  let max = 0
  for (const d of docs) {
    if (d[seq.field] > max) max = d[seq.field]
  }

  const seen = new Set()
  const changes = []
  let next = max + 1

  for (const d of docs) {
    const val = d[seq.field]
    if (seen.has(val)) {
      // Protección: si hay filtro de fecha, solo se renumera lo creado
      // desde esa fecha. Los documentos antiguos nunca se modifican.
      if (since && (!d.createdAt || new Date(d.createdAt) < since)) {
        continue
      }
      const newVal = next++
      changes.push({ _id: d._id, old: val, new: newVal })
      if (!dryRun) {
        await coll.updateOne({ _id: d._id }, { $set: { [seq.field]: newVal } })
      }
    } else {
      seen.add(val)
    }
  }

  const finalMax = Math.max(max, next - 1)
  const keys = [seq.counterKey, `${seq.counterKey}_seq`]
  const existing = await counters.find({ id: { $in: keys } }).toArray()

  if (!dryRun) {
    await counters.deleteMany({ id: { $in: keys } })
    await counters.insertOne({ id: seq.counterKey, seq: finalMax })
  }

  console.log(`\n[${seq.field}] docs=${docs.length} | duplicados=${changes.length} | maxFinal=${finalMax}${dryRun ? ' (dry-run)' : ''}`)
  for (const c of changes) {
    console.log(`   ${String(c._id)}: ${c.old} -> ${c.new}`)
  }
  const before = existing.map((c) => `${c.id}=${c.seq}`).join(', ') || 'ninguno'
  console.log(`   contadores antes: ${before}`)
  console.log(`   contador final: ${dryRun ? `id=${seq.counterKey} seq=${finalMax} (se creará al aplicar)` : `id=${seq.counterKey} seq=${finalMax}`}`)
}

await mongoose.disconnect()
console.log(dryRun ? '\nDry-run finalizado: no se modificó nada.' : '\nSecuencias reparadas.')
