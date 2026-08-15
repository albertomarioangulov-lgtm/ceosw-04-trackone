import { z } from 'zod'

export const carrierFormSchema = z.object({
  name: z.string().trim().min(1, 'El nombre es requerido'),
  code: z
    .string()
    .trim()
    .min(2, 'El código debe tener al menos 2 caracteres')
    .regex(/^[a-zA-Z0-9]+$/, 'El código solo puede contener letras y números'),
})

export type CarrierFormData = z.infer<typeof carrierFormSchema>

export type CarrierCreatedBy = {
  _id: string
  name: string
  initials?: string
  color?: string
  avatar?: { icon?: string } | null
}

export type CarrierDTO = {
  id: string
  name: string
  code: string
  createdBy?: CarrierCreatedBy | null
  createdAt?: string
  updatedAt?: string
}
