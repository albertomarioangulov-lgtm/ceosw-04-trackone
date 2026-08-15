export interface Carrier {
  id?: string
  name?: string
  code?: string
  createdBy?: {
    _id: string
    name: string
    initials?: string
    color?: string
    avatar?: { icon?: string } | null
  } | null
  createdAt?: string
  updatedAt?: string
}
