import { z } from 'zod'

export const wrPackageSchema = z.object({
  trkgNum: z.string().trim().min(1, 'El tracking es requerido'),
  weight: z.coerce.number().min(0, 'El peso debe ser un número'),
  measures: z
    .object({
      l: z.coerce.number().nullable().optional(),
      w: z.coerce.number().nullable().optional(),
      h: z.coerce.number().nullable().optional(),
    })
    .optional(),
  notes: z.string().optional(),
})

export const wrCreateSchema = z.object({
  _id: z.string().optional(),
  client: z.string().min(1, 'El cliente es requerido'),
  packages: z.array(wrPackageSchema).default([]),
})

export const wrUpdateSchema = z.object({
  client: z.string().min(1).optional(),
  status: z.string().optional(),
})

export type WRPackageData = z.infer<typeof wrPackageSchema>
export type WRCreateData = z.infer<typeof wrCreateSchema>

export type WRDTO = {
  id: string
  wrId?: number
  client?: { _id: string; name?: string; address?: string } | string | null
  status?: string | null
  createdAt?: string
  updatedAt?: string
}
