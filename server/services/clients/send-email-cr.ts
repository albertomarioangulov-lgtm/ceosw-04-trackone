import Package from "~~/server/models/Package"
import { emailLayoutResponsive, packageCardsHtml } from '~~/server/utils/emailTemplateResponsive'

const config = useRuntimeConfig()

const sendEmailCr = async(savedData:any) => {
  const cr = savedData._id.toString()
  const name = savedData.client.name
  const clientEmails = savedData.client.emails

  const staticRecipients = [
    { email: "info@comprasyenviosonline.com", name: "Info CEO TrackOne" }
    // { email: "ceoswdev@gmail.com", name: "CEO TrackOne" }
  ];

  // Mapea los correos del cliente al formato requerido por Brevo
  const clientRecipients = Array.isArray(clientEmails)
    ? clientEmails
        .map((emailObj: { email: string | null }) => emailObj.email) // Extrae la dirección de correo del objeto
        .filter((email): email is string => !!email) // Filtra cualquier valor nulo o vacío
        .map((email: string) => ({ email, name })) // Mapea al formato que Brevo espera: {email, name}
    : [];

  const now = new Date()
  const formattedDate = now.toLocaleString()


  const rawPackages = await Package.find()
    .populate({ path: 'wr', select: 'wrId client',
      populate: { path: 'client', select: 'name' }
    })
    // .populate({ path: 'cr', select: 'crId' })
    .populate({ path: 'createdBy', select: 'name initials color' })
    .where( 'cr' ).equals( cr )
    .lean()
    .exec()


  const html = emailLayoutResponsive({
    title: 'Paquetes Recibidos — Compras y Envíos Online',
    contentHtml: `
      <h2 style="margin-top:0;color:#1F3B73;">Hola {{params.name}}</h2>
      <p>Estimado cliente: los siguientes son los números de rastreo de los paquetes recibidos en nuestra bodega.</p>
      ${packageCardsHtml(rawPackages)}
      <p>Cualquier inquietud, escríbenos a <a href="mailto:info@comprasyenviosonline.com" style="color:#26ADE4;">info@comprasyenviosonline.com</a>.<br/>
      Cordialmente, <strong>Compras y Envíos Online</strong>.</p>
    `,
    footerNote: `Fecha y Hora: ${formattedDate}`,
  })

  // Prepare the email
  const sendSmtpEmail = {
    subject: `Paquetes de WR: ${savedData.wrId} . ${name}`,
    htmlContent: html,
    sender: { name: "CEOSW TrackOne", email: "ceoswdev@gmail.com" },
    to: [...staticRecipients, ...clientRecipients],
    replyTo: { email: "ceomiami@comprasyenviosonline.com", name: "CEO TrackOne Miami" },
    params: { name: name }
  };

  // Send the email
  try {
    const data = await sendBrevoEmail(sendSmtpEmail);
    console.log('API called successfully. Returned data: ' + JSON.stringify(data));
    const resp = JSON.stringify(data)
    return {
      status: 'success',
      message: 'Email sent successfully',
      data: resp
    }
  } catch (error) {
    console.error(error);
    return {
      status: 'error',
      message: 'Failed to send email',
      error: error
    }
  }

} 

export default sendEmailCr
