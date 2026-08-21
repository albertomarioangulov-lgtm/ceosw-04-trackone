<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { WR } from '~/interfaces/WR'

definePageMeta({
  middleware: 'auth',
})

const { t } = useI18n()
const route = useRoute()
const dataId = route.params.id?.toString() || '0'

// Datos principales
const itemData = ref<WR | undefined>(undefined)
const loadingData = ref(true)
const selectedPackages = ref<string[]>([])
const packagesListRef = ref<any>(null)

const fetchWR = async () => {
  loadingData.value = true
  try {
    itemData.value = await $fetch(`/api/wrs/${dataId}`) as WR
  } catch (error) {
    console.error('Error cargando WR:', error)
  } finally {
    loadingData.value = false
  }
}

const handleCrCreated = async () => {
  selectedPackages.value = []
  await nextTick()
  packagesListRef.value?.reload()
  await fetchWR()
}

const handleWrSaved = async () => {
  await nextTick()
  packagesListRef.value?.reload()
  await fetchWR()
}

const statusColor = (s?: string) => {
  if (s === 'opened') return 'success'
  if (s === 'pending') return 'info'
  return 'grey'
}

const isOpen = computed(() => !!itemData.value && ['pending', 'opened'].includes(itemData.value.status ?? ''))

onMounted(() => {
  fetchWR()
})


const items = [
  { title: t('home'), to: '/' },
  { title: t('wrs'), to: '/wrs' },
  { title: ':-)', href: `/wrs/${dataId}` }
]
</script>

<template>
<v-container fluid class="pt-0 pl-0 pr-0">
    <h1 class="mb-1 text-h5 font-weight-bold">
      WR #{{ itemData?.wrId }}
      <v-chip v-if="itemData?.status" size="small" :color="statusColor(itemData.status)" variant="tonal" class="ml-2">
        {{ itemData.status }}
      </v-chip>
    </h1>
    <v-breadcrumbs
      :items="items"
      class="breadcrumbs-under-title mb-4 mt-0 pt-0 pb-0"
      style="font-size: 0.85rem;"
    />

    <v-card v-if="itemData?.client?.name" variant="tonal" class="mb-4">
      <v-card-text>
        <v-row align="center">
          <v-col cols="12" md="4" class="d-flex align-center">
            <v-avatar color="primary" variant="tonal" class="mr-4">
              <v-icon>mdi-account-outline</v-icon>
            </v-avatar>
            <div style="min-width: 0;">
              <div class="text-caption text-medium-emphasis">Cliente</div>
              <div class="font-weight-medium text-truncate">
                <NuxtLink
                  v-if="itemData.client._id"
                  :to="`/clients/${itemData.client._id}`"
                  class="text-decoration-none"
                >
                  {{ itemData.client.name }}
                </NuxtLink>
                <template v-else>{{ itemData.client.name }}</template>
              </div>
            </div>
          </v-col>
          <v-col cols="12" md="4" class="d-flex align-center">
            <v-avatar color="info" variant="tonal" class="mr-4">
              <v-icon>mdi-phone-outline</v-icon>
            </v-avatar>
            <div style="min-width: 0;">
              <div class="text-caption text-medium-emphasis">Teléfono</div>
              <div class="font-weight-medium text-truncate">
                {{ Array.isArray(itemData.client.phone) ? itemData.client.phone.join(', ') : (itemData.client.phone || '—') }}
              </div>
            </div>
          </v-col>
          <v-col cols="12" md="4" class="d-flex align-start">
            <v-avatar color="success" variant="tonal" class="mr-4 mt-1">
              <v-icon>mdi-email-outline</v-icon>
            </v-avatar>
            <div style="min-width: 0;">
              <div class="text-caption text-medium-emphasis">Emails</div>
              <div>
                <template v-for="(e, i) in itemData.client.emails" :key="i">
                  <v-chip size="small" class="mr-1 mb-1">{{ e.email }}</v-chip>
                </template>
                <span v-if="!itemData.client.emails?.length">—</span>
              </div>
            </div>
          </v-col>
        </v-row>
        <v-row class="mt-2">
          <v-col cols="12" md="8" class="d-flex align-center">
            <v-icon size="small" color="grey" class="mr-2">mdi-map-marker-outline</v-icon>
            <span class="text-caption">
              {{ [itemData.client.address, itemData.client.city, itemData.client.state, itemData.client.country].filter(Boolean).join(', ') || '—' }}
            </span>
          </v-col>
          <v-col cols="12" md="4" class="d-flex align-center">
            <v-icon size="small" color="grey" class="mr-2">mdi-inbox-outline</v-icon>
            <span class="text-caption">
              P.O. Box: {{ itemData.client.poboxid != null ? String(itemData.client.poboxid).padStart(4, '0') : '—' }}
            </span>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-toolbar class="mt-4 mb-0" rounded="lg">
      <v-toolbar-title class="text-subtitle-1">Gestión del WR</v-toolbar-title>
      <v-spacer />
      <WrsBtnAddPackages v-if="isOpen && itemData" :wr="itemData" />
      <CrsBtnCreateCR :selected="selectedPackages" :wr-id="dataId" @created="handleCrCreated" />
      <WrsBtnSendEmail :item="itemData!" :itemId="dataId" @sent="fetchWR" />
      <WrsBtnDownloadPDF :item-id="dataId" />
    </v-toolbar>

    <PackagesByWRList
      ref="packagesListRef"
      :item="itemData!"
      :itemId="dataId"
      v-model:model-value="selectedPackages"
    />

    <WrsForm @saved="handleWrSaved" />
</v-container>
</template>
