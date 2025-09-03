<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n()

const router = useRouter()
const itemId = ref('')

// const pageName = 'clients'
// const pageTitle = t(`${ pageName }`)

const title = ref('crList')
const titleI18n = computed(() => t(title.value))
const isLoading = ref(true)
const showSearch = ref(false)

const tableData = ref({ items: [], total: 0 })

const tableOptions = ref({
  page: 1,
  itemsPerPage: 25,
  sortBy: [{ key: 'createdAt', order: 'desc' }],
  search: ''
})

const { getCrs } = useCR()
// const { crs, pending } = await getCrs()

const headers = ref([
  { title: 'crId', key: 'crId' },
  { title: 'CR Date', key: 'createdAt' },
  { title: 'WR', key: 'wr.wrId' },
  { title: 'Client', key: 'wr.client.name' },
  { title: 'Location', key: 'location' },
  { title: 'Address', key: 'wr.client.address' },
  { title: 'Packages', key: 'packageCount', align: 'center' },
  { title: 'By', key: 'createdBy' },
  { title: 'Actions', key: 'actions', sortable: false, width: '90', align: 'center' }
])

const viewItem = async (item:any) => {
  router.push({ path: `/crs/${ item._id }` })
}

const loadItems = async (options:any) => {
  isLoading.value = true
  // Extrae los parámetros de paginación, búsqueda y ordenamiento
  const { page, itemsPerPage, sortBy, search } = options

  const query = {
    page: page?.toString() ?? '1',
    itemsPerPage: itemsPerPage?.toString() ?? '25',
    search: search ?? '',
    sortBy: sortBy?.[0]?.key ?? '',
    sortDesc: sortBy?.[0]?.order === 'desc' ? 'true' : 'false'
  }

  const { crs } = await getCrs(query)
  tableData.value = {
    items: crs?.items ?? [],
    total: crs?.total ?? 0
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
      <!-- <CrsBtnSubmit /> -->
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

      <template v-slot:[`item.location`]="{ item }">
        <Icon size="1.0em" :name="`flagpack:${item.wr.client.country.toLowerCase()}`"></Icon> <span>{{ item.wr.client.country }} - {{ item.wr.client.state }} - {{ item.wr.client.city }}</span>
      </template>

      <template v-slot:[`item.createdBy`]="{ item, value }">
        <a-data-table-item-created-by :item="item" :value="value" />
      </template>

      <template v-slot:[`item.actions`]="{ item }">

        <a-data-table-item-action-btn :item="item" :itemId="itemId"
          icon="mdi-circle-outline"
          @on-action="viewItem(item)"
        />

        <!-- <CrsBtnSubmit action="edit" isIconBtn :textOnBtn="false" :itemData="item" /> -->

      </template>
  
    </v-data-table-server>
  </v-card>

</template>