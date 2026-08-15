<script setup lang="ts">
const props = defineProps<{ seller: Record<string, any> }>()

const { openEdit } = useSellerUI()
const { can, PERMISSIONS } = usePermissions()
</script>

<template>
  <v-btn
    v-if="can(PERMISSIONS.SELLERS_MANAGE)"
    size="small"
    variant="text"
    color="warning"
    icon="mdi-pencil-outline"
    :title="`Editar ${props.seller.name || ''}`"
    @click="openEdit(props.seller)"
  />
</template>
