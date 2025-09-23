import { SendSmtpEmail, TransactionalEmailsApi, TransactionalEmailsApiApiKeys } from '@getbrevo/brevo';
import Package from "~~/server/models/Package"
// import type { Package as PackageType } from '~~/app/interfaces/Package';

const config = useRuntimeConfig()

// const wr = '6894e69e6bdb70de608e6b65'

const sendEmailCr = async(savedData:any) => {
  const cr = savedData._id.toString()
  const name = savedData.client.name
  const clientEmails = savedData.client.emails
  // const companion = savedData.companion
  // const phone = savedData.phone
  // const email = savedData.email
  // const email = "almaanvi@gmail.com"

  // console.log('savedData: ', savedData)

  const staticRecipients = [
    { email: "info@comprasyenviosonline.com", name: "Info CEO TrackOne" },
    { email: "ceomiami@comprasyenviosonline.com", name: "CEO TrackOne Miami" },
    { email: "ceoswdev@gmail.com", name: "CEO TrackOne" }
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


  const thStyle = `style="
    font-family:Arial, sans-serif;
    font-size:14px;
    font-weight:normal;
    padding:10px 5px;
    border-style:solid;
    border-width:0px;
    overflow:hidden;
    word-break:normal;
    border-color:inherit;
    color:#fff;
    background-color:#26ADE4;
    vertical-align:middle;
  "`

  const tdStyle = `style=\"
    font-family:Arial, sans-serif;
    font-size:14px;
    padding:10px 5px;
    border-style:solid;
    border-width:1px;
    overflow:hidden;
    word-break:normal;
    border-color:inherit;
    color:#444;
    background-color:#F7FDFA;
    text-align:center;
    vertical-align:middle;
  \"`
  const tdStyle2 = `style=\"
    font-family:Arial, sans-serif;
    font-size:14px;
    padding:10px 5px;
    border-style:solid;
    border-width:0px;
    overflow:hidden;
    word-break:normal;
    border-color:inherit;
    color:#444;
    background-color:#F7FDFA;
    text-align:center;
    vertical-align:middle;
  \"`

  let newPackages = ''
  let totalWeight = 0
  let totalWeightKg = 0
  let totalVolKgs = 0
  let totalCft = 0

  rawPackages.forEach(pkg => {
    const year = pkg.createdAt.getFullYear()
    const month = pkg.createdAt.getMonth() + 1
    const day = pkg.createdAt.getDate()
    const hour = pkg.createdAt.getHours()
    const mm = pkg.createdAt.getMinutes()

    const l = pkg.measures?.l ?? 0;
    const w = pkg.measures?.w ?? 0;
    const h = pkg.measures?.h ?? 0;

    const measures = (l !== 0 || w !== 0 || h !== 0)
      ? `${l}x${w}x${h}`
      : '';

    const weight = pkg.weight ?? 0
    const weightKg = (weight * 0.45359237).toFixed(2)
    totalWeight += Number.parseFloat(weight.toString())
    totalWeightKg += Number.parseFloat(weightKg)

    const volKgs = (l * w * h / 366).toFixed(2);
    totalVolKgs += Number.parseFloat(volKgs);
    
    const cft = (l * w * h / 1728).toFixed(2);
    totalCft += Number.parseFloat(cft);

    newPackages += `
      <tr>
        <td ${tdStyle}>${
          typeof pkg.wr === 'object' && pkg.wr !== null && 'wrId' in pkg.wr
            ? pkg.wr.wrId + '-' + pkg.label
            : pkg.label ?? ''
        }</td>
        <td ${tdStyle}>${pkg.trkgNum}</td>
        <td ${tdStyle}>${pkg.weight}</td>
        <td ${tdStyle}>${weightKg}</td>
        <td ${tdStyle}>${measures}</td>
        <td ${tdStyle}>${cft}</td>
        <td ${tdStyle}>${volKgs}</td>
        <td ${tdStyle}>${pkg.notes}</td>
        <td ${tdStyle}>${year}-${month}-${day} ${hour}:${mm}</td>
      </tr>
    `
  });

  // ${ packages.map(pkg => `
  //       <div style="margin-top: 20px; padding: 10px; border: 1px solid #ccc;">
  //         <h3>Paquete: ${ pkg.trkgNum }</h3>
          
  //       </div>
  //     `).join('')}

      
  const html = `
  <html>
    <body>
      <h1 style='color:#3498db;'>CEO CARGO</h1>
      <h2>Hola {{params.name}}</h2>
      <p style='color:#444;'>Estimado Cliente: los siguientes, son los numeros de rastreo que corresponden a los paquetes recibidos en nuestra bodega</p>

      <table style=\"border:1px solid;border-collapse:collapse;border-spacing:0;border-color:#428bca\">
        <tr>
          <th ${thStyle}>Caja</th>
          <th ${thStyle}>Tracking Number</th>
          <th ${thStyle}>Peso<br>(LB)</th>
          <th ${thStyle}>Peso<br>(Kg)</th>
          <th ${thStyle}>Medidas<br>(Pulgadas)</th>
          <th ${thStyle}>Vol<br>(FT)</th>
          <th ${thStyle}>Vol<br>(Kgs)</th>
          <th ${thStyle}>Notas</th>
          <th ${thStyle}>Fecha Recibido</th>
        </tr>
        ${ newPackages }

        <tr>
          <th ${tdStyle} colspan="2">TOTALES</td>
          <th ${tdStyle}>${totalWeight}</td>
          <th ${tdStyle}>${totalWeightKg.toFixed(2)}</td>
          <th ${tdStyle}></td>
          <th ${tdStyle}>${totalCft.toFixed(2)}</td>
          <th ${tdStyle}>${totalVolKgs.toFixed(2)}</td>
          <th ${tdStyle} colspan="2"></td>
        </tr>

      </table>


      <p style='color:#444;'>Cualquier inquietud, puede escribirnos a info@comprasyenviosonline.com <br> Cordialmente, ComprasyEnviosOnline.com </p>
      <p>Fecha y Hora: ${formattedDate}</p>
    </body>
  </html>
  `

  const defaultClient = new TransactionalEmailsApi();
    defaultClient.setApiKey(
    TransactionalEmailsApiApiKeys.apiKey, config.brevoApiKey
  );


  // Prepare the email
  // const sendSmtpEmail = new brevo.SendSmtpEmail();
  const sendSmtpEmail = new SendSmtpEmail();
  sendSmtpEmail.subject = `Paquetes de WR: ${savedData.wrId} . ${name}`;
  sendSmtpEmail.htmlContent = html;
  // sendSmtpEmail.templateId = 2; // ID de la plantilla
  sendSmtpEmail.sender = { name: "CEOSW TrackOne", email: "ceoswdev@gmail.com" };
  sendSmtpEmail.to = [...staticRecipients, ...clientRecipients];
  sendSmtpEmail.replyTo = { email: "ceomiami@comprasyenviosonline.com", name: "CEO TrackOne Miami" }

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

export default sendEmailCr
