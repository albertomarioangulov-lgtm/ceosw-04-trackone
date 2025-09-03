<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { CR } from '~/interfaces/CR'

const { t } = useI18n()
const route = useRoute()
const dataId = route.params.id?.toString() || '0'

// Datos principales
const itemData = ref<CR | undefined>(undefined)
const loadingData = ref(true)
const fetchCR = async () => {
  loadingData.value = true
  const { getCR } = useCR()
  const { data, refresh } = await getCR(dataId)
  itemData.value = data.value as CR
  loadingData.value = false
}


onMounted(() => {
  fetchCR()
})


const items = [
  { title: t('home'), to: '/' },
  { title: t('crs'), to: '/crs' },
  { title: ':-)', href: `/crs/${dataId}` }
]
</script>

<template>
{{ dataId }}
<v-container fluid class="pt-0 pl-0 pr-0">
    <v-toolbar flat color="transparent">
      <div>
        <v-toolbar-title>{{ t('CR Details') }} - {{ itemData?.crId }}</v-toolbar-title>
        <v-breadcrumbs
          :items="items"
          class="breadcrumbs-under-title mt-0 pt-0 pb-0"
          style="font-size: 0.85rem;"
        />
      </div>
      <v-spacer />
      <!-- <CrsBtnSubmit action="edit" :itemData="clientData" /> -->
       <CrsBtnSendEmail :item="itemData!" :itemId="dataId"  />
    </v-toolbar>

    <PackagesByCRList :item="itemData!" :itemId="dataId" />
</v-container>
</template>