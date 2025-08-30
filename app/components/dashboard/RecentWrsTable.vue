<script setup lang="ts">

interface WR {
  _id: string
  wrId: string
  client: {
    name: string
  }
  createdAt: string
}

interface Props {
  items: WR[]
  loading: boolean
}

const props = defineProps<Props>()

const headers = [
  { title: 'WR #', key: 'wrId', sortable: false },
  { title: 'Cliente', key: 'client.name', sortable: false },
  { title: 'Fecha de Creación', key: 'createdAt', sortable: false },
  { title: 'Acciones', key: 'actions', sortable: false, align: 'end' as const },
]

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const { exportData } = useExportToCSV()

function exportToCSV() {
  exportData({
    filename: 'wrs-recientes',
    data: props.items.map(item => ({
      'WR #': item.wrId,
      'Cliente': item.client.name,
      'Fecha de Creación': formatDate(item.createdAt),
    })),
  })
}
</script>

<template>
  <v-card>
    <v-toolbar density="compact" flat>
      <v-toolbar-title>Últimos WRs Creados</v-toolbar-title>
      <v-spacer />
      <v-btn icon="mdi-download" size="small" variant="text" @click="exportToCSV">
        <v-icon />
        <v-tooltip activator="parent" location="bottom">Exportar a CSV</v-tooltip>
      </v-btn>
    </v-toolbar>
    <v-data-table :headers="headers" :items="items" :loading="loading" density="compact" :items-per-page="5">
      <template #item.createdAt="{ item }">
        {{ formatDate(item.createdAt) }}
      </template>
      <template #item.actions="{ item }">
        <v-btn :to="`/wrs/${item._id}`" variant="text" color="primary" icon="mdi-eye-outline" size="x-small" />
      </template>
      <template #bottom />
    </v-data-table>
  </v-card>
</template>