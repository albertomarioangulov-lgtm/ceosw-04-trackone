import { PERMISSIONS } from '~~/shared/permissions'
import CR from "~~/server/models/CR"
import Client from "~~/server/models/Client"
// import getUserId from "~~/server/libs/userData"

import sendEmailCr from "~~/server/services/clients/send-email-cr"

const config = useRuntimeConfig()

export default defineEventHandler( async (event) => {
  await requirePermission(event, PERMISSIONS.CRS_MANAGE)

  const userId = await getUserId(event)

  const id = event.context.params!.id

  const cr = await CR.findById( id )
      .populate({ path: 'client', select: 'name emails' })
      .populate({ path: 'createdBy', select: 'name initials color' })
      .exec()

  // if (!wr) {
  //   // Handle not found case, e.g. return an error or null
  //   return { error: 'WR not found', emailSent: false };
  // }

  // console.log('wr: ', wr);

  // const clientId = wr.client;

  // const client = await Client.findById( clientId )
  //     .populate({ path: 'createdBy', select: 'name initials color' })
  //     .exec()
  

  const emailResponse = await sendEmailCr(cr)
  const emailSent = emailResponse ? true : false
  const emailStatus = emailResponse ? emailResponse.status : 'Email failed to send'

  // console.log('emailResponse', emailResponse)

  const editData = {
    emailSent,
    emailStatus,
    emailSentBy: userId,
  }
    
    // const updatedData = await Client.findByIdAndUpdate( id, editData, { new: true })
    //   .exec()
  
  return emailSent
})
