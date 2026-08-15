export interface CR {
  id?: string
  _id?: string
  crId?: number
  carrier?: string | null
  wr?: string | { _id: string; wrId?: number; client?: { _id: string; name?: string; address?: string } | string | null } | null
  packageCount?: number
  packages?: Array<Record<string, any>>
  createdBy?: { _id: string; name: string; initials?: string; color?: string } | null
  createdAt?: string
  updatedAt?: string
}
