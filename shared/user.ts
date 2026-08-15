import { z } from 'zod'

export const userCreateSchema = z.object({
  name: z.string().trim().min(1, 'El nombre es requerido'),
  username: z.string().trim().min(2, 'El nombre de usuario debe tener al menos 2 caracteres'),
  initials: z.string().trim().min(1, 'Las iniciales son requeridas').max(4, 'Máximo 4 caracteres'),
  email: z.string().trim().email('Correo inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  roles: z.array(z.string()).default([]),
  color: z.string().optional(),
})

export const userUpdateSchema = z.object({
  name: userCreateSchema.shape.name.optional(),
  username: userCreateSchema.shape.username.optional(),
  initials: userCreateSchema.shape.initials.optional(),
  email: userCreateSchema.shape.email.optional(),
  // Vacío en edición = no cambiar la contraseña
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres').optional().or(z.literal('')),
  roles: z.array(z.string()).optional(),
  color: z.string().optional(),
})

export type UserCreateData = z.infer<typeof userCreateSchema>
export type UserUpdateData = z.infer<typeof userUpdateSchema>

export type UserCreatedBy = {
  _id: string
  name: string
  initials?: string
  color?: string
  avatar?: { icon?: string } | null
}

export type UserDTO = {
  id: string
  name: string
  username: string
  initials?: string
  email: string
  color?: string
  roles: string[]
  createdBy?: UserCreatedBy | null
  createdAt?: string
  updatedAt?: string
}
