import { useDate } from 'vuetify'

export const formatISODate = (date: any) => {
  const adapter = useDate()
  return adapter.toISO(date)
}