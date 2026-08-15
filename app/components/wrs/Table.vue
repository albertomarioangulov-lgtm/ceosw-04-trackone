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
  (e: 'view', wr: Record<string, any>): void
  (e: 'update:options', options: any): void
}>()

const headers = [
  { title: 'WR', key: 'wrId', sortable: true },
  { title: 'Fecha', key: 'createdAt', sortable: true },
  { title: 'Cliente', key: 'client.name', sortable: false },
  { title: 'Paquetes', key: 'packageCounter', sortable: false },
  { title: 'Dirección', key: 'client.address', sortable: false },
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
    <template #item.client.name="{ item }">
      <v-chip
        v-if="item.client?._id"
        :to="`/clients/${item.client._id}`"
        color="primary"
        variant="text"
        size="small"
        class="font-weight-medium"
      >
        {{ item.client.name }}
      </v-chip>
      <span v-else>—</span>
    </template>
    <template #item.packageCounter="{ item }">
      <v-chip
        :color="item.availablePackageCount > 0 ? 'success' : undefined"
        size="small"
        variant="tonal"
      >
        {{ item.availablePackageCount || 0 }}/{{ item.packageCount || 0 }}
      </v-chip>
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
          :title="`Ver WR ${item.wrId || ''}`"
          @click="emit('view', item)"
        />
        <WrsBtnAddPackages v-if="item.isActive" :wr="item" />
      </div>
    </template>
    <template #no-data>
      No hay WRs registrados.
    </template>
    <template #loading>
      Cargando WRs...
    </template>
  </v-data-table-server>
</template>
