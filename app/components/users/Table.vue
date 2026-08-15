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
  { title: 'Usuario', key: 'username', sortable: true },
  { title: 'Nombre', key: 'name', sortable: true },
  { title: 'Email', key: 'email', sortable: true },
  { title: 'Roles', key: 'roles', sortable: false },
  { title: 'Color', key: 'color', sortable: false },
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
    <template #item.roles="{ item }">
      <template v-if="item.roles?.length">
        <v-chip
          v-for="role in item.roles"
          :key="role"
          size="small"
          color="primary"
          variant="tonal"
          class="mr-1"
        >
          {{ role }}
        </v-chip>
      </template>
      <span v-else>—</span>
    </template>
    <template #item.color="{ item }">
      <v-icon v-if="item.color" :color="item.color">mdi-circle</v-icon>
      <span v-else>—</span>
    </template>
    <template #item.createdBy="{ item }">
      <span v-if="item.createdBy">{{ item.createdBy.name }}</span>
      <span v-else>—</span>
    </template>
    <template #item.actions="{ item }">
      <div class="d-flex align-center" @click.stop>
        <UsersBtnEdit :user="item" />
      </div>
    </template>
    <template #no-data>
      No hay usuarios registrados.
    </template>
    <template #loading>
      Cargando usuarios...
    </template>
  </v-data-table-server>
</template>
