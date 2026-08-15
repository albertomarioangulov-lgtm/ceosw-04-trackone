<script setup lang="ts">
const props = defineProps<{ carrier: Record<string, any> }>()

const { openEdit } = useCarrierUI()
const { can, PERMISSIONS } = usePermissions()
</script>

<template>
  <v-btn
    v-if="can(PERMISSIONS.CARRIERS_MANAGE)"
    size="small"
    variant="text"
    color="warning"
    icon="mdi-pencil-outline"
    :title="`Editar ${props.carrier.name || ''}`"
    @click="openEdit(props.carrier)"
  />
</template>
