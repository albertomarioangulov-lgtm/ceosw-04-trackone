<script setup lang="ts">

interface TopClient {
  clientId: string
  clientName: string
  wrCount: number,
  packageCount: number
}

interface Props {
  items: TopClient[]
  loading: boolean
}

const props = defineProps<Props>()

const headers = [
  { title: 'Cliente', key: 'clientName', sortable: false },
  { title: 'WRs', key: 'wrCount', sortable: false, align: 'end' as const },
  { title: 'Paquetes', key: 'packageCount', sortable: false, align: 'end' as const },
  { title: 'Acciones', key: 'actions', sortable: false, align: 'end' as const },
]

const { exportData } = useExportToCSV()

function exportToCSV() {
  exportData({
    filename: 'top-clientes',
    data: props.items.map(item => ({
      'Cliente': item.clientName,
      'WRs': item.wrCount,
      'Paquetes': item.packageCount,
    })),
  })
}
</script>

<template>
  <v-card>
    <v-toolbar density="compact" flat>
      <v-toolbar-title>Top 5 Clientes (por paquetes)</v-toolbar-title>
      <v-spacer />
      <v-btn icon="mdi-download" size="small" variant="text" @click="exportToCSV">
        <v-icon />
        <v-tooltip activator="parent" location="bottom">Exportar a CSV</v-tooltip>
      </v-btn>
    </v-toolbar>
    <v-data-table :headers="headers" :items="items" :loading="loading" density="compact" :items-per-page="5">
      <!-- Ocultar paginación y pie de página para una lista Top 5 -->
      <template #item.actions="{ item }">
        <v-btn
          :to="`/clients/${item.clientId}`"
          variant="text" color="primary" icon="mdi-eye-outline" size="x-small"
        />
      </template>
      <template #bottom />
    </v-data-table>
  </v-card>
</template>