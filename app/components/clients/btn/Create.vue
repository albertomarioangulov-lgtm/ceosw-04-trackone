<script setup lang="ts">
const { openCreate } = useClientUI()
const { can, PERMISSIONS } = usePermissions()
</script>

<template>
  <v-btn
    v-if="can(PERMISSIONS.CLIENTS_MANAGE)"
    color="primary"
    prepend-icon="mdi-plus"
    @click="openCreate"
  >
    Nuevo cliente
  </v-btn>
</template>
