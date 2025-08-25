import WR from "~~/server/models/WR"
import Client from "~~/server/models/Client"
import getUserId from "~~/server/libs/userData"

import sendEmailWr from "~~/server/services/clients/send-email-wr"

const config = useRuntimeConfig()

export default defineEventHandler( async (event) => {

  const userId = getUserId(event)

  const id = event.context.params!.id

  const wr = await WR.findById( id )
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
  

  const emailResponse = await sendEmailWr(wr)
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