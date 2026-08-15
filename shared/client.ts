import { z } from 'zod'

export const clientFormSchema = z.object({
  name: z.string().trim().min(1, 'El nombre es requerido'),
  seller: z.string().min(1, 'El vendedor es requerido'),
  dateIn: z.string().nullable().optional(),
  docTyp: z.string().optional(),
  docNum: z.string().optional(),
  country: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  phone: z.array(z.string()).default([]),
  address: z.string().optional(),
  email: z.string().trim().email('Correo inválido').optional().or(z.literal('')),
  emails: z
    .array(
      z.object({
        email: z.string().trim().email('Correo inválido').optional().or(z.literal('')),
      }),
    )
    .default([]),
  contacts: z
    .array(
      z.object({
        name: z.string().optional(),
        position: z.string().optional(),
        phone: z.string().optional(),
        email: z.string().optional(),
      }),
    )
    .default([]),
})

export const clientUpdateSchema = z.object({
  name: clientFormSchema.shape.name.optional(),
  seller: clientFormSchema.shape.seller.optional(),
  dateIn: clientFormSchema.shape.dateIn.optional(),
  docTyp: clientFormSchema.shape.docTyp.optional(),
  docNum: clientFormSchema.shape.docNum.optional(),
  country: clientFormSchema.shape.country.optional(),
  state: clientFormSchema.shape.state.optional(),
  city: clientFormSchema.shape.city.optional(),
  phone: z.array(z.string()).optional(),
  address: clientFormSchema.shape.address.optional(),
  email: clientFormSchema.shape.email.optional(),
  emails: z
    .array(
      z.object({
        email: z.string().trim().email('Correo inválido').optional().or(z.literal('')),
      }),
    )
    .optional(),
  contacts: z
    .array(
      z.object({
        name: z.string().optional(),
        position: z.string().optional(),
        phone: z.string().optional(),
        email: z.string().optional(),
      }),
    )
    .optional(),
})

export type ClientFormData = z.infer<typeof clientFormSchema>

export type ClientSeller = {
  _id: string
  name: string
  code?: string
}

export type ClientDTO = {
  id: string
  name: string
  seller?: ClientSeller | string | null
  phone?: string[]
  email?: string
  emails?: Array<{ email?: string }>
  country?: string
  state?: string
  city?: string
  address?: string
  dateIn?: string
  docTyp?: string
  docNum?: string
  createdBy?: { _id: string; name: string; initials?: string; color?: string; avatar?: { icon?: string } | null } | null
  createdAt?: string
  updatedAt?: string
}
