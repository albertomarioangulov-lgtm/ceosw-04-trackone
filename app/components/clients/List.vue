<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n()

const router = useRouter()
const itemId = ref('')

// const pageName = 'clients'
// const pageTitle = t(`${ pageName }`)

const title = ref('clientList')
const titleI18n = computed(() => t(title.value))
const isLoading = ref(true)

const tableData = ref({ items: [], total: 0 })
const tableOptions = ref({
  page: 1,
  itemsPerPage: 25,
  sortBy: [],
  search: ''
})

const { getClients } = useClient()
// const { clients, pending } = await getClients()

const headers = ref([
  { title: 'Name', key: 'name' },
  { title: 'Pobox', key: 'pobox', width: '120' },
  { title: 'Phone', key: 'phone' },
  { title: 'Location', key: 'location' },
  { title: 'Address', key: 'address' },
  // { title: 'By', key: 'createdBy' },
  { title: 'Actions', key: 'actions', sortable: false, width: '90', align: 'center' }
])
const viewItem = async (item:any) => {
  // router.replace({ path: `/clients/${ item._id }` })
  router.push({ path: `/clients/${ item._id }` })
}

const zerofillpoboxid = (item:any) => {
  if (item == null) return '0000'
  return item.toString().padStart(4, '0')
}

const loadItems = async (options:any) => {
  isLoading.value = true

  const { page, itemsPerPage, sortBy, search } = options

  const sortParam = sortBy.length > 0 ? `${ sortBy[0].desc ? '-' : '' }${ sortBy[0].key }` : ''

  const query = {
    page: options.page?.toString() ?? '1',
    itemsPerPage: options.itemsPerPage?.toString() ?? '25',
    search: options.search ?? '',
    sortBy: options.sortBy?.[0]?.key ?? '',
    sortDesc: options.sortBy?.[0]?.order === 'desc' ? 'true' : 'false'
  }

  const { clients } = await getClients(query)

  tableData.value = {
    items: clients.items ?? [],
    total: clients.total ?? 0
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
      <!-- <ClientsBtnSubmit /> -->
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
        <v-text-field
          v-model="tableOptions.search"
          class="ma-2"
          density="compact"
          placeholder="Search..."
          hide-details
        ></v-text-field>
      </template>

      <template v-slot:[`item.pobox`]="{ item, value }">
        <span>{{ item.seller.code }} - {{ zerofillpoboxid(item.poboxid) }}</span>
      </template>
      
      <template v-slot:[`item.actions`]="{ item }">

        <a-data-table-item-action-btn :item="item" :itemId="itemId"
          icon="mdi-circle-outline"
          @on-action="viewItem(item)"
        />

        <!-- <ClientsBtnSubmit action="edit" isIconBtn :textOnBtn="false" :itemData="item" /> -->

      </template>
  
    </v-data-table-server>
    
  </v-card>

</template>