<script setup lang="ts">
const props = defineProps<{ client: Record<string, any> }>()

const { openEdit } = useClientUI()
const { can, PERMISSIONS } = usePermissions()
</script>

<template>
  <v-btn
    v-if="can(PERMISSIONS.CLIENTS_MANAGE)"
    size="small"
    variant="text"
    color="warning"
    icon="mdi-pencil-outline"
    :title="`Editar ${props.client.name || ''}`"
    @click="openEdit(props.client)"
  />
</template>
