<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n()

interface Props {
  isOpen: boolean
  action?: 'create' | 'edit' | ''
  resourceName: string
  title?: string
  color?: string
  isLoading: boolean
  width?: string
  // maxWidth?: string
}
interface Emits {
  (e: 'onSubmit'):void
  (e: 'onCancel'):void
}

const props = withDefaults( defineProps<Props>(), {
  isOpen: true,
  action: 'create',
  width: '800',
})
const emits = defineEmits<Emits>()

const capitalizedResourceName = capitalize(props.resourceName)

// Computed properties for dynamic values
const title = computed(() => props.action === 'create'
  ? `new${capitalizedResourceName}`
  : `edit${capitalizedResourceName}`) 
const color = computed(() => props.action === 'create'
  ? 'blue-darken-3'
  : 'warning')

const onSubmit = () => {
  emits('onSubmit')
}
const cancel = () => {
  emits('onCancel')
}

</script>

<template>
  <v-dialog :max-width="props.width" v-model="props.isOpen">
    <v-progress-linear absolute bottom model-value="100" :color="color" :indeterminate="props.isLoading" />
    <v-card>
      <v-toolbar density="compact">
        <v-toolbar-title>{{ t(title) }}</v-toolbar-title>
        <v-spacer />
      </v-toolbar>
      <form @submit.prevent="onSubmit">
        <v-container fluid>

          <slot />

          <v-row class="mb-1 mt-6">
            <v-btn class="mr-4 ml-4" color="success" type="submit" :disabled="isLoading">
              {{ t('submit') }}
            </v-btn>
            <v-btn color="error" type="button" @click="cancel">{{ t('cancel') }}</v-btn>
          </v-row>
        </v-container>
      </form>
    </v-card>
  </v-dialog>
</template>