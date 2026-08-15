// ============================================================
// Composable de Formulario de Vendedor - patrón estandarizado
// ============================================================
import { ref } from 'vue'
import { sellerFormSchema, sellerUpdateSchema } from '~~/shared/seller'

export const useSellerForm = () => {
  const saving = ref(false)
  const submitError = ref('')
  const fieldErrors = ref<Record<string, string | undefined>>({})

  const { handleApiError } = useApiError()

  const toPhoneString = (value: any): string | undefined => {
    if (typeof value === 'string') return value || undefined
    if (Array.isArray(value)) {
      const phones = value.filter((p: any) => typeof p === 'string')
      return phones.join(', ') || undefined
    }
    return undefined
  }

  const buildPayload = (formData: Record<string, any>) => ({
    name: formData.name,
    code: formData.code,
    phone: toPhoneString(formData.phone),
    email: typeof formData.email === 'string' ? formData.email || undefined : undefined,
    emails: (formData.emails ?? []).filter((e: any) => typeof e === 'string' && e.trim()),
    address: formData.address || undefined,
    fee: formData.fee != null ? String(formData.fee) : undefined,
    country: formData.country || undefined,
    state: formData.state || undefined,
    city: formData.city || undefined,
  })

  const validateForm = (payload: any, isEditing: boolean) => {
    fieldErrors.value = {}
    const schema = isEditing ? sellerUpdateSchema : sellerFormSchema
    const result = schema.safeParse(payload)

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors as Record<string, string[] | undefined>
      Object.keys(errors).forEach((field) => {
        fieldErrors.value[field] = errors[field]?.[0]
      })
      return false
    }

    return true
  }

  const saveSeller = async (formData: Record<string, any>, sellerId?: string) => {
    submitError.value = ''
    const isEditing = !!sellerId
    const payload = buildPayload(formData)

    if (!validateForm(payload, isEditing)) {
      return false
    }

    saving.value = true

    try {
      const url = isEditing ? `/api/sellers/${sellerId}` : '/api/sellers'
      await $fetch(url, { method: isEditing ? 'PUT' : 'POST', body: payload })
      return true
    } catch (err: any) {
      submitError.value = await handleApiError(err)
      return false
    } finally {
      saving.value = false
    }
  }

  return {
    saving,
    submitError,
    fieldErrors,
    saveSeller,
    validateForm,
  }
}
