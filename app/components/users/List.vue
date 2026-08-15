<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n()

const title = ref('userList')
const isLoading = ref(true)

const { getUsers } = useUser()
const { users, pending } = await getUsers()

const headers = ref([
  { title: 'Created Date', key: 'createdAt', width: '150' },
  { title: 'Name', key: 'name' },
  { title: 'Username', key: 'username' },
  { title: 'Email', key: 'email' },
  { title: 'Color', key: 'color' },
  { title: 'Roles', key: 'roles' },
  { title: 'By', key: 'createdBy' },
  { title: 'Actions', key: 'actions', sortable: false, width: '120' }
])

onMounted(() => {
  // Simula la carga de datos
  setTimeout(() => {
    isLoading.value = false
  }, 1000)
})

</script>

<template>
  <v-card>
    <v-progress-linear absolute bottom
      height="2"
      :active="isLoading || pending"
      :indeterminate="isLoading || pending"
      color="primary"
    ></v-progress-linear>
    <v-toolbar density="compact">
      <v-toolbar-title>{{ t(`${title}`) }}</v-toolbar-title>
      <UsersBtnSubmit />
    </v-toolbar>
    
    <v-data-table density="compact" :headers="headers" :items="users"
      :hide-default-footer="users.length < 11"
    >

      <template v-slot:[`item.createdAt`]="{ item }">
        <a-data-table-item-created-at :item="item" />
      </template>

      <template v-slot:[`item.name`]="{ item, value }">
        <!-- @vue-expect-error -->
        <v-chip :color="item.color">
          <!-- @vue-expect-error -->
          <v-icon v-if="item.avatar" class="mr-2">
            <!-- @vue-expect-error -->
            mdi-{{ item.avatar.icon }}
          </v-icon>
          <span>{{ value }}</span>
        </v-chip>
      </template>

      <template v-slot:[`item.color`]="{ item, value }">
        <template v-if="value">
          <v-icon :color="value">mdi-circle</v-icon>
        </template>
      </template>

      <template v-slot:[`item.roles`]="{ item }">
        <!-- @vue-expect-error -->
        <v-chip size="small" color="warning" v-for="(rol, index) in item.roles" :key="index" class="mr-1">
          {{ rol.name ?? rol }}
        </v-chip>
      </template>

      <template v-slot:[`item.createdBy`]="{ item, value }">
        <a-data-table-item-created-by :item="item" :value="value" />
      </template>

      <template v-slot:[`item.actions`]="{ item }">

        <UsersBtnSubmit action="edit" :textOnBtn="false" :itemData="item" />

      </template>
    </v-data-table>
  </v-card>

</template>
