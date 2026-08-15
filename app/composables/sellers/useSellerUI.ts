// ============================================================
// Composable de UI de Vendedor (diálogo) - patrón estandarizado
// ============================================================
export const useSellerUI = () => {
  const isFormOpen = useState<boolean>('seller-form-open', () => false)
  const selectedSeller = useState<Record<string, any> | null>('seller-selected', () => null)

  const openCreate = () => {
    selectedSeller.value = null
    isFormOpen.value = true
  }

  const openEdit = (seller: Record<string, any>) => {
    selectedSeller.value = seller
    isFormOpen.value = true
  }

  const closeForm = () => {
    isFormOpen.value = false
  }

  return { isFormOpen, selectedSeller, openCreate, openEdit, closeForm }
}
