<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Client } from '~/interfaces/Client'

const { t } = useI18n()
const route = useRoute()
const dataId = route.params.id?.toString() || '0'

// Datos principales
const clientData = ref<Client | undefined>(undefined)
const loadingClient = ref(true)
const fetchClient = async () => {
  loadingClient.value = true
  const { getClient } = useClient()
  const { data, refresh } = await getClient(dataId)
  clientData.value = data.value as Client
  loadingClient.value = false
}

// Ubicaciones asignadas
const locations = ref([])
const loadingLocations = ref(true)
const fetchLocations = async () => {
  loadingLocations.value = true
  // Reemplaza por tu función real
  // const { data } = await getClientLocations(clientId)
  // locations.value = data.value || []
  loadingLocations.value = false
}

// Activos asignados
const assets = ref([])
const loadingAssets = ref(true)
const fetchAssets = async () => {
  loadingAssets.value = true
  // Reemplaza por tu función real
  // const { data } = await getClientAssets(clientId)
  // assets.value = data.value || []
  loadingAssets.value = false
}

// Órdenes de trabajo
const workOrders = ref([])
const loadingWorkOrders = ref(true)
const fetchWorkOrders = async () => {
  loadingWorkOrders.value = true
  // Reemplaza por tu función real
  // const { data } = await getClientWorkOrders(clientId)
  // workOrders.value = data.value || []
  loadingWorkOrders.value = false
}

// Avisos
const notices = ref([])
const loadingNotices = ref(true)
const fetchNotices = async () => {
  loadingNotices.value = true
  // Reemplaza por tu función real
  // const { data } = await getClientNotices(clientId)
  // notices.value = data.value || []
  loadingNotices.value = false
}

onMounted(() => {
  fetchClient()
  fetchLocations()
  fetchAssets()
  fetchWorkOrders()
  fetchNotices()
})

const items = [
  { title: t('home'), to: '/' },
  { title: t('clients'), to: '/clients' },
  { title: ':-)', href: `/clients/${dataId}` }
]
</script>

<template>
  <v-container fluid class="pt-0 pl-0 pr-0">
    <v-toolbar flat color="transparent">
      <div>
        <v-toolbar-title>{{ t('Client Details') }}</v-toolbar-title>
        <v-breadcrumbs
          :items="items"
          class="breadcrumbs-under-title mt-0 pt-0 pb-0"
          style="font-size: 0.85rem;"
        />
      </div>
      <v-spacer />
      <ClientsBtnSendEmail :item="clientData!" :itemId="dataId" />
      <ClientsBtnSubmit action="edit" :itemData="clientData" />
    </v-toolbar>

    <v-row>
      <!-- Detalle del cliente -->
      <v-col cols="12" md="4">
        <CommonInfoTableCard
          :title="t('Client Info')"
          :rows="[
            { label: t('Name'), value: clientData?.name, key: 'name' },
            { label: t('Phone'), value: clientData?.phone, key: 'phone' },
            { label: t('Email'), value: clientData?.email, key: 'email' },
            { label: t('Status'), value: clientData?.status, key: 'status' }
          ]"
        >
          <template #status="{ value }">
            <v-chip size="small" variant="tonal" rounded="pill" :color="value">{{ value }}</v-chip>
          </template>
        </CommonInfoTableCard>
      </v-col>

      <!-- Ubicaciones y activos -->
      <v-col cols="12" md="8">
        <v-row>
          <!-- Ubicaciones asignadas -->
          <v-col cols="12" md="6">
            <v-card>
              <v-card-title>{{ t('Assigned Locations') }}</v-card-title>
              <v-card-text>
                <v-skeleton-loader v-if="loadingLocations" type="table" />
                <v-list v-else>
                  <v-list-item v-for="loc in locations" :key="loc.id">
                    <v-list-item-title>{{ loc.name }}</v-list-item-title>
                    <v-list-item-subtitle>{{ loc.address }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item v-if="locations.length === 0">
                    <v-list-item-title class="text-grey">{{ t('No locations assigned') }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Activos asignados -->
          <v-col cols="12" md="6">
            <v-card>
              <v-card-title>{{ t('Assigned Assets') }}</v-card-title>
              <v-card-text>
                <v-skeleton-loader v-if="loadingAssets" type="table" />
                <v-list v-else>
                  <v-list-item v-for="asset in assets" :key="asset.id">
                    <v-list-item-title>{{ asset.name }}</v-list-item-title>
                    <v-list-item-subtitle>{{ asset.type }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item v-if="assets.length === 0">
                    <v-list-item-title class="text-grey">{{ t('No assets assigned') }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-row>
      <!-- Órdenes de trabajo -->
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>{{ t('Work Orders') }}</v-card-title>
          <v-card-text>
            <v-skeleton-loader v-if="loadingWorkOrders" type="table" />
            <v-list v-else>
              <v-list-item v-for="wo in workOrders" :key="wo.id">
                <v-list-item-title>
                  {{ wo.title }}
                  <v-chip size="x-small" class="ml-2" :color="wo.status">{{ wo.status }}</v-chip>
                </v-list-item-title>
                <v-list-item-subtitle>{{ wo.date }}</v-list-item-subtitle>
              </v-list-item>
              <v-list-item v-if="workOrders.length === 0">
                <v-list-item-title class="text-grey">{{ t('No work orders') }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Avisos -->
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>{{ t('Notices') }}</v-card-title>
          <v-card-text>
            <v-skeleton-loader v-if="loadingNotices" type="table" />
            <v-list v-else>
              <v-list-item v-for="notice in notices" :key="notice.id">
                <v-list-item-title>{{ notice.title }}</v-list-item-title>
                <v-list-item-subtitle>{{ notice.date }}</v-list-item-subtitle>
              </v-list-item>
              <v-list-item v-if="notices.length === 0">
                <v-list-item-title class="text-grey">{{ t('No notices') }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.fit-content {
  width: 1%;
  white-space: nowrap;
}
.breadcrumbs-under-title {
  margin-top: -8px !important;
  margin-bottom: 0 !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  font-size: 0.85rem !important;
}
</style>