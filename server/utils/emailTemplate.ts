// ============================================================
// Plantillas de email profesionales (inline CSS para Gmail/Outlook)
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

/**
 * Tabla de paquetes con totales (usada por los correos de WR y CR).
 */
export function packageTableHtml(packages: BrevoPackage[]): string {
  const cell = (value: any, opts: { bold?: boolean; colspan?: number } = {}) => {
    const style = `font-family:Arial,sans-serif;font-size:12px;padding:8px 6px;border:1px solid ${BRAND.border};color:${BRAND.text};text-align:center;${opts.bold ? 'font-weight:bold;background-color:#F0F4FA;' : ''}`
    const colspan = opts.colspan ? ` colspan="${opts.colspan}"` : ''
    return `<td${colspan} style="${style}">${value ?? ''}</td>`
  }

  const th = (label: string) =>
    `<th style="font-family:Arial,sans-serif;font-size:12px;font-weight:bold;padding:10px 6px;color:#fff;background-color:${BRAND.primary};text-align:center;border:1px solid ${BRAND.primary};">${label}</th>`

  let rows = ''
  let totalWeight = 0
  let totalWeightKg = 0
  let totalVolKgs = 0
  let totalCft = 0

  for (const pkg of packages) {
    const l = pkg.measures?.l ?? 0
    const w = pkg.measures?.w ?? 0
    const h = pkg.measures?.h ?? 0
    const measures = l !== 0 || w !== 0 || h !== 0 ? `${l}x${w}x${h}` : ''
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

    rows += `<tr>${cell(box)}${cell(pkg.trkgNum ?? '')}${cell(weight)}${cell(weightKg.toFixed(2))}${cell(measures)}${cell(cft.toFixed(2))}${cell(volKgs.toFixed(2))}${cell(pkg.notes ?? '')}${cell(createdAt)}</tr>`
  }

  const totals = `<tr>
    ${cell('TOTALES', { bold: true, colspan: 2 })}
    ${cell(totalWeight.toFixed(2), { bold: true })}
    ${cell(totalWeightKg.toFixed(2), { bold: true })}
    ${cell('')}
    ${cell(totalCft.toFixed(2), { bold: true })}
    ${cell(totalVolKgs.toFixed(2), { bold: true })}
    ${cell('')}
  </tr>`

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:12px 0;">
      <tr>
        ${th('Caja')}
        ${th('Tracking')}
        ${th('Peso<br/>(LB)')}
        ${th('Peso<br/>(Kg)')}
        ${th('Medidas<br/>(Pulg)')}
        ${th('Vol<br/>(FT)')}
        ${th('Vol<br/>(Kgs)')}
        ${th('Notas')}
        ${th('Fecha')}
      </tr>
      ${rows}
      ${totals}
    </table>`
}

/**
 * Shell profesional para todos los correos (header, contenido, footer).
 */
export function emailLayout(opts: {
  title: string
  contentHtml: string
  footerNote?: string
  logoUrl?: string
}): string {
  const runConfig = useRuntimeConfig().public
  const logoUrl =
    opts.logoUrl ||
    `${runConfig.appUrl || 'http://localhost:3000'}/images/ceosw-logo.png`

  return `
  <!DOCTYPE html>
  <html lang="es">
  <body style="margin:0;padding:0;background-color:${BRAND.bg};font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND.bg};padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;background-color:${BRAND.card};border-radius:8px;overflow:hidden;border:1px solid ${BRAND.border};">
            <tr>
              <td style="background-color:#FFFFFF;padding:20px 24px;text-align:center;">
                <img
                  src="${logoUrl}"
                  alt="Compras y Envíos Online"
                  width="180"
                  style="max-width:180px;height:auto;border:0;"
                />
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
