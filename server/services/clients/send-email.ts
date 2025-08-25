// import brevo from '@getbrevo/brevo';
// import { ApiClient } from '@getbrevo/brevo';
import { SendSmtpEmail, TransactionalEmailsApi, TransactionalEmailsApiApiKeys } from '@getbrevo/brevo';
// const brevo = require('@getbrevo/brevo'); // Corrected import path
// import { ApiClient } from '@getbrevo/brevo'; // Corrected import path
// import QRCode from "qrcode";
// import { ApiClient } from '@getbrevo/brevo';
// import fs from 'fs';
// import path from 'path';

const config = useRuntimeConfig()



const sendEmail = async(savedData:any) => {
  const idCode = savedData._id.toString()
  const name = savedData.name
  const companion = savedData.companion
  const phone = savedData.phone
  const email = savedData.email
  // const logoMiTravesia = '/app/assets/images/logo-mi_travesia.png'
  // const logoUrl = "https://events-3.netlify.app/images/crbaq-azul-logo.svg";
  // const imagePath = './path-to-image/logo.png'; // Ruta de la imagen local
  // const imageBase64 = fs.readFileSync(logoMiTravesia, { encoding: 'base64' });


  // console.log('__dirname: ', __dirname)
  // Ruta de la imagen local
  // const logoPath = path.resolve(__dirname, '../../../app/assets/images/logo-mi_travesia.png');
  // const logoPath = path.resolve('../../../app/assets/images/logo-mi_travesia.png');
  // console.log('logoPath: ', logoPath)

  // Convertir la imagen de la URL a Base64 usando fetch
  // const getImageBase64 = async (url: string): Promise<string> => {
  //   const response = await fetch(url);
  //   const buffer = await response.arrayBuffer();
  //   const base64 = Buffer.from(buffer).toString('base64');
  //   return base64;
  // };

  // Convertir la imagen local a Base64
  // const getImageBase64 = (filePath: string): string => {
  //   const fileBuffer = fs.readFileSync(filePath);
  //   return fileBuffer.toString('base64');
  // };

  // const imageBase64 = await getImageBase64(logoUrl);
  // const imageBase64 = getImageBase64(logoMiTravesia);
  // console.log('imageBase64', imageBase64)

  // const qrCodeDataURL = QRCode.toDataURL(idCode);
  // const qrBase64 = qrCodeDataURL
  // const qrCodeBase64 = (await qrBase64).split(',')[1];

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
      // <img src="data:image/png;base64,${imageBase64}" alt="Mi Travesia" height="100" />
      // <img src="data:image/png;base64,${imageBase64}" alt="Mi Travesia" />
      // <img src="data:image/png;base64,${imageBase64}" alt="Mi Travesia" />
      // <img src="https://events-3.netlify.app/images/crbaq-azul-logo.svg" alt="Mi Travesia" />
      // <img src="${logoMiTravesia}" alt="Mi Travesia" />
      // <p>⏰ Hora: 2:00 - 6:00 PM</p>
      // <img src="${qrCodeDataURL}" alt="QR Code" />

  // class CustomAccountApi extends AccountApi {
  //   getAuthentications() {
  //     return this.authentications; // Ahora puedes acceder a 'authentications'
  //   }
  // }

  const defaultClient = new TransactionalEmailsApi();
    defaultClient.setApiKey(
    TransactionalEmailsApiApiKeys.apiKey, config.brevoApiKey
    
    // process.env.BREVO_API_KEY ?? ''
  );

   // Create an instance of the TransactionalEmailsApi
  //  const apiInstance = new brevo.TransactionalEmailsApi();

  // Configure the API client with the API key
  // const defaultClient = ApiClient.instance;
  // const apiKey = apiInstance.authentications['apiKey'];
  // apiKey.apiKey = 'REDACTED'; // Replace with your actual API key

  // Create an instance of the TransactionalEmailsApi
  // const apiInstance = new brevo.TransactionalEmailsApi();

  // Prepare the email
  // const sendSmtpEmail = new brevo.SendSmtpEmail();
  const sendSmtpEmail = new SendSmtpEmail();
  sendSmtpEmail.subject = "Confirmación Email CEO TrackOne.";
  sendSmtpEmail.htmlContent = html;
  // sendSmtpEmail.templateId = 2; // ID de la plantilla
  sendSmtpEmail.sender = { name: "CEOSW TrackOne", email: "ceoswdev@gmail.com" };
  sendSmtpEmail.to = [{ email: email, name: name }];
  // sendSmtpEmail.attachment = [
  //   {
  //     content: qrCodeBase64, // Contenido en base64
  //     name: "qr.png", // Nombre del archivo
  //   },
  // ];
  // sendSmtpEmail.attachment = [
  //   {
  //     content: imageBase64, // Contenido en Base64
  //     name: "logo.png", // Nombre del archivo
  //     contentId: "logoImage", // Content-ID para referenciar en el HTML
  //   },
  // ];
  sendSmtpEmail.params = {
    name: name,
    // imageUrl: imageBase64, // Replace with the actual URL of your image
    // html: html,
  };

  // Send the email
  try {
    // const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    const data = await defaultClient.sendTransacEmail(sendSmtpEmail);
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




