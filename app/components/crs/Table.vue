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
  (e: 'view', cr: Record<string, any>): void
  (e: 'update:options', options: any): void
}>()

const headers = [
  { title: 'CR', key: 'crId', sortable: true },
  { title: 'Fecha', key: 'createdAt', sortable: true },
  { title: 'WR', key: 'wr.wrId', sortable: false },
  { title: 'Cliente', key: 'wr.client.name', sortable: false },
  { title: 'Dirección', key: 'wr.client.address', sortable: false },
  { title: 'Paquetes', key: 'packageCount', sortable: false },
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
    <template #item.createdAt="{ item }">
      <a-data-table-item-created-at :item="item" />
    </template>
    <template #item.wr.client.name="{ item }">
      <span v-if="item.wr?.client?.name">{{ item.wr.client.name }}</span>
      <span v-else>—</span>
    </template>
    <template #item.createdBy="{ item }">
      <span v-if="item.createdBy">{{ item.createdBy.name }}</span>
      <span v-else>—</span>
    </template>
    <template #item.actions="{ item }">
      <div class="d-flex align-center" @click.stop>
        <v-btn
          size="small"
          variant="text"
          icon="mdi-eye-outline"
          :title="`Ver CR ${item.crId || ''}`"
          @click="emit('view', item)"
        />
      </div>
    </template>
    <template #no-data>
      No hay CRs registrados.
    </template>
    <template #loading>
      Cargando CRs...
    </template>
  </v-data-table-server>
</template>
