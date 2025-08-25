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

// const itemsPerPage = ref(20)
// const search = ref('')
const packagesData = ref({ items: [], total: 0 })

const tableOptions = ref({
  page: 1,
  itemsPerPage: 10,
  sortBy: [],
  search: ''
})

const { getPackages } = usePackage()
// const { packages, pending } = await getPackages()

// type PackagesResult = {
//   items: any[]; // Replace 'any' with your Package type if available
//   total: number;
// }

// const { packages, pending } = await getPackages({
//   page: '1',
//   itemsPerPage: itemsPerPage.value.toString(),
//   search: search.value,
//   sortBy: '',
// }) as { packages: Ref<PackagesResult>; pending: Ref<boolean> };

// packagesData.value = {
//   items: (packages.value as PackagesResult).items ?? [],
//   total: (packages.value as PackagesResult).total ?? 0
// }

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

// watch(itemsPerPage, (val) => {
//   loadItems({
//     page: 1,
//     itemsPerPage: val,
//     sortBy: [],
//     search: search.value
//   })
// })



const loadItems = async (options:any) => {
  isLoading.value = true
  // Extrae los parámetros de paginación, búsqueda y ordenamiento
  // const { page, itemsPerPage, sortBy, search } = options

  // Construye la query para el backend
  // const query = new URLSearchParams({
  //   page: page?.toString() ?? '1',
  //   itemsPerPage: itemsPerPage?.toString() ?? '10',
  //   search: search ?? '',
  //   sortBy: sortBy?.[0]?.key ?? '',
  //   sortDesc: sortBy?.[0]?.order === 'desc' ? 'true' : 'false'
  // }).toString()
  const query = {
    page: options.page?.toString() ?? '1',
    itemsPerPage: options.itemsPerPage?.toString() ?? '10',
    search: options.search ?? '',
    sortBy: options.sortBy?.[0]?.key ?? '',
    sortDesc: options.sortBy?.[0]?.order === 'desc' ? 'true' : 'false'
  }

  const { packages, refresh} = await getPackages(query)
  // const queryString = new URLSearchParams(query).toString()
  // const response = await $fetch(`/api/packages?${queryString}`)
  // console.log('response', response)
  // packagesData.value = result.packages.value
  packagesData.value = {
    items: packages.value.items ?? [],
    total: packages.value.total ?? 0
  }
  isLoading.value = false

}



onMounted(() => {

  loadItems(tableOptions.value)

  // Simula la carga de datos
  // setTimeout(() => {
  //   isLoading.value = false
  // }, 1000)
})

</script>

<template>
  <v-card>
    <v-progress-linear absolute bottom
      height="2"
      :active="isLoading"
      :indeterminate="isLoading"
      color="primary"
    ></v-progress-linear>
    <v-toolbar density="compact">
      <v-toolbar-title>{{ titleI18n }}</v-toolbar-title>
      <PackagesBtnSubmit />
    </v-toolbar>

    <!-- @vue-expect-error -->
    <v-data-table-server
      v-model:options="tableOptions"
      :headers="headers"
      :items="packagesData.items"
      :items-length="packagesData.total"
      :loading="isLoading"
      item-value="_id"
      @update:options="loadItems"
    ></v-data-table-server>
    
    <!-- @vue-expect-error -->
    <!-- <v-data-table density="compact" :headers="headers" :items="packages.items"
      :server-items-length="packages.total" server
    >

      <template v-slot:[`item.createdAt`]="{ item }">
        <a-data-table-item-created-at :item="item" />
      </template>

      <template v-slot:[`item.createdBy`]="{ item, value }">
        <a-data-table-item-created-by :item="item" :value="value" />
      </template>

      <template v-slot:[`item.actions`]="{ item }">

        <PackagesBtnSubmit action="edit" isIconBtn :textOnBtn="false" :itemData="item" />

      </template>
    </v-data-table> -->
  </v-card>

</template>