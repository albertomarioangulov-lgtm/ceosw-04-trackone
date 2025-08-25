<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n()

const router = useRouter()
const itemId = ref('')

// const pageName = 'clients'
// const pageTitle = t(`${ pageName }`)

const title = ref('packageList')
const titleI18n = computed(() => t(title.value))
const isLoading = ref(true)

const { getPackages } = usePackage()
const { packages, pending } = await getPackages()

const headers = ref([
  { title: 'trkgNum', key: 'trkgNum' },
  { title: 'Package Date', key: 'createdAt' },
  { title: 'Weight', key: 'weight' },
  { title: 'Client', key: 'wr.client.name' },
  { title: 'WR', key: 'wr.wrId' },
  { title: 'Label', key: 'label' },
  { title: 'CR', key: 'cr.crId' },
  { title: 'Notes', key: 'notes' },
  { title: 'Actions', key: 'actions', sortable: false, width: '90', align: 'center' }
])

const viewItem = async (item:any) => {
  router.push({ path: `/packages/${ item._id }` })
}

onMounted(() => {
  // Simula la carga de datos
  setTimeout(() => {
    isLoading.value = false
  }, 1000)
})

</script>

<template>
  <v-card>
    <v-progress-linear absolute bottom
      height="2"
      :active="isLoading || pending"
      :indeterminate="isLoading || pending"
      color="primary"
    ></v-progress-linear>
    <v-toolbar density="compact">
      <v-toolbar-title>{{ titleI18n }}</v-toolbar-title>
      <PackagesBtnSubmit />
    </v-toolbar>
    
    <!-- @vue-expect-error -->
    <v-data-table density="compact" :headers="headers" :items="packages">

      <template v-slot:[`item.createdAt`]="{ item }">
        <a-data-table-item-created-at :item="item" />
      </template>

      <!-- <template v-slot:[`item.name`]="{ item, value }">
        <v-chip :color="item.color">
          <span>{{ value }}</span>
        </v-chip>
      </template> -->

      <template v-slot:[`item.createdBy`]="{ item, value }">
        <a-data-table-item-created-by :item="item" :value="value" />
      </template>

      <template v-slot:[`item.actions`]="{ item }">

        <!-- <a-data-table-item-action-btn :item="item" :itemId="itemId"
          icon="mdi-circle-outline"
          @on-action="viewItem(item)"
        /> -->

        <PackagesBtnSubmit action="edit" isIconBtn :textOnBtn="false" :itemData="item" />

      </template>
    </v-data-table>
  </v-card>

</template>