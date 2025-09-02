<script setup lang="ts">
import { useAuth } from '#imports'
import { subMonths, startOfMonth, endOfMonth, formatISO, formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import StatsCard from '~~/app/components/dashboard/StatsCard.vue'
import WrsByMonthChart from '~~/app/components/dashboard/charts/WrsByMonthChart.vue'
import PackageStatusChart from '~~/app/components/dashboard/charts/PackageStatusChart.vue'
import RecentWrsTable from '~~/app/components/dashboard/RecentWrsTable.vue'
import TopClientsTable from '~~/app/components/dashboard/TopClientsTable.vue'

definePageMeta({
  middleware: 'sidebase-auth',
})

const { token } = useAuth()

// Helper for headers
const getHeaders = () => ({
  Authorization: `${token.value}`,
  'Content-Type': 'application/json',
})

// --- Filtro de Rango de Fechas ---
const today = new Date()
// Por defecto, los últimos 6 meses
const startDate = useCookie('dashboard-startDate', {
  default: () => formatISO(startOfMonth(subMonths(today, 5)), { representation: 'date' }),
})
const endDate = useCookie('dashboard-endDate', {
  default: () => formatISO(endOfMonth(today), { representation: 'date' }),
})

const { data, pending, error, refresh } = await useAsyncData(
  'dashboard-data',
  async () => {
    const params = new URLSearchParams({
      startDate: startDate.value,
      endDate: endDate.value,
    })

    const [stats, wrsByMonth, packageStatus, recentWrs, topClients] = await Promise.all([
      $fetch(`/api/dashboard/stats?${params.toString()}`, { headers: getHeaders() }),
      $fetch(`/api/dashboard/wrs-by-month?${params.toString()}`, { headers: getHeaders() }),
      $fetch(`/api/dashboard/package-status?${params.toString()}`, { headers: getHeaders() }),
      $fetch('/api/dashboard/recent-wrs', { headers: getHeaders() }),
      $fetch(`/api/dashboard/top-clients?${params.toString()}`, { headers: getHeaders() }),
    ])
    return { stats, wrsByMonth, packageStatus, recentWrs, topClients }
  },
  {
    watch: [startDate, endDate], // Vuelve a ejecutar la llamada cuando las fechas cambian
  },
)

// --- Lógica de Auto-Refresh ---
const lastRefreshed = ref(new Date())
const lastRefreshedText = computed(() => `Actualizado ${formatDistanceToNow(lastRefreshed.value, { addSuffix: true, locale: es })}`)

let refreshInterval: NodeJS.Timeout

async function handleRefresh() {
  await refresh()
  lastRefreshed.value = new Date()
}

onMounted(() => {
  // Actualiza cada 60 segundos
  refreshInterval = setInterval(handleRefresh, 60000)
})

onUnmounted(() => {
  clearInterval(refreshInterval)
})
// --- Fin de la lógica de Auto-Refresh ---

const stats = computed(() => data.value?.stats)
const wrsByMonthChartData = computed(() => data.value?.wrsByMonth ?? { labels: [], datasets: [] })
const packageStatusChartData = computed(() => data.value?.packageStatus ?? { labels: [], datasets: [] })
const recentWrs = computed(() => data.value?.recentWrs ?? [])
const topClients = computed(() => data.value?.topClients ?? [])

const dashboardStats = computed(() => [
  {
    title: 'Total WRs',
    stats: stats.value?.totalWrs ?? 0,
    icon: 'mdi-warehouse',
    color: 'primary',
  },
  {
    title: 'Total Paquetes',
    stats: stats.value?.totalPackages ?? 0,
    icon: 'mdi-package-variant-closed',
    color: 'success',
  },
  {
    title: 'WRs con Paquetes Disponibles',
    stats: stats.value?.availableWrsCount ?? 0,
    icon: 'mdi-package-variant-closed-check',
    color: 'info',
  },
  {
    title: 'Total Clientes',
    stats: stats.value?.totalClients ?? 0,
    icon: 'mdi-account-group',
    color: 'warning',
  },
])
</script>

<template>
  <v-container fluid>
    <!-- Filtro de Fechas y Refresh -->
    <v-row class="mb-0 align-center">
      <v-col cols="12" md="3">
        <v-text-field
          v-model="startDate"
          label="Fecha de Inicio"
          type="date"
        />
      </v-col>
      <v-col cols="12" md="3">
        <v-text-field
          v-model="endDate"
          label="Fecha de Fin"
          type="date"
          density="compact"
          hide-details
        />
      </v-col>
      <v-spacer />
      <v-col cols="auto" class="text-right">
        <div class="d-flex align-center">
          <span class="text-caption text-disabled mr-2">{{ lastRefreshedText }}</span>
          <v-btn :loading="pending" icon="mdi-refresh" variant="text" size="small" @click="handleRefresh" />
        </div>
      </v-col>
    </v-row>

    <!-- Stat Cards -->
    <v-row class="mt-0 pt-0">
      <v-col v-for="stat in dashboardStats" :key="stat.title" cols="12" sm="6" md="3">
        <StatsCard :title="stat.title" :stats="pending ? '...' : stat.stats" :icon="stat.icon" :color="stat.color" />
      </v-col>
    </v-row>

    <!-- Charts -->
    <v-row>
      <v-col cols="12" md="8">
        <WrsByMonthChart :chart-data="wrsByMonthChartData" :loading="pending" />
      </v-col>
      <v-col cols="12" md="4">
        <PackageStatusChart :chart-data="packageStatusChartData" :loading="pending" />
      </v-col>
    </v-row>

    <!-- Tables Row -->
    <v-row>
      <v-col cols="12" md="7">
        <RecentWrsTable :items="recentWrs" :loading="pending" />
      </v-col>
      <v-col cols="12" md="5">
        <TopClientsTable :items="topClients" :loading="pending" />
      </v-col>
    </v-row>
  </v-container>
</template>