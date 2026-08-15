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
  fetchCarriers,
  handleUpdateOptions,
  clearFilters,
} = useCarrierList()

const handleSaved = () => {
  fetchCarriers()
}

useRefreshOnFocus(fetchCarriers)

onMounted(() => {
  if (can(PERMISSIONS.CARRIERS_VIEW)) {
    fetchCarriers()
  }
})
</script>

<template>
  <template v-if="can(PERMISSIONS.CARRIERS_VIEW)">
    <h2 class="text-h6 font-weight-bold mb-2 mt-0">
      Carriers
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
        placeholder="Buscar por nombre o código"
      />
      <v-btn
        variant="text"
        prepend-icon="mdi-filter-remove-outline"
        @click="clearFilters"
      >
        Limpiar
      </v-btn>
      <v-spacer />
      <CarriersBtnCreate />
    </v-toolbar>

    <v-alert v-if="error" type="error" class="mb-4" closable @click:close="error = ''">
      {{ error }}
    </v-alert>

    <CarriersTable
      :items="items"
      :loading="loading"
      :total="total"
      :page="page"
      :items-per-page="itemsPerPage"
      :sort-by="sortBy"
      :sort-order="sortOrder"
      @update:options="handleUpdateOptions"
    />

    <CarriersForm @saved="handleSaved" />
  </template>
  <template v-else>
    <v-alert type="warning" title="Acceso denegado" text="No tienes permisos para acceder a esta página." />
  </template>
</template>
