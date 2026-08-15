// ============================================================
// Composable de Formulario de Carrier - patrón casaroca
// ============================================================
import { ref } from 'vue'
import { carrierFormSchema } from '~~/shared/carrier'

export const useCarrierForm = () => {
  const saving = ref(false)
  const submitError = ref('')
  const fieldErrors = ref<Record<string, string | undefined>>({})

  const { handleApiError } = useApiError()

  const fieldSchemas = carrierFormSchema.shape

  const validateField = (field: keyof typeof fieldSchemas, value: any) => {
    const schema = fieldSchemas[field]
    const result = schema.safeParse(value)

    if (!result.success) {
      fieldErrors.value[field] = result.error.issues[0]?.message
      return false
    }

    fieldErrors.value[field] = undefined
    return true
  }

  const validateForm = (formData: any) => {
    fieldErrors.value = {}
    const result = carrierFormSchema.safeParse(formData)

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors as Record<string, string[] | undefined>
      Object.keys(errors).forEach((field) => {
        fieldErrors.value[field] = errors[field]?.[0]
      })
      return false
    }

    return true
  }

  const saveCarrier = async (formData: Record<string, any>, carrierId?: string) => {
    submitError.value = ''

    if (!validateForm(formData)) {
      return false
    }

    saving.value = true

    try {
      const isEditing = !!carrierId
      const url = isEditing ? `/api/carriers/${carrierId}` : '/api/carriers'

      await $fetch(url, { method: isEditing ? 'PUT' : 'POST', body: formData })
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
    saveCarrier,
    validateForm,
    validateField,
  }
}
