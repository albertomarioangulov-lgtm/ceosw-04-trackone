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
  (e: 'update:options', options: any): void
}>()

const headers = [
  { title: 'Código', key: 'code', sortable: true },
  { title: 'Nombre', key: 'name', sortable: true },
  { title: 'Creado por', key: 'createdBy', sortable: false },
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
  >
    <template #item.createdBy="{ item }">
      <span v-if="item.createdBy">{{ item.createdBy.name }}</span>
      <span v-else>—</span>
    </template>
    <template #item.actions="{ item }">
      <div class="d-flex align-center" @click.stop>
        <CarriersBtnEdit :carrier="item" />
      </div>
    </template>
    <template #no-data>
      No hay carriers registrados.
    </template>
    <template #loading>
      Cargando carriers...
    </template>
  </v-data-table-server>
</template>
