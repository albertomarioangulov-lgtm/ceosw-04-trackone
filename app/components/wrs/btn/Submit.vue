<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { WR } from '~~/app/interfaces/WR';

const { t } = useI18n()
const { hasPermission } = usePermission()

interface Props {
  action?: 'create' | 'edit' | ''
  itemData?: WR
  textOnBtn?: boolean
  isIconBtn?: boolean
}

const props = withDefaults( defineProps<Props>(), {
  action: 'create',
  textOnBtn: true,
  isIconBtn: false
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
const text = ref(t('New WR'))

if (props.action === 'edit') {
  icon.value = 'mdi-pencil-outline'
  color.value = 'warning'
  density.value = 'compact'
  variant.value = 'tonal'
  text.value = t('Edit WR')
}

if (props.isIconBtn) {
  size.value = ''
  

}

const { getWR } = useWR()

const createItem = () => {
  loading.value = true
  dataForm.value = {}
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
  const { data } = await getWR(item._id)
  if(data){
    dataForm.value = data.value as WR
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
  dataForm.value = {}
}

// Function to handle click based on action
const handleClick = (item?: WR) => {
  if (props.action === 'edit' && item) {
    editItem(item)
  } else {
    createItem()
  }
}

</script>

<template>
  <template v-if="hasPermission('manage_wrs')">
    <!-- <template v-if="!(isLoading && itemId === props.itemData?._id)"> -->
      <!-- @vue-expect-error -->
      <v-btn class="ml-1"
        :size
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
            {{ text }}
        </template>
      </v-btn>
    <!-- </template> -->
  </template>

  <!-- <v-progress-circular v-if="isLoading && itemId === props.itemData?._id"
    :indeterminate="isLoading"
    color="warning" size="small" :width="2"
  /> -->

  <WrsForm
    :isOpen="isOpen"
    :action="action"
    @on-close="onClose"
    @on-clear="onClear"
    :data-form="dataForm"
  />
</template>