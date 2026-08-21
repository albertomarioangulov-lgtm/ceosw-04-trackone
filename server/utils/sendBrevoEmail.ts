// ============================================================
// Envío de emails transaccionales con la API de Brevo (v3)
// (reemplaza al paquete @getbrevo/brevo)
// ============================================================

export type BrevoRecipient = {
  email: string
  name?: string
}

export type BrevoEmailPayload = {
  subject: string
  htmlContent: string
  sender: { name: string; email: string }
  to: BrevoRecipient[]
  replyTo?: BrevoRecipient
  params?: Record<string, any>
}

export async function sendBrevoEmail(payload: BrevoEmailPayload) {
  const config = useRuntimeConfig()

  return await $fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': config.brevoApiKey as string,
      'content-type': 'application/json',
      accept: 'application/json',
    },
    body: payload,
  })
}
