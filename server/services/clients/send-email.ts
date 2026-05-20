import { BrevoClient } from '@getbrevo/brevo';

const config = useRuntimeConfig()

const sendEmail = async(savedData:any) => {
  const name = savedData.name
  const email = savedData.email

  const html = `
  <html>
    <body>
      <h2>Hola {{params.name}}</h2>
      <h2>🌟 ¡Bienvenido al Sistema CEO TrackOne! 🌟</h2>
      <p>Nos alegra que hayas tomado la decisión de hacer parte de este gran equipo.</p>
      <p>Prepárate para la mejor travesía de tu vida</p>
      <p>Te bendecimos</p>

      <p>El equipo CEO TrackOne</p>
    </body>
  </html>
  `

  const brevo = new BrevoClient({
    apiKey: config.brevoApiKey
  });

  // Prepare the email
  const sendSmtpEmail = {
    subject: "Confirmación Email CEO TrackOne.",
    htmlContent: html,
    sender: { name: "CEOSW TrackOne", email: "ceoswdev@gmail.com" },
    to: [{ email: email, name: name }],
    params: { name: name }
  };

  // Send the email
  try {
    const data = await brevo.transactionalEmails.sendTransacEmail(sendSmtpEmail);
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

export default sendEmail
