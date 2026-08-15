// ============================================================
// Composable de Formulario de WR - patrón estandarizado
// ============================================================
import { ref } from 'vue'
import { wrCreateSchema } from '~~/shared/wr'

export const useWRForm = () => {
  const saving = ref(false)
  const submitError = ref('')
  const fieldErrors = ref<Record<string, string | undefined>>({})

  const { handleApiError } = useApiError()

  const buildPayload = (formData: Record<string, any>) => ({
    _id: formData._id ?? formData.id ?? undefined,
    client: typeof formData.client === 'object' && formData.client
      ? (formData.client._id ?? formData.client.id)
      : formData.client,
    packages: (formData.packages ?? []).map((p: any) => ({
      trkgNum: p.trkgNum,
      weight: p.weight,
      measures: p.measures
        ? { l: p.measures.l, w: p.measures.w, h: p.measures.h }
        : undefined,
      notes: p.notes,
    })),
  })

  const validateForm = (payload: any) => {
    fieldErrors.value = {}
    const result = wrCreateSchema.safeParse(payload)

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors as Record<string, string[] | undefined>
      Object.keys(errors).forEach((field) => {
        fieldErrors.value[field] = errors[field]?.[0]
      })
      return false
    }

    return true
  }

  const saveWR = async (formData: Record<string, any>) => {
    submitError.value = ''
    const payload = buildPayload(formData)

    if (!validateForm(payload)) {
      return false
    }

    saving.value = true

    try {
      // El server distingue crear vs. agregar paquetes por la presencia de `_id`.
      await $fetch('/api/wrs', { method: 'POST', body: payload })
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
    saveWR,
    validateForm,
  }
}
