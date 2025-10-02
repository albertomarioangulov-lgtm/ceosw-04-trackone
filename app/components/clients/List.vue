<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { lastMessage } = useWebSocket()

const { t } = useI18n()

const router = useRouter()
const itemId = ref('')

// const pageName = 'clients'
// const pageTitle = t(`${ pageName }`)

const title = ref('clientList')
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

const { getClients } = useClient()
// const { clients, pending } = await getClients()

const headers = ref([
  { title: 'Name', key: 'name' },
  { title: 'Pobox', key: 'pobox', width: '120' },
  { title: 'Phone', key: 'phone' },
  { title: 'Location', key: 'location' },
  { title: 'Address', key: 'address' },
  { title: 'By', key: 'createdBy' },
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

  const query = {
    page: options.page?.toString() ?? '1',
    itemsPerPage: options.itemsPerPage?.toString() ?? '25',
    search: options.search ?? '',
    sortBy: options.sortBy?.[0]?.key ?? '',
    sortDesc: options.sortBy?.[0]?.order === 'desc' ? 'true' : 'false'
  }

  const { clients } = await getClients(query)

  tableData.value = {
    items: clients?.items ?? [],
    total: clients?.total ?? 0
  }

  isLoading.value = false
}

const onSuccess = () => {
  // After creating or editing a client, reset the view to ensure the changes are visible.
  // If a search filter is active, clearing it is the safest way to ensure the user
  // sees the updated item, as it might not match the old search term anymore.
  if (tableOptions.value.search) {
    tableOptions.value.search = ''
  } else {
    // If there was no search, the watch won't be triggered.
    // Manually reset the page to 1 and reload the data.
    tableOptions.value.page = 1
    loadItems(tableOptions.value)
  }
}


const debouncedLoadItems = debounce(loadItems, 500)

watch(() => tableOptions.value.search, () => {
  tableOptions.value.page = 1 // Reset to the first page for a new search
  debouncedLoadItems(tableOptions.value)
})

watch(lastMessage, (newMessage) => {
  // Refresca la lista si se crea O actualiza un cliente
  if (['CLIENT_CREATED', 'CLIENT_UPDATED', 'CLIENT_DELETED'].includes(newMessage?.type)) {
    console.log(`WebSocket event received: ${newMessage.type}. Refreshing client list...`)
    loadItems(tableOptions.value)
  }
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

      <ClientsBtnSubmit @onSuccess="onSuccess" />
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

      <template v-slot:[`item.pobox`]="{ item, value }">
        <span v-if="item.seller">{{ item.seller.code }} - {{ zerofillpoboxid(item.poboxid) }}</span>
      </template>

      <template v-slot:[`item.location`]="{ item }">
        <template v-if="item.country">
          <Icon size="1.0em" :name="`flagpack:${item.country.toLowerCase()}`"></Icon>
          <span class="ml-1">{{ item.country }} - {{ item.state }} - {{ item.city }}</span>
        </template>
      </template>

      <template v-slot:[`item.createdBy`]="{ item, value }">
        <a-data-table-item-created-by :item="item" :value="value" />
      </template>
      
      <template v-slot:[`item.actions`]="{ item }">

        <a-data-table-item-action-btn :item="item" :itemId="itemId"
          icon="mdi-circle-outline"
          @on-action="viewItem(item)"
        />

        <ClientsBtnSubmit action="edit" isIconBtn :textOnBtn="false" :itemData="item" @onSuccess="onSuccess" />

      </template>
  
    </v-data-table-server>
    
  </v-card>

</template>