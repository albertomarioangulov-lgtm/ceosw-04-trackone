<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

interface Props {
  selected: string[]
  wrId: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'created', cr: Record<string, any>): void
}>()

const createCRDialog = ref(false)
const isCreatingCR = ref(false)

async function handleCreateCR() {
  if (props.selected.length === 0) return
  isCreatingCR.value = true
  try {
    const cr = await $fetch('/api/crs', {
      method: 'POST',
      body: { wr: props.wrId, packages: props.selected },
    })
    createCRDialog.value = false
    emit('created', cr)
    // TODO: Implementar notificación de éxito
  }
  catch (error) {
    console.error('Error creating CR:', error)
    // TODO: Implementar notificación de error
  }
  finally {
    isCreatingCR.value = false
  }
}
</script>

<template>
  <v-btn v-if="selected.length > 0" color="primary" variant="tonal" class="mr-2" @click="createCRDialog = true">
    {{ t('Create CR') }} ({{ selected.length }})
  </v-btn>

  <v-dialog v-model="createCRDialog" width="auto">
    <v-card>
      <v-card-title>{{ t('Create CR') }}</v-card-title>
      <v-card-text>
        {{ t(`Are you sure you want to create a CR with ${selected.length} packages?`) }}
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="error" @click="createCRDialog = false">{{ t('Cancel') }}</v-btn>
        <v-btn color="success" :loading="isCreatingCR" @click="handleCreateCR">{{ t('Create') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
