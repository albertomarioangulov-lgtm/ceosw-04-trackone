// import getUserId from "~~/server/libs/userData"

export default defineEventHandler(async (event) => {
  // Aseguramos que solo un usuario autenticado pueda acceder

  getUserId(event)

  const config = useRuntimeConfig(event)

  // const secret = process.env.NUXT_AUTH_SECRET;
  const secret = config.authSecret

  return {
    secretExists: !!secret,
    secretType: typeof secret,
    secretLength: secret?.length || 0,
    firstChars: secret?.substring(0, 4) || 'N/A'
  }
})
