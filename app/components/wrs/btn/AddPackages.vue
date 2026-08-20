<script setup lang="ts">
const props = defineProps<{
  wr: Record<string, any>
  client?: Record<string, any>
}>()

const { openAddPackages } = useWRUI()
const { can, PERMISSIONS } = usePermissions()
</script>

<template>
  <v-btn
    v-if="can(PERMISSIONS.WRS_MANAGE)"
    size="small"
    variant="text"
    color="info"
    icon="mdi-package-variant-plus"
    :title="`Agregar paquetes al WR ${props.wr.wrId || ''}`"
    @click="openAddPackages(props.wr, props.client)"
  />
</template>
