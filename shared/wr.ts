import { z } from 'zod'

// Ciclo de vida del WR:
// pending   -> creado sin paquetes
// opened    -> tiene paquetes y acepta más
// finalized -> sin paquetes disponibles (todos despachados en CRs)
export const WR_STATUS = {
  PENDING: 'pending',
  OPENED: 'opened',
  FINALIZED: 'finalized',
} as const

export type WRStatus = (typeof WR_STATUS)[keyof typeof WR_STATUS]

export const OPEN_WR_STATUSES: WRStatus[] = [WR_STATUS.PENDING, WR_STATUS.OPENED]

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
  status: z.enum([WR_STATUS.PENDING, WR_STATUS.OPENED, WR_STATUS.FINALIZED]).optional(),
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
