export interface UserAvatar {
  icon?: string
}

export interface UserCreatedBy {
  _id: string
  name: string
  initials?: string
  color?: string
  avatar?: UserAvatar | null
}

export interface User {
  id?: string
  name?: string
  username?: string
  initials?: string
  password?: string
  confirmPassword?: string
  email?: string
  color?: string
  roles?: string[] // User roles
  createdBy?: UserCreatedBy | null
  createdAt?: string // ISO date
  updatedAt?: string // ISO date
}
