// ============================================================
// Autenticación por sesiones (patrón casaroca-01)
// ============================================================
export const useAuthentication = () => {
  const { fetch, user, loggedIn, clear, session } = useUserSession()

  const login = async (email: string, password: string) => {
    try {
      await $fetch('/api/auth/login', {
        method: 'POST',
        body: { email, password },
      })

      await fetch()
      await navigateTo('/')

      return true
    } catch (error: any) {
      return false
    }
  }

  const logout = async () => {
    try {
      await $fetch('/api/auth/logout', { method: 'POST' })
    } catch (error) {
      console.error('Logout error:', error)
    }
    await clear()
    await navigateTo('/login')
  }

  return {
    loggedIn,
    session,
    user,

    isLoggedIn: loggedIn,
    isAdmin: computed(() => user.value?.roles?.includes('admin') ?? false),

    fetch,
    login,
    logout,
  }
}
