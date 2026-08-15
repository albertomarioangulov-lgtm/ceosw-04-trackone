// ============================================================
// Tipado de sesión para nuxt-auth-utils
// ============================================================
declare module '#auth-utils' {
  interface User {
    id: string
    email: string
    name?: string
    initials?: string
    color?: string
    avatar?: { icon?: string } | null
    roles: string[]
    permissions: string[]
    // Token JWT de corto plazo usado únicamente por el WebSocket
    // mientras se migra la autenticación de tiempo real (Fase 5).
    wsToken?: string
  }

  interface UserSession {
    loggedInAt: Date
  }
}

export {}
