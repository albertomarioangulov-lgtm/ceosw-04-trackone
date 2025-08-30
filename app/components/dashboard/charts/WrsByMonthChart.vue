<script setup lang="ts">
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  type ChartData,
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

interface Props {
  chartData: ChartData<'bar'>
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
    <v-card-title>Tendencia de WRs por Mes</v-card-title>
    <v-card-text>
      <div style="height: 400px">
        <Bar v-if="chartData.labels && chartData.labels.length" :data="chartData" :options="chartOptions" />
        <p v-else class="text-center">No hay datos suficientes para mostrar el gráfico.</p>
      </div>
    </v-card-text>
  </v-card>
</template>