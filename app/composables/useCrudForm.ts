export function useCrudForm<T>(
  options: {
    action: 'create' | 'edit'
    createFn: (data: Partial<T>) => Promise<any>
    updateFn: (id: string, data: Partial<T>) => Promise<any>
    getId: (data: Partial<T>) => string | undefined
    resourceName: string
    v$: any
    emits: any
    clearForm: () => void
    refreshFn?: (keys: string[]) => Promise<void>
  }
) {
  if (!options.action) {
    throw new Error('No action provided to useCrudForm')
  }
  console.log('useCrudForm action:', options.action)
  
  const isLoading = ref(false)

  const processForm = async (state: Partial<T>) => {
    options.v$.value.$touch()
    if (options.v$.value.$error) return

    isLoading.value = true
    let actionProcess = null

    try {
      if (options.action === 'create') {
        const { data } = await options.createFn(state)
        actionProcess = data
      } else if (options.action === 'edit') {
        const dataId = options.getId(state)
        if (!dataId) throw new Error('No ID for update')
        const { data: updatedData } = await options.updateFn(dataId, state)
        actionProcess = updatedData
        await options.refreshFn?.([`${options.resourceName}-${dataId}`])
      }

      if (actionProcess) {
        options.clearForm()
        options.emits('onClose')
      }
    } catch (error) {
      console.error('Error processing form:', error)
    } finally {
      await options.refreshFn?.([`${options.resourceName}-list`])
      isLoading.value = false
    }
  }

  return { processForm, isLoading }
}