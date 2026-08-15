// ============================================================
// Permisos (Client-side) - patrón casaroca-01
// ============================================================
import {
  getPermissionsForRoles,
  PERMISSIONS,
  ROLE_DEFINITIONS,
  AVAILABLE_ROLES,
  type Permission,
} from '~~/shared/permissions'

export const usePermissions = () => {
  const { user } = useUserSession()

  const roles = computed(() => user.value?.roles ?? [])
  const legacyPermissions = computed(() => user.value?.permissions ?? [])

  /**
   * Permisos efectivos: derivados de roles + permisos legacy
   * (durante la migración, para no perder acceso).
   */
  const userPermissions = computed<Permission[]>(() => {
    const derived = getPermissionsForRoles(roles.value)
    return Array.from(new Set([...derived, ...legacyPermissions.value])) as Permission[]
  })

  const can = (permission: Permission): boolean => {
    return userPermissions.value.includes(permission)
  }

  const canAll = (...permissions: Permission[]): boolean => {
    return permissions.every((p) => can(p))
  }

  const canAny = (...permissions: Permission[]): boolean => {
    return permissions.some((p) => can(p))
  }

  /**
   * Compatibilidad con el helper anterior: acepta string, string[] o undefined
   * (undefined = visible para todos).
   */
  const hasPermission = (required?: string | string[]): boolean => {
    if (!required) return true
    if (Array.isArray(required)) {
      return required.some((p) => userPermissions.value.includes(p))
    }
    return userPermissions.value.includes(required)
  }

  const hasRole = (role: string): boolean => {
    return roles.value.includes(role)
  }

  return {
    roles,
    can,
    canAll,
    canAny,
    hasPermission,
    hasRole,
    userPermissions,
    isAdmin: computed(() => hasRole('admin')),
    PERMISSIONS,
    ROLE_DEFINITIONS,
    AVAILABLE_ROLES,
  }
}
