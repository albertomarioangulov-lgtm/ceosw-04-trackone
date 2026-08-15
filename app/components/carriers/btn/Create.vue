<script setup lang="ts">
const { openCreate } = useCarrierUI()
const { can, PERMISSIONS } = usePermissions()
</script>

<template>
  <v-btn
    v-if="can(PERMISSIONS.CARRIERS_MANAGE)"
    color="primary"
    prepend-icon="mdi-plus"
    @click="openCreate"
  >
    Nuevo carrier
  </v-btn>
</template>
