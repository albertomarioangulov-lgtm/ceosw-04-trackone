const config = useRuntimeConfig()

const sendEmail = async(savedData:any) => {
  const name = savedData.name
  const email = savedData.email

  const html = emailLayout({
    title: 'Bienvenido a CEO TrackOne',
    contentHtml: `
      <h2 style="margin-top:0;color:#1F3B73;">Hola {{params.name}}</h2>
      <p>🌟 ¡Bienvenido al Sistema CEO TrackOne! 🌟</p>
      <p>Nos alegra que hayas tomado la decisión de hacer parte de este gran equipo.</p>
      <p>Prepárate para la mejor travesía de tu vida.</p>
      <p>Te bendecimos.</p>
      <p>El equipo CEO TrackOne</p>
    `,
  })

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

export default sendEmail
