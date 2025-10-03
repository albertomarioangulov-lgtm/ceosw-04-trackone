// import getUserId from "~~/server/libs/userData"

export default defineEventHandler(async (event) => {
  // Aseguramos que solo un usuario autenticado pueda acceder a este endpoint
  // getUserId(event)

  // Usamos process.env para que la verificación sea idéntica a la lógica de wsAuth.ts
  const secret = process.env.NUXT_AUTH_SECRET;

  return {
    description: "Verificación de la variable de entorno NUXT_AUTH_SECRET en producción.",
    secretExists: !!secret,
    secretType: typeof secret,
    secretLength: secret?.length || 0,
    firstChars: secret?.substring(0, 4) || 'N/A'
  }
})
