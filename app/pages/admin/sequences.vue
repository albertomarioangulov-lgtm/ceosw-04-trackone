<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const { can, PERMISSIONS } = usePermissions()

const search = ref('')

const { data, pending, error } = await useFetch('/api/admin/sequences', {
  headers: useRequestHeaders(['cookie']),
})

const items = computed(() => {
  const list = data.value?.items ?? []
  const term = search.value.trim().toLowerCase()
  if (!term) return list
  return list.filter((item: any) =>
    [item.entity, String(item.oldValue), String(item.newValue), item.id]
      .join(' ')
      .toLowerCase()
      .includes(term),
  )
})

const entityColor = (entity: string) => {
  if (entity === 'WR') return 'primary'
  if (entity === 'CR') return 'success'
  return 'info'
}

const formatDate = (value: string) => {
  if (!value) return '—'
  return new Date(value).toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' })
}

const detailUrl = (item: any) => {
  if (item.entity === 'WR') return `/wrs/${item.id}`
  if (item.entity === 'CR') return `/crs/${item.id}`
  return null
}
</script>

<template>
  <template v-if="can(PERMISSIONS.USERS_MANAGE)">
    <h2 class="text-h6 font-weight-bold mb-2 mt-0">
      Secuencias renumeradas
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
        placeholder="Buscar por número anterior, nuevo, entidad o id"
      />
    </v-toolbar>

    <v-alert v-if="error" type="error" class="mb-4">
      {{ error?.statusMessage || 'Error cargando secuencias' }}
    </v-alert>

    <v-data-table
      :headers="[
        { title: 'Entidad', key: 'entity' },
        { title: 'Nº anterior', key: 'oldValue' },
        { title: 'Nº nuevo', key: 'newValue' },
        { title: 'Creado', key: 'createdAt' },
        { title: 'Detalle', key: 'actions', sortable: false },
      ]"
      :items="items"
      item-key="id"
      :loading="pending"
      :hide-default-footer="items.length <= 10"
      density="comfortable"
    >
      <template #item.entity="{ item }">
        <v-chip size="small" :color="entityColor(item.entity)" variant="tonal">
          {{ item.entity }}
        </v-chip>
      </template>
      <template #item.oldValue="{ item }">
        <span class="text-decoration-line-through text-medium-emphasis">{{ item.oldValue }}</span>
      </template>
      <template #item.newValue="{ item }">
        <strong>{{ item.newValue }}</strong>
      </template>
      <template #item.createdAt="{ item }">
        <span>{{ formatDate(item.createdAt) }}</span>
      </template>
      <template #item.actions="{ item }">
        <v-btn
          v-if="detailUrl(item)"
          size="small"
          variant="text"
          icon="mdi-open-in-new"
          :to="detailUrl(item)"
        />
        <span v-else>—</span>
      </template>
      <template #no-data>
        No hay secuencias renumeradas registradas.
      </template>
    </v-data-table>
  </template>
  <template v-else>
    <v-alert type="warning" title="Acceso denegado" text="No tienes permisos para acceder a esta página." />
  </template>
</template>
