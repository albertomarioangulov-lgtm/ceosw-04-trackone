import { z } from 'zod'

export const crCreateSchema = z.object({
  wr: z.string().min(1, 'El WR es requerido'),
  packages: z.array(z.string()).default([]),
  carrier: z.string().optional(),
})

export const crUpdateSchema = z.object({
  carrier: z.string().optional(),
})

export type CRCreateData = z.infer<typeof crCreateSchema>

export type CRDTO = {
  id: string
  crId?: number
  carrier?: string | null
  wr?:
    | {
        _id: string
        wrId?: number
        client?: { _id: string; name?: string; address?: string } | string | null
      }
    | string
    | null
  packageCount?: number
  createdBy?: { _id: string; name: string; initials?: string; color?: string } | null
  createdAt?: string
  updatedAt?: string
}
