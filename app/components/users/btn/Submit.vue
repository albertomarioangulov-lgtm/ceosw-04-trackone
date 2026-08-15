<script setup lang="ts">
import type { User } from '~~/app/interfaces/User';
import { useI18n } from 'vue-i18n';

const { t } = useI18n()

interface Props {
  action?: 'create' | 'edit' | ''
  itemData?: User
  textOnBtn?: boolean
}

const props = withDefaults( defineProps<Props>(), {
  action: 'create',
  textOnBtn: true
})

// const { action } = toRefs(props)

const isOpen = ref<boolean>(false)
const action = ref()
const isLoading = ref(false)
const itemId = ref('')
const dataForm = ref({})
const icon = ref('mdi-plus')
const color = ref('primary')
const density = ref('default')
const variant = ref('text')
const size = ref('default')
const loading = ref(false)

if (props.action === 'edit') {
  icon.value = 'mdi-pencil-outline'
  color.value = 'warning'
  density.value = 'compact'
  variant.value = 'tonal'
  size.value = ''
}

const { getUser } = useUser()

const createItem = () => {
  loading.value = true
  dataForm.value = { roles: [] }
  action.value = 'create'
  isOpen.value = true
  setTimeout(() => {
    loading.value = false
  }, 400)
}

const editItem = async (item:any) => {
  loading.value = true
  isLoading.value = true
  itemId.value = item._id
  const { data } = await getUser(item._id)
  if(data){
    dataForm.value = data.value as User
    action.value = 'edit'
    isOpen.value = true
    setTimeout(() => {
      loading.value = false
      isLoading.value = false
    }, 400)
  }
}

const onClose = () => {
  isOpen.value = false
}
const onClear = () => {
  dataForm.value = { roles: [] }
}

// Function to handle click based on action
const handleClick = (item?: User) => {
  if (props.action === 'edit' && item) {
    editItem(item)
  } else {
    createItem()
  }
}

</script>

<template>

  <template v-if="!(isLoading && itemId === props.itemData?._id)">
    <!-- @vue-expect-error -->
    <v-btn class="ml-1"
      :size
      density="compact"
      :color
      :loading
      :variant
      :prepend-icon="icon"
      @click="handleClick(props.itemData)"
    >
      <template v-slot:prepend>
        <v-icon></v-icon>  
      </template>

      <template v-if="props.textOnBtn">
          {{ props.action === 'edit' ? t('Edit User') : t('New User') }}
      </template>
    </v-btn>
  </template>

  <v-progress-circular v-if="isLoading && itemId === props.itemData?._id"
    :indeterminate="isLoading"
    color="warning" size="small" :width="2"
  />

  <users-form
    :isOpen="isOpen"
    :action="action"
    @on-close="onClose"
    @on-clear="onClear"
    :data-form="dataForm"
  />
</template>
