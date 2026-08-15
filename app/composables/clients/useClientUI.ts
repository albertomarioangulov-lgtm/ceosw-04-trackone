// ============================================================
// Composable de UI de Cliente (diálogo) - patrón estandarizado
// ============================================================
export const useClientUI = () => {
  const isFormOpen = useState<boolean>('client-form-open', () => false)
  const selectedClient = useState<Record<string, any> | null>('client-selected', () => null)

  const openCreate = () => {
    selectedClient.value = null
    isFormOpen.value = true
  }

  const openEdit = (client: Record<string, any>) => {
    selectedClient.value = client
    isFormOpen.value = true
  }

  const closeForm = () => {
    isFormOpen.value = false
  }

  return { isFormOpen, selectedClient, openCreate, openEdit, closeForm }
}
