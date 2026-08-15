// ============================================================
// Composable de Usuarios (listado) - patrón casaroca
// ============================================================
import { ref, watch } from 'vue'

export const useUserList = () => {
  const items = ref<Array<Record<string, any>>>([])
  const total = ref(0)
  const loading = ref(false)
  const error = ref('')
  const search = ref('')

  // Paginación y orden
  const page = ref(1)
  const itemsPerPage = ref(15)
  const totalPages = ref(1)
  const sortBy = ref('createdAt')
  const sortOrder = ref<'asc' | 'desc'>('desc')

  let searchTimeout: ReturnType<typeof setTimeout> | null = null

  const { handleApiError } = useApiError()

  const fetchUsers = async () => {
    error.value = ''
    loading.value = true
    try {
      const result = await $fetch('/api/users', {
        params: {
          page: page.value,
          limit: itemsPerPage.value,
          search: search.value || undefined,
          sortBy: sortBy.value,
          sortOrder: sortOrder.value,
        },
      }) as any

      items.value = result.items
      total.value = result.total
      page.value = result.page
      itemsPerPage.value = result.limit
      totalPages.value = result.totalPages
    } catch (err: any) {
      error.value = await handleApiError(err)
    } finally {
      loading.value = false
    }
  }

  const handleUpdateOptions = (options: any) => {
    page.value = options.page || 1
    itemsPerPage.value = options.itemsPerPage || 15
    if (options.sortBy?.length) {
      sortBy.value = options.sortBy[0].key
      sortOrder.value = options.sortBy[0].order || 'desc'
    } else {
      sortBy.value = 'createdAt'
      sortOrder.value = 'desc'
    }
    fetchUsers()
  }

  const clearFilters = () => {
    search.value = ''
    page.value = 1
    fetchUsers()
  }

  // Búsqueda debounced
  watch(search, () => {
    if (searchTimeout) clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
      page.value = 1
      fetchUsers()
    }, 400)
  })

  // Cambios de página/paginación → refetch
  watch([page, itemsPerPage], () => {
    fetchUsers()
  })

  return {
    items,
    total,
    loading,
    error,
    search,
    page,
    itemsPerPage,
    totalPages,
    sortBy,
    sortOrder,
    fetchUsers,
    handleUpdateOptions,
    clearFilters,
  }
}
