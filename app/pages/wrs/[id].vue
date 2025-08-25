<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { WR } from '~/interfaces/WR'

const { t } = useI18n()
const route = useRoute()
const dataId = route.params.id?.toString() || '0'

// Datos principales
const itemData = ref<WR | undefined>(undefined)
const loadingData = ref(true)
const fetchWR = async () => {
  loadingData.value = true
  const { getWR } = useWR()
  const { data, refresh } = await getWR(dataId)
  itemData.value = data.value as WR
  loadingData.value = false
}


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
{{ dataId }}
<v-container fluid class="pt-0 pl-0 pr-0">
    <v-toolbar flat color="transparent">
      <div>
        <v-toolbar-title>{{ t('WR Details') }} - {{ itemData?.wrId }}</v-toolbar-title>
        <v-breadcrumbs
          :items="items"
          class="breadcrumbs-under-title mt-0 pt-0 pb-0"
          style="font-size: 0.85rem;"
        />
      </div>
      <v-spacer />
      <!-- <WrsBtnSubmit action="edit" :itemData="clientData" /> -->
       <WrsBtnSendEmail :item="itemData!" :itemId="dataId"  />
    </v-toolbar>

    <PackagesByWRList :item="itemData!" :itemId="dataId" />
</v-container>
</template>