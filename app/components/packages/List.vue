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
const showSearch = ref(false)

const packagesData = ref({ items: [], total: 0 })

const tableOptions = ref({
  page: 1,
  itemsPerPage: 25,
  sortBy: [],
  search: ''
})

const { getPackages } = usePackage()
// const { packages, pending } = await getPackages()

const headers = ref([
  { title: 'trkgNum', key: 'trkgNum' },
  { title: 'Package Date', key: 'createdAt' },
  { title: 'Weight', key: 'weight' },
  { title: 'Client', key: 'wr.client.name' },
  { title: 'WR', key: 'wr.wrId' },
  { title: 'Label', key: 'label' },
  { title: 'CR', key: 'cr.crId' },
  { title: 'Notes', key: 'notes' },
  { title: 'By', key: 'createdBy' },
  { title: 'Actions', key: 'actions', sortable: false, width: '90', align: 'center' }
])

const viewItem = async (item:any) => {
  router.push({ path: `/packages/${ item._id }` })
}


const loadItems = async (options:any) => {
  isLoading.value = true
  // Extrae los parámetros de paginación, búsqueda y ordenamiento
  // const { page, itemsPerPage, sortBy, search } = options

  const query = {
    page: options.page?.toString() ?? '1',
    itemsPerPage: options.itemsPerPage?.toString() ?? '25',
    search: options.search ?? '',
    sortBy: options.sortBy?.[0]?.key ?? '',
    sortDesc: options.sortBy?.[0]?.order === 'desc' ? 'true' : 'false'
  }

  const { packages } = await getPackages(query)
  packagesData.value = {
    items: packages?.items ?? [],
    total: packages?.total ?? 0
  }
  isLoading.value = false

}

// Create a debounced version of the loadItems function.
// This will wait 500ms after the user stops typing before making the API call.
const debouncedLoadItems = debounce(loadItems, 500)

watch(() => tableOptions.value.search, () => {
  tableOptions.value.page = 1 // Reset to the first page for a new search
  debouncedLoadItems(tableOptions.value)
})


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
      <v-spacer></v-spacer>
      <v-btn icon @click="showSearch = !showSearch" :color="tableOptions.search ? 'primary' : undefined">
        <v-badge dot color="red" :model-value="!!tableOptions.search" offset-x="-1" offset-y="-1">
          <v-icon>{{ tableOptions.search ? 'mdi-filter-variant' : 'mdi-magnify' }}</v-icon>
        </v-badge>
        <v-tooltip activator="parent" location="bottom">
          {{ tableOptions.search ? `Filtering by: "${tableOptions.search}"` : 'Search' }}
        </v-tooltip>
      </v-btn>
      <!-- <PackagesBtnSubmit /> -->
    </v-toolbar>

    <!-- @vue-expect-error -->
    <v-data-table-server
      v-model:options="tableOptions"
      :headers="headers"
      :items="packagesData.items"
      :items-length="packagesData.total"
      :items-per-page="tableOptions.itemsPerPage"
      :loading="isLoading"
      item-value="_id"
      @update:options="loadItems"
    >
      <template v-slot:top>
        <v-expand-transition>
          <div v-if="showSearch">
            <v-text-field class="ma-2"
              v-model="tableOptions.search"
              placeholder="Search..."
              clearable
              autofocus
            ></v-text-field>
          </div>
        </v-expand-transition>
      </template>

      <template v-slot:[`item.wr.client.name`]="{ item }">
        <v-chip v-if="item.wr?.client?._id" :to="`/clients/${item.wr.client._id}`" color="primary" variant="text" size="small" class="font-weight-medium">
          {{ item.wr.client.name }}
        </v-chip>
      </template>

      <template v-slot:[`item.createdAt`]="{ item }">
        <a-data-table-item-created-at :item="item" />
      </template>

      <template v-slot:[`item.createdBy`]="{ item, value }">
        <a-data-table-item-created-by :item="item" :value="value" />
      </template>

      <template v-slot:[`item.actions`]="{ item }">

        <!-- <PackagesBtnSubmit action="edit" isIconBtn :textOnBtn="false" :itemData="item" /> -->

      </template>
  
    </v-data-table-server>
  </v-card>

</template>