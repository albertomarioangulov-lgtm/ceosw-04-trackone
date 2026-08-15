<script setup lang="ts">
const props = defineProps<{ user: Record<string, any> }>()

const { openEdit } = useUserUI()
const { can, PERMISSIONS } = usePermissions()
</script>

<template>
  <v-btn
    v-if="can(PERMISSIONS.USERS_MANAGE)"
    size="small"
    variant="text"
    color="warning"
    icon="mdi-pencil-outline"
    :title="`Editar ${props.user.name || ''}`"
    @click="openEdit(props.user)"
  />
</template>
