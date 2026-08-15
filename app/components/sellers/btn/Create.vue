<script setup lang="ts">
const { openCreate } = useSellerUI()
const { can, PERMISSIONS } = usePermissions()
</script>

<template>
  <v-btn
    v-if="can(PERMISSIONS.SELLERS_MANAGE)"
    color="primary"
    prepend-icon="mdi-plus"
    @click="openCreate"
  >
    Nuevo vendedor
  </v-btn>
</template>
