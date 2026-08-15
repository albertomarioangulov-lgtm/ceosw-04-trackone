// ============================================================
// Composable de Formulario de Cliente - patrón estandarizado
// ============================================================
import { ref } from 'vue'
import { clientFormSchema, clientUpdateSchema } from '~~/shared/client'

export const useClientForm = () => {
  const saving = ref(false)
  const submitError = ref('')
  const fieldErrors = ref<Record<string, string | undefined>>({})

  const { handleApiError } = useApiError()

  const buildPayload = (formData: Record<string, any>) => ({
    name: formData.name,
    seller: formData.seller,
    dateIn: formData.dateIn || undefined,
    docTyp: formData.docTyp || undefined,
    docNum: formData.docNum || undefined,
    country: formData.country || undefined,
    state: formData.state || undefined,
    city: formData.city || undefined,
    phone: formData.phone ? [formData.phone] : [],
    address: formData.address || undefined,
    email: formData.email || undefined,
    emails: (formData.emails ?? []).filter((e: any) => e?.email),
    contacts: formData.contacts ?? [],
  })

  const validateForm = (payload: any, isEditing: boolean) => {
    fieldErrors.value = {}
    const schema = isEditing ? clientUpdateSchema : clientFormSchema
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

  const saveClient = async (formData: Record<string, any>, clientId?: string) => {
    submitError.value = ''
    const isEditing = !!clientId
    const payload = buildPayload(formData)

    if (!validateForm(payload, isEditing)) {
      return false
    }

    saving.value = true

    try {
      const url = isEditing ? `/api/clients/${clientId}` : '/api/clients'
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
    saveClient,
    validateForm,
  }
}
