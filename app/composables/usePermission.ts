export function usePermission() {
  const { data } = useAuth()
  const userPermissions = computed(() => (data.value as any)?.userData?.permissions || [])

  const hasPermission = (required?: string | string[]) => {
    if (!required) return true
    if (Array.isArray(required)) {
      // Devuelve true si el usuario tiene al menos uno de los permisos requeridos
      return required.some(p => userPermissions.value.includes(p))
    }
    // Si es string, verifica normalmente
    return userPermissions.value.includes(required)
  }

  return { userPermissions, hasPermission }
}