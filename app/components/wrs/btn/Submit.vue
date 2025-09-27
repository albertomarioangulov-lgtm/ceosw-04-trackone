<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { WR } from '~~/app/interfaces/WR';

const { t } = useI18n()
const { hasPermission } = usePermission()

interface Props {
  action?: 'create' | 'edit' | 'addPackages' | ''
  itemData?: WR
  textOnBtn?: boolean
  isIconBtn?: boolean
  btnText?: string
  btnIcon?: string
  btnColor?: string
}

// const emit = defineEmits(['onWrCreated'])

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
const icon = ref(props.btnIcon || 'mdi-plus')
const color = ref(props.btnColor || 'primary')
const density = ref('default')
const variant = ref('text')
const size = ref('default')
const loading = ref(false)
const text = ref(props.btnText ? t(props.btnText) : t('New WR'))

if (props.action === 'edit' || props.action === 'addPackages') {
  icon.value = props.btnIcon || (props.action === 'addPackages' ? 'mdi-package-variant-plus' : 'mdi-pencil-outline')
  color.value = props.btnColor || (props.action === 'addPackages' ? 'info' : 'warning')
  density.value = 'compact'
  variant.value = 'tonal'
  text.value = props.btnText ? t(props.btnText) : (props.action === 'addPackages' ? t('Add Packages') : t('Edit WR'))
}

// if (props.isIconBtn) {
//   size.value = ''
// }

const { getWR } = useWR()

const createItem = () => {
  loading.value = true
  dataForm.value = { client: props.itemData?.client || '' }
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
  if (data) {
    const wrData = data.value as WR
    if (props.action === 'addPackages') {
      wrData.packages = [] // Clear packages for the "Add Packages" action
    }
    dataForm.value = wrData
    action.value = props.action
    isOpen.value = true
    setTimeout(() => {
      loading.value = false
      isLoading.value = false
    }, 400)
  }
}

const onWrCreated = () => {
  // emit('onWrCreated')
}

const onClose = () => {
  isOpen.value = false
}
const onClear = () => {
  dataForm.value = {}
}

// Function to handle click based on action
const handleClick = (item?: WR) => {
  if ((props.action === 'edit' || props.action === 'addPackages') && item) {
    editItem(item)
  } else {
    createItem()
  }
}

</script>

<template>
  <template v-if="hasPermission('manage_wrs')">
    <!-- <template v-if="!(isLoading && itemId === props.itemData?._id)"> -->
      <!-- :size="size" -->
      <!-- :variant="variant" -->
      <!-- :density="density" -->
      <v-btn
        :color="color"
        :loading="loading"
        :icon="props.isIconBtn"
        @click="handleClick(props.itemData)"
      >
        <!-- Render icon explicitly for icon buttons -->
        <v-icon v-if="props.isIconBtn" :icon="icon" />

        <!-- Use prepend slot for regular buttons with icon -->
        <template v-if="!props.isIconBtn" #prepend>
          <v-icon :icon="icon" />
        </template>

        <span v-if="!props.isIconBtn && props.textOnBtn">
          {{ text }}
        </span>
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
    <!-- @on-wr-created="onWrCreated" -->
</template>