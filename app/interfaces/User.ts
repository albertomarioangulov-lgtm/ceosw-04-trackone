export interface UserAvatar {
  icon?: string
}

export interface User {
  _id?: string
  name?: string
  username?: string
  initials?: string
  password?: string
  confirmPassword?: string
  phone?: string
  email?: string
  emails?: string[]
  avatar?: UserAvatar
  color?: string
  roles?: string[] // User roles
  isActive?: boolean // User status
  createdAt?: string // ISO date
  updatedAt?: string // ISO date
  createdBy?: string // User ID of creator
}