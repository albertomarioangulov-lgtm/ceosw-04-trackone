// ============================================================
// Permisos y roles - fuente única para server y cliente
// ============================================================

/**
 * Permisos disponibles. Se conservan los strings históricos
 * (manage_clients, view_clients, ...) para no cambiar la lógica.
 */
export const PERMISSIONS = {
  CLIENTS_MANAGE: 'manage_clients',
  CLIENTS_VIEW: 'view_clients',
  CARRIERS_MANAGE: 'manage_carriers',
  CARRIERS_VIEW: 'view_carriers',
  CRS_MANAGE: 'manage_crs',
  CRS_VIEW: 'view_crs',
  WRS_MANAGE: 'manage_wrs',
  WRS_VIEW: 'view_wrs',
  SELLERS_MANAGE: 'manage_sellers',
  SELLERS_VIEW: 'view_sellers',
  PACKAGES_MANAGE: 'manage_packages',
  PACKAGES_VIEW: 'view_packages',
  USERS_MANAGE: 'manage_users',
} as const

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS]

export type RoleDefinition = {
  label: string
  description: string
  permissions: Permission[]
}

const VIEW_PERMISSIONS: Permission[] = [
  PERMISSIONS.CLIENTS_VIEW,
  PERMISSIONS.CARRIERS_VIEW,
  PERMISSIONS.CRS_VIEW,
  PERMISSIONS.WRS_VIEW,
  PERMISSIONS.SELLERS_VIEW,
  PERMISSIONS.PACKAGES_VIEW,
]

const MANAGE_PERMISSIONS: Permission[] = [
  PERMISSIONS.CLIENTS_MANAGE,
  PERMISSIONS.CARRIERS_MANAGE,
  PERMISSIONS.CRS_MANAGE,
  PERMISSIONS.WRS_MANAGE,
  PERMISSIONS.SELLERS_MANAGE,
  PERMISSIONS.PACKAGES_MANAGE,
]

/**
 * Definición de roles. Ajusta aquí la matriz de permisos según el negocio.
 */
export const ROLE_DEFINITIONS: Record<string, RoleDefinition> = {
  admin: {
    label: 'Administrador',
    description: 'Acceso total a todas las funcionalidades del sistema',
    permissions: Object.values(PERMISSIONS),
  },
  moderator: {
    label: 'Moderador',
    description: 'Puede ver y gestionar todos los recursos excepto usuarios',
    permissions: [...VIEW_PERMISSIONS, ...MANAGE_PERMISSIONS],
  },
  nutritionist: {
    label: 'Nutricionista',
    description: 'Solo lectura de todos los recursos',
    permissions: [...VIEW_PERMISSIONS],
  },
  user: {
    label: 'Usuario',
    description: 'Solo lectura de todos los recursos',
    permissions: [...VIEW_PERMISSIONS],
  },
}

/**
 * Obtiene todos los permisos asociados a un conjunto de roles.
 */
export function getPermissionsForRoles(roles: string[]): Permission[] {
  const permissions = new Set<Permission>()

  for (const role of roles) {
    const definition = ROLE_DEFINITIONS[role]
    if (definition) {
      for (const perm of definition.permissions) {
        permissions.add(perm)
      }
    }
  }

  return Array.from(permissions)
}

/**
 * Verifica si un conjunto de roles tiene un permiso específico.
 */
export function hasPermission(roles: string[], permission: Permission): boolean {
  return getPermissionsForRoles(roles).includes(permission)
}

/**
 * Lista de roles disponibles (las claves del objeto ROLE_DEFINITIONS).
 */
export const AVAILABLE_ROLES = Object.keys(ROLE_DEFINITIONS)
