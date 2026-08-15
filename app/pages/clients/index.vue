<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const { can, PERMISSIONS } = usePermissions()

const {
  items,
  total,
  loading,
  error,
  search,
  page,
  itemsPerPage,
  sortBy,
  sortOrder,
  fetchClients,
  handleUpdateOptions,
  clearFilters,
} = useClientList()

const handleSaved = () => {
  fetchClients()
}

const handleView = (client: Record<string, any>) => {
  navigateTo(`/clients/${client.id ?? client._id}`)
}

// View mode: 'table' | 'cards'
const viewMode = ref<'table' | 'cards'>('table')

const initializeViewMode = () => {
  let stored: string | null = null
  try {
    stored = localStorage.getItem('clients-view-mode')
  } catch {}
  if (stored === 'table' || stored === 'cards') {
    viewMode.value = stored
  } else {
    viewMode.value = window.innerWidth < 768 ? 'cards' : 'table'
  }
}

const toggleView = () => {
  viewMode.value = viewMode.value === 'table' ? 'cards' : 'table'
  try {
    localStorage.setItem('clients-view-mode', viewMode.value)
  } catch {}
}

onMounted(() => {
  initializeViewMode()

  window.addEventListener('resize', () => {
    try {
      const stored = localStorage.getItem('clients-view-mode')
      if (!stored) {
        viewMode.value = window.innerWidth < 768 ? 'cards' : 'table'
      }
    } catch {}
  })

  if (can(PERMISSIONS.CLIENTS_VIEW)) {
    fetchClients()
  }
})
</script>

<template>
  <template v-if="can(PERMISSIONS.CLIENTS_VIEW)">
    <h2 class="text-h6 font-weight-bold mb-2 mt-0">
      Clientes
    </h2>

    <v-toolbar>
      <v-text-field
        flat
        class="ml-1"
        v-model="search"
        prepend-inner-icon="mdi-magnify"
        density="compact"
        variant="solo"
        hide-details
        clearable
        placeholder="Buscar por nombre, teléfono, email o ciudad"
      />
      <v-btn
        variant="text"
        prepend-icon="mdi-filter-remove-outline"
        @click="clearFilters"
      >
        Limpiar
      </v-btn>
      <v-btn
        variant="text"
        :icon="viewMode === 'table' ? 'mdi-view-grid-outline' : 'mdi-view-list-outline'"
        :title="viewMode === 'table' ? 'Vista tarjetas' : 'Vista tabla'"
        @click="toggleView"
        class="mr-2"
      />
      <v-spacer />
      <ClientsBtnCreate />
    </v-toolbar>

    <v-alert v-if="error" type="error" class="mb-4" closable @click:close="error = ''">
      {{ error }}
    </v-alert>

    <ClientsTable
      v-if="viewMode === 'table'"
      :items="items"
      :loading="loading"
      :total="total"
      :page="page"
      :items-per-page="itemsPerPage"
      :sort-by="sortBy"
      :sort-order="sortOrder"
      @view="handleView"
      @update:options="handleUpdateOptions"
    />

    <ClientsCards
      v-else
      :items="items"
      :loading="loading"
      :total="total"
      :page="page"
      :items-per-page="itemsPerPage"
      :sort-by="sortBy"
      :sort-order="sortOrder"
      @view="handleView"
      @update:options="handleUpdateOptions"
    />

    <ClientsForm @saved="handleSaved" />
  </template>
  <template v-else>
    <v-alert type="warning" title="Acceso denegado" text="No tienes permisos para acceder a esta página." />
  </template>
</template>
