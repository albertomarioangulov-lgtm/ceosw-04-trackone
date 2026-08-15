<script setup lang="ts">
const props = defineProps<{ clientId?: string }>()

const { openCreate } = useWRUI()
const { can, PERMISSIONS } = usePermissions()
</script>

<template>
  <v-btn
    v-if="can(PERMISSIONS.WRS_MANAGE)"
    color="primary"
    prepend-icon="mdi-plus"
    @click="openCreate(props.clientId)"
  >
    Nuevo WR
  </v-btn>
</template>
