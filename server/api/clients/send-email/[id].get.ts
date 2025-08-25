import Client from "~~/server/models/Client"
import getUserId from "~~/server/libs/userData"

import sendEmailWr from "~~/server/services/clients/send-email-wr"

const config = useRuntimeConfig()

export default defineEventHandler( async (event) => {

  const userId = getUserId(event)

  const id = event.context.params!.id

  const client = await Client.findById( id )
      .populate({ path: 'createdBy', select: 'name initials color' })
      .exec()
  

  const emailResponse = await sendEmailWr(client)
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