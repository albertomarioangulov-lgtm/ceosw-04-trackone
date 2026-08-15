
export interface WRPackage {
  trkgNum?: string | null
  measures?: { l?: number | null; w?: number | null; h?: number | null }
  weight?: number | null
  notes?: string | null
}

export interface WR {
  id?: string
  _id?: string
  wrId?: number
  client?: string | { _id: string; name?: string; address?: string } | null
  status?: string | null
  packages?: WRPackage[]
  packageCount?: number
  availablePackageCount?: number
  createdBy?: { _id: string; name: string; initials?: string; color?: string } | null
  createdAt?: string
  updatedAt?: string
}
