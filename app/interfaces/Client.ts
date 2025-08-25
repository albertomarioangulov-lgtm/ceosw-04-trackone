
export interface Client {
  _id?: string,
  id?: string,
  name?: string,
  code?: string,
  seller?: string,
  docTyp?: string,
  docNum?: string,
  dateIn?: string,
  zipCode?: string,
  country?: string,
  state?: string,
  city?: string,
  phone?: string,
  address?: string,
  email?: string,
  emails?: string[],
  contacts?: Contact[],
  status?: string,
  color?: string,
}

export interface Contact {
  name?: string | null
  position?: string | null
  phone?: string | null
  email?: string | null
}