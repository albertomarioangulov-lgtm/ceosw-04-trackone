<script setup lang="ts">
const { openCreate } = useUserUI()
const { can, PERMISSIONS } = usePermissions()
</script>

<template>
  <v-btn
    v-if="can(PERMISSIONS.USERS_MANAGE)"
    color="primary"
    prepend-icon="mdi-plus"
    @click="openCreate"
  >
    Nuevo usuario
  </v-btn>
</template>
