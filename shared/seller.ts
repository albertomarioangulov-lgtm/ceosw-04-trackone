import { z } from 'zod'

export const sellerFormSchema = z.object({
  name: z.string().trim().min(1, 'El nombre es requerido'),
  code: z
    .string()
    .trim()
    .min(2, 'El código debe tener al menos 2 caracteres')
    .regex(/^[a-zA-Z0-9]+$/, 'El código solo puede contener letras y números'),
  seller_code: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().trim().email('Correo inválido').optional().or(z.literal('')),
  emails: z.array(z.string()).default([]),
  address: z.string().optional(),
  fee: z.string().min(1, 'La comisión es requerida'),
  country: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
})

export const sellerUpdateSchema = z.object({
  name: sellerFormSchema.shape.name.optional(),
  code: sellerFormSchema.shape.code.optional(),
  seller_code: sellerFormSchema.shape.seller_code.optional(),
  phone: sellerFormSchema.shape.phone.optional(),
  email: sellerFormSchema.shape.email.optional(),
  emails: z.array(z.string()).optional(),
  address: sellerFormSchema.shape.address.optional(),
  fee: sellerFormSchema.shape.fee.optional(),
  country: sellerFormSchema.shape.country.optional(),
  state: sellerFormSchema.shape.state.optional(),
  city: sellerFormSchema.shape.city.optional(),
})

export type SellerFormData = z.infer<typeof sellerFormSchema>

export type SellerDTO = {
  id: string
  name: string
  code: string
  seller_code?: string
  phone?: string
  email?: string
  emails?: string[]
  address?: string
  fee?: string
  country?: string
  state?: string
  city?: string
  createdBy?: { _id: string; name: string; initials?: string; color?: string; avatar?: { icon?: string } | null } | null
  createdAt?: string
  updatedAt?: string
}
