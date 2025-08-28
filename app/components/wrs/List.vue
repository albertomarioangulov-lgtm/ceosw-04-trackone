<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n()

const router = useRouter()
const itemId = ref('')

// const pageName = 'clients'
// const pageTitle = t(`${ pageName }`)

const title = ref('wrList')
const titleI18n = computed(() => t(title.value))
const isLoading = ref(true)
const showSearch = ref(false)

const tableData = ref({ items: [], total: 0 })
const tableOptions = ref({
  page: 1,
  itemsPerPage: 25,
  sortBy: [],
  search: ''
})

const { getWrs } = useWR()
// const { wrs, pending } = await getWrs()

const headers = ref([
  { title: 'wrId', key: 'wrId' },
  { title: 'WR Date', key: 'createdAt' },
  { title: 'Client', key: 'client.name' },
  // { title: 'Location', key: 'location' },
  { title: 'Address', key: 'client.address' },
  { title: 'By', key: 'createdBy' },
  { title: 'Actions', key: 'actions', sortable: false, width: '90', align: 'center' }
])

const viewItem = async (item:any) => {
  router.push({ path: `/wrs/${ item._id }` })
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

  const { wrs } = await getWrs(query)
  tableData.value = {
    items: wrs?.items ?? [],
    total: wrs?.total ?? 0
  }
  isLoading.value = false

}

const debouncedLoadItems = debounce(loadItems, 500)

watch(() => tableOptions.value.search, () => {
  tableOptions.value.page = 1 // Reset to the first page for a new search
  debouncedLoadItems(tableOptions.value)
})

onMounted(() => {
  loadItems(tableOptions.value)
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
      <!-- <WrsBtnSubmit /> -->
    </v-toolbar>

    <!-- @vue-expect-error -->
    <v-data-table-server
      v-model:options="tableOptions"
      :headers="headers"
      :items="tableData.items"
      :items-length="tableData.total"
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
    
    <!-- @vue-expect-error -->
    <!-- <v-data-table density="compact" :headers="headers" :items="wrs">

      <template v-slot:[`item.createdAt`]="{ item }">
        <a-data-table-item-created-at :item="item" />
      </template>

      <template v-slot:[`item.createdBy`]="{ item, value }">
        <a-data-table-item-created-by :item="item" :value="value" />
      </template>

      <template v-slot:[`item.actions`]="{ item }">

        <a-data-table-item-action-btn :item="item" :itemId="itemId"
          icon="mdi-circle-outline"
          @on-action="viewItem(item)"
        />

      </template>
    </v-data-table> -->
  </v-card>

</template>