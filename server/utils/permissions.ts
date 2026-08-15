// ============================================================
// Utilidades de Permisos (Server-side)
// ============================================================
import { getPermissionsForRoles, type Permission } from '~~/shared/permissions'
import { getUserFromSession } from './getUserFromSession'
import type { H3Event } from 'h3'

/**
 * Permisos efectivos del usuario: unión de los permisos legacy guardados
 * en el documento (User.permissions) y los derivados de sus roles.
 * Así ningún usuario pierde acceso durante la migración a roles.
 */
async function getUserPermissions(event: H3Event): Promise<string[]> {
  const user = await getUserFromSession(event)
  const legacy = user.permissions ?? []
  const roleNames = (user.roles ?? []).map((role: any) => role.name ?? String(role))
  const derived = getPermissionsForRoles(roleNames)

  return Array.from(new Set([...legacy, ...derived]))
}

/**
 * Verifica que el usuario tenga el permiso (o al menos uno de los permisos
 * si se pasa un array). Lanza 403 si no lo tiene.
 */
export async function requirePermission(event: H3Event, required: Permission | Permission[]): Promise<void> {
  const permissions = await getUserPermissions(event)
  const allowed = Array.isArray(required)
    ? required.some((p) => permissions.includes(p))
    : permissions.includes(required)

  if (!allowed) {
    throw createError({
      statusCode: 403,
      statusMessage: `No tienes permiso para realizar esta acción. Permiso requerido: ${Array.isArray(required) ? required.join(' o ') : required}`,
    })
  }
}

/**
 * Verifica el permiso y retorna true/false sin lanzar error.
 */
export async function checkPermission(event: H3Event, permission: Permission): Promise<boolean> {
  try {
    await requirePermission(event, permission)
    return true
  } catch {
    return false
  }
}

/**
 * Helper para proteger un endpoint declarando el permiso requerido.
 * Uso: `defineEventHandler(requirePermissionMiddleware(PERMISSIONS.CLIENTS_MANAGE))`
 */
export function requirePermissionMiddleware(permission: Permission | Permission[]) {
  return async (event: H3Event) => {
    await requirePermission(event, permission)
  }
}
