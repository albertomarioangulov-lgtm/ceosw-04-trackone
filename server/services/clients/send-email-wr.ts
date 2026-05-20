import { BrevoClient } from '@getbrevo/brevo';
// import type { SendSmtpEmail } from '@getbrevo/brevo';
import Package from "~~/server/models/Package"

const config = useRuntimeConfig()

const sendEmailWr = async(savedData:any) => {
  const wr = savedData._id.toString()
  const name = savedData.client.name
  const clientEmails = savedData.client.emails

  const staticRecipients = [
    { email: "info@comprasyenviosonline.com", name: "Info CEO TrackOne" },
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


  const rawPackages = await Package.find({
      wr,
      cr: { $exists: false }
    })
    .populate({ path: 'wr', select: 'wrId client',
      populate: { path: 'client', select: 'name' }
    })
    // .populate({ path: 'cr', select: 'crId' })
    .populate({ path: 'createdBy', select: 'name initials color' })
    // .where( 'wr' ).equals( wr )
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
    let creationDateStr = 'N/A'; // Valor por defecto si no hay fecha
    if (pkg.createdAt) {
      const date = new Date(pkg.createdAt); // Asegurarse de que es un objeto Date
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const hour = date.getHours().toString().padStart(2, '0');
      const mm = date.getMinutes().toString().padStart(2, '0');
      creationDateStr = `${year}-${month}-${day} ${hour}:${mm}`;
    }

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
        <td ${tdStyle}>${creationDateStr}</td>
      </tr>
    `
  });

  const html =
  `<html>
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
  </html>`

  // const defaultClient = new brevo.TransactionalEmailsApi();
  //   defaultClient.setApiKey(
  //   brevo.TransactionalEmailsApiApiKeys.apiKey, config.brevoApiKey
  // );

  const brevo = new BrevoClient({
    apiKey: config.brevoApiKey
  });

  // Prepare the email
  const sendSmtpEmail = {
    subject: `Paquetes de WR: ${savedData.wrId} . ${name}`,
    htmlContent: html,
    sender: { name: "CEO TrackOne", email: "ceoswdev@gmail.com" },
    to: [...staticRecipients, ...clientRecipients],
    replyTo: { email: "ceomiami@comprasyenviosonline.com", name: "CEO TrackOne Miami" },
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

export default sendEmailWr
