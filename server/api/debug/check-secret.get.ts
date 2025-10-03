// import getUserId from "~~/server/libs/userData"

export default defineEventHandler(async (event) => {
  // Para esta prueba, comentamos la autenticación para que el endpoint sea 100% público
  // y así verificar que el error 403 ha desaparecido.
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
