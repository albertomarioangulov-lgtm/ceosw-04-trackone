// ============================================================
// Plantilla de email con tarjetas de paquetes (estilos inline,
// se ven bien en cualquier cliente; en escritorio 2 columnas)
// ============================================================

const BRAND = {
  primary: '#1F3B73', // azul marino
  accent: '#26ADE4',  // azul claro
  text: '#333333',
  muted: '#6B7280',
  bg: '#F3F6FB',
  card: '#FFFFFF',
  border: '#E5E7EB',
}

type BrevoPackage = {
  label?: number | null
  trkgNum?: string | null
  weight?: number | null
  measures?: { l?: number | null; w?: number | null; h?: number | null }
  notes?: string | null
  createdAt?: string | Date | null
  wr?: any
}

const cardStyle =
  'display:inline-block;width:100%;vertical-align:top;box-sizing:border-box;margin:0 0 10px;border:1px solid #E3EAF3;border-radius:8px;background:#F8FAFD;overflow:hidden;'

/**
 * Tarjetas de paquetes con totales (diseño profesional, responsive).
 */
export function packageCardsHtml(packages: BrevoPackage[]): string {
  const cards: string[] = []
  let totalWeight = 0
  let totalWeightKg = 0
  let totalVolKgs = 0
  let totalCft = 0

  for (const pkg of packages) {
    const l = pkg.measures?.l ?? 0
    const w = pkg.measures?.w ?? 0
    const h = pkg.measures?.h ?? 0
    const measures = l !== 0 || w !== 0 || h !== 0 ? `${l}x${w}x${h}` : '—'
    const weight = pkg.weight ?? 0
    const weightKg = Number((weight * 0.45359237).toFixed(2))
    const cft = Number((l * w * h / 1728).toFixed(2))
    const volKgs = Number((l * w * h / 366).toFixed(2))

    totalWeight += weight
    totalWeightKg += weightKg
    totalCft += cft
    totalVolKgs += volKgs

    const box =
      pkg.wr && typeof pkg.wr === 'object' && 'wrId' in pkg.wr
        ? `${pkg.wr.wrId}-${pkg.label ?? ''}`
        : (pkg.label ?? '')
    const createdAt = pkg.createdAt ? new Date(pkg.createdAt).toLocaleString('es-CO') : 'N/A'
    const notes = pkg.notes ?? ''

    const rows = [
      ['Peso', `${weight} LB (${weightKg.toFixed(2)} Kg)`],
      ['Medidas', measures],
      ['Volumen', `${cft.toFixed(2)} FT / ${volKgs.toFixed(2)} Kgs`],
      ['Fecha', createdAt],
      ...(notes ? [['Notas', notes] as [string, string]] : []),
    ]
      .map(
        ([label, value]) =>
          `<tr><td style="padding:2px 0;color:${BRAND.muted};font-size:13px;width:40%;">${label}</td><td style="padding:2px 0;font-size:13px;color:${BRAND.text};">${value}</td></tr>`,
      )
      .join('')

    cards.push(`
      <div class="ceosw-card" style="${cardStyle}">
        <div style="padding:10px 12px;background:#EAF1FB;border-radius:8px 8px 0 0;font-size:15px;font-weight:bold;color:${BRAND.primary};">
          Caja ${box} <span style="font-weight:normal;color:${BRAND.muted};">· Tracking ${pkg.trkgNum ?? ''}</span>
        </div>
        <div style="padding:10px 12px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
            ${rows}
          </table>
        </div>
      </div>`)
  }

  const totalsCard = `
    <div class="ceosw-card" style="${cardStyle}background:#EFF4FC;border-color:#D3DCE9;">
      <div style="padding:10px 12px;background:#E2EBF8;border-radius:8px 8px 0 0;font-size:15px;font-weight:bold;color:${BRAND.primary};">Totales</div>
      <div style="padding:10px 12px;font-size:13px;color:${BRAND.text};line-height:1.6;">
        ${totalWeight.toFixed(2)} LB (${totalWeightKg.toFixed(2)} Kg) &nbsp;·&nbsp;
        ${totalCft.toFixed(2)} FT / ${totalVolKgs.toFixed(2)} Kgs
      </div>
    </div>`

  return `<div class="ceosw-cards">${cards.join('')}${totalsCard}</div>`
}

/**
 * Shell responsive (logo, título, contenido y pie).
 */
export function emailLayoutResponsive(opts: {
  title: string
  contentHtml: string
  footerNote?: string
  logoUrl?: string
}): string {
  const runConfig = useRuntimeConfig().public
  const logoUrl =
    opts.logoUrl ||
    `${runConfig.appUrl || 'http://localhost:3000'}/images/ceosw-logo.png`

  return `<!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      /* Escritorio: dos columnas de tarjetas. Sin media query, quedan apiladas. */
      @media only screen and (min-width: 601px) {
        .ceosw-card { width: 48% !important; }
        .ceosw-card:nth-child(odd) { margin-right: 2%; }
      }
    </style>
  </head>
  <body style="margin:0;padding:0;background-color:${BRAND.bg};font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND.bg};padding:16px 4px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:720px;background-color:${BRAND.card};border-radius:8px;overflow:hidden;border:1px solid ${BRAND.border};">
            <tr>
              <td style="background-color:#FFFFFF;padding:20px 24px;text-align:center;">
                <img src="${logoUrl}" alt="Compras y Envíos Online" width="180" style="max-width:180px;height:auto;border:0;" />
              </td>
            </tr>
            <tr>
              <td style="background-color:${BRAND.primary};padding:20px 24px;color:#fff;">
                <h1 style="margin:0;font-size:20px;font-weight:bold;">${opts.title}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:24px;color:${BRAND.text};font-size:14px;line-height:1.6;">
                ${opts.contentHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:16px 24px;background-color:#F8FAFC;border-top:1px solid ${BRAND.border};color:${BRAND.muted};font-size:12px;line-height:1.5;">
                <strong style="color:${BRAND.primary};">Compras y Envíos Online</strong><br/>
                7168 NW 50 Street, Miami, FL 33166 &mdash; Tel: 786-970-6581<br/>
                info@comprasyenviosonline.com<br/>
                <span style="font-style:italic;">${opts.footerNote ?? 'Este correo es informativo. No responda a este mensaje.'}</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>`
}
