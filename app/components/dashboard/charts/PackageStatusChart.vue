<script setup lang="ts">
import { Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  type ChartData,
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, ArcElement)

interface Props {
  chartData: ChartData<'doughnut'>
  loading: boolean
}

const props = defineProps<Props>()

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
}
</script>

<template>
  <v-card>
    <v-overlay
      :model-value="loading"
      class="align-center justify-center"
      contained
      persistent
    >
      <v-progress-circular
        color="primary"
        indeterminate
        size="64"
      />
    </v-overlay>
    <v-card-title>Estado de Paquetes</v-card-title>
    <v-card-text>
      <div style="height: 400px">
        <Doughnut v-if="chartData.labels && chartData.labels.length" :data="chartData" :options="chartOptions" />
        <p v-else class="text-center">No hay datos suficientes para mostrar el gráfico.</p>
      </div>
    </v-card-text>
  </v-card>
</template>