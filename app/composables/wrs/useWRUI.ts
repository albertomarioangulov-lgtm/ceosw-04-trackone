// ============================================================
// Composable de UI de WR (diálogo) - patrón estandarizado
// ============================================================
export const useWRUI = () => {
  const isFormOpen = useState<boolean>('wr-form-open', () => false)
  const selectedWR = useState<Record<string, any> | null>('wr-selected', () => null)
  const mode = useState<'create' | 'addPackages'>('wr-form-mode', () => 'create')

  const openCreate = (clientId?: string) => {
    mode.value = 'create'
    selectedWR.value = clientId ? { client: clientId } : null
    isFormOpen.value = true
  }

  const openAddPackages = (wr: Record<string, any>, client?: Record<string, any>) => {
    mode.value = 'addPackages'
    selectedWR.value = client ? { ...wr, client } : wr
    isFormOpen.value = true
  }

  const closeForm = () => {
    isFormOpen.value = false
  }

  return { isFormOpen, selectedWR, mode, openCreate, openAddPackages, closeForm }
}
