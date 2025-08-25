export function useList<T>(fetchFn: () => Promise<{ value: T[] } | { value: any }>) {
  const items = ref<T[]>([])
  const pending = ref(true)

  const load = async () => {
    pending.value = true
    try {
      const result = await fetchFn()
      // items.value = Array.isArray(result.value) ? result.value : []
      items.value = result.value
    } finally {
      pending.value = false
    }
  }

  // Carga automática al montar
  load()

  return { items, pending, reload: load }
}