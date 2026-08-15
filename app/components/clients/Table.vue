<script setup lang="ts">
const props = defineProps<{
  items: Array<Record<string, any>>
  loading: boolean
  total: number
  page: number
  itemsPerPage: number
  sortBy: string
  sortOrder: 'asc' | 'desc'
}>()

const emit = defineEmits<{
  (e: 'view', client: Record<string, any>): void
  (e: 'update:options', options: any): void
}>()

const headers = [
  { title: 'Nombre', key: 'name', sortable: true },
  { title: 'Pobox', key: 'poboxid', sortable: false },
  { title: 'Teléfono', key: 'phone', sortable: false },
  { title: 'Ubicación', key: 'location', sortable: false },
  { title: 'Por', key: 'createdBy', sortable: false },
  { title: 'Acciones', key: 'actions', sortable: false },
]
</script>

<template>
  <v-data-table-server
    :headers="headers"
    :items="items || []"
    item-key="id"
    :loading="loading"
    :items-length="total"
    :page="page"
    :items-per-page="itemsPerPage"
    :sort-by="[{ key: sortBy, order: sortOrder }]"
    :hide-default-footer="total <= itemsPerPage"
    density="comfortable"
    @update:options="emit('update:options', $event)"
    @click:row="(_: any, { item }: any) => emit('view', item)"
  >
    <template #item.poboxid="{ item }">
      <span>{{ item.poboxid != null ? String(item.poboxid).padStart(4, '0') : '—' }}</span>
    </template>
    <template #item.phone="{ item }">
      <span>{{ Array.isArray(item.phone) ? item.phone.join(', ') : (item.phone || '—') }}</span>
    </template>
    <template #item.location="{ item }">
      <span>{{ [item.city, item.state, item.country].filter(Boolean).join(', ') || '—' }}</span>
    </template>
    <template #item.createdBy="{ item }">
      <span v-if="item.createdBy">{{ item.createdBy.name }}</span>
      <span v-else>—</span>
    </template>
    <template #item.actions="{ item }">
      <div class="d-flex align-center" @click.stop>
        <ClientsBtnEdit :client="item" />
      </div>
    </template>
    <template #no-data>
      No hay clientes registrados.
    </template>
    <template #loading>
      Cargando clientes...
    </template>
  </v-data-table-server>
</template>
