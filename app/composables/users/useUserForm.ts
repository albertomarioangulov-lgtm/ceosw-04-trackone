// ============================================================
// Composable de Formulario de Usuario - patrón casaroca
// ============================================================
import { ref } from 'vue'
import { userCreateSchema, userUpdateSchema } from '~~/shared/user'

export const useUserForm = () => {
  const saving = ref(false)
  const submitError = ref('')
  const fieldErrors = ref<Record<string, string | undefined>>({})

  const { handleApiError } = useApiError()

  const fieldSchemas = userCreateSchema.shape

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

  const validateForm = (formData: any, isEditing: boolean) => {
    fieldErrors.value = {}
    const schema = isEditing ? userUpdateSchema : userCreateSchema
    const result = schema.safeParse(formData)

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors as Record<string, string[] | undefined>
      Object.keys(errors).forEach((field) => {
        fieldErrors.value[field] = errors[field]?.[0]
      })
      return false
    }

    return true
  }

  const saveUser = async (formData: Record<string, any>, userId?: string) => {
    submitError.value = ''
    const isEditing = !!userId

    if (!validateForm(formData, isEditing)) {
      return false
    }

    saving.value = true

    try {
      const url = isEditing ? `/api/users/${userId}` : '/api/users'
      const payload = { ...formData }
      if (!payload.password) delete payload.password
      delete payload.confirmPassword

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
    saveUser,
    validateForm,
    validateField,
  }
}
