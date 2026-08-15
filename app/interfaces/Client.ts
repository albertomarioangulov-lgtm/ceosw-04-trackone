
export interface Client {
  _id?: string,
  id?: string,
  name?: string,
  code?: string,
  seller?: string | { _id: string; name: string; code?: string } | null,
  docTyp?: string,
  docNum?: string,
  dateIn?: string,
  zipCode?: string,
  country?: string,
  state?: string,
  city?: string,
  phone?: string[],
  address?: string,
  email?: string,
  emails?: Array<{ email?: string }>,
  contacts?: Contact[],
  status?: string,
  color?: string,
  createdBy?: { _id: string; name: string; initials?: string; color?: string; avatar?: { icon?: string } | null } | null,
  createdAt?: string,
  updatedAt?: string,
}

export interface Contact {
  name?: string | null
  position?: string | null
  phone?: string | null
  email?: string | null
}
