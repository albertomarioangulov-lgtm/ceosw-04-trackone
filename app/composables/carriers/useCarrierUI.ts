// ============================================================
// Composable de UI de Carrier (diálogo) - patrón casaroca
// ============================================================
export const useCarrierUI = () => {
  const isFormOpen = useState<boolean>('carrier-form-open', () => false)
  const selectedCarrier = useState<Record<string, any> | null>('carrier-selected', () => null)

  const openCreate = () => {
    selectedCarrier.value = null
    isFormOpen.value = true
  }

  const openEdit = (carrier: Record<string, any>) => {
    selectedCarrier.value = carrier
    isFormOpen.value = true
  }

  const closeForm = () => {
    isFormOpen.value = false
  }

  return { isFormOpen, selectedCarrier, openCreate, openEdit, closeForm }
}
