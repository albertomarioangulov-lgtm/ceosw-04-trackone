<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n()

const router = useRouter()
const itemId = ref('')

// const pageName = 'clients'
// const pageTitle = t(`${ pageName }`)

const title = ref('carrierList')
const titleI18n = computed(() => t(title.value))
const isLoading = ref(true)

const { getCarriers } = useCarrier()
const { carriers, pending } = await getCarriers()

const headers = ref([
  { title: 'Code', key: 'code' },
  { title: 'Name', key: 'name' },
  { title: 'Phone', key: 'phone' },
  // { title: 'Location', key: 'location' },
  { title: 'Email', key: 'email' },
  { title: 'By', key: 'createdBy' },
  { title: 'Actions', key: 'actions', sortable: false, width: '90', align: 'center' }
])

const viewItem = async (item:any) => {
  router.replace({ path: `/carriers/${ item._id }` })
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
      <CarriersBtnSubmit />
    </v-toolbar>
    
    <!-- @vue-expect-error -->
    <v-data-table density="compact" :headers="headers" :items="carriers"
      :hide-default-footer="carriers.length < 11"
    >

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

        <CarriersBtnSubmit action="edit" isIconBtn :textOnBtn="false" :itemData="item" />

      </template>
    </v-data-table>
  </v-card>

</template>