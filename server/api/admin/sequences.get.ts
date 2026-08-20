import { PERMISSIONS } from '~~/shared/permissions'
import mongoose from 'mongoose'

export default defineEventHandler(async (event) => {
  await requirePermission(event, PERMISSIONS.USERS_MANAGE)

  const db = mongoose.connection.db
  const configs = [
    { collection: 'wrs', field: 'wrId', oldField: 'old_wrId', entity: 'WR' },
    { collection: 'crs', field: 'crId', oldField: 'old_crId', entity: 'CR' },
    { collection: 'packages', field: 'pkgId', oldField: 'old_pkgId', entity: 'Paquete' },
  ]

  const items: any[] = []
  for (const c of configs) {
    const docs = await db.collection(c.collection)
      .find({ [c.oldField]: { $exists: true } })
      .sort({ createdAt: -1 })
      .limit(1000)
      .toArray()

    for (const d of docs) {
      items.push({
        entity: c.entity,
        id: String(d._id),
        oldValue: d[c.oldField],
        newValue: d[c.field],
        createdAt: d.createdAt,
      })
    }
  }

  items.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
  return { items }
})
