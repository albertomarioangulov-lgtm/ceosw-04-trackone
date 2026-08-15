import { PERMISSIONS } from '~~/shared/permissions'
import Client from "~~/server/models/Client"
// import getUserId from "~~/server/libs/userData"

import { broadcast } from '~~/server/routes/ws'

export default defineEventHandler( async (event) => {

  await requirePermission(event, PERMISSIONS.CLIENTS_MANAGE)

  const userId = await getUserId(event)

  const body = await readBody(event)
  const { name, code, seller, docTyp, docNum, dateIn, zipCode, country, state, city, phone, address, email, emails, contacts } = body

  const newData = new Client({
    name, code, seller, docTyp, docNum, dateIn, zipCode, country, state, city, phone, address, email, emails, contacts,
    createdBy: userId
  })
  const savedData = await newData.save()

  broadcast({
    type: 'CLIENT_CREATED',
    payload: {
      clientId: savedData._id,
      // Puedes incluir más datos si lo necesitas en el cliente
    }
  })
  
  return savedData
})
