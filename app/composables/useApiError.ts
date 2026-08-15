// ============================================================
// Manejo de errores de API (cliente)
// ============================================================
export const useApiError = () => {
  const { fetch, loggedIn } = useUserSession()

  const handleApiError = async (error: any): Promise<string> => {
    if (error?.statusCode === 401) {
      // Intenta refrescar la sesión; si sigue sin sesión, redirige al login.
      await fetch()
      if (!loggedIn.value) {
        await navigateTo('/login?message=Sesión expirada')
      }
      return 'Tu sesión expiró. Vuelve a iniciar sesión.'
    }

    return error?.data?.statusMessage || error?.statusMessage || 'Error inesperado'
  }

  return { handleApiError }
}
