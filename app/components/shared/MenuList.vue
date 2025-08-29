<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n()
const { hasPermission } = usePermission()

interface Emits {
  ( e: 'closeDrawer' ):void
}
const emits = defineEmits<Emits>()

interface MenuChild {
  title: string
  path: string
  nuxtIcon?: string
  icon?: string
  permission?: string[] | string
}

interface MenuItem extends MenuChild {
  children?: MenuChild[]
}

const menu = ref<MenuItem[]>([
  { title: 'welcome', path: '/', icon: 'mdi-apps' , nuxtIcon: 'ic:twotone-dashboard', permission: undefined },
  { title: 'config', path: '#', nuxtIcon: 'ic:outline-settings', permission: undefined,
    children: [
      { title: 'users', path: '/users', nuxtIcon: 'ic:outline-person', permission: 'manage_users' },
      { title: 'sellers', path: '/sellers', nuxtIcon: 'ic:outline-map', permission: ['manage_sellers', 'view_sellers'] },
      { title: 'carriers', path: '/carriers', nuxtIcon: 'mdi:truck-outline', permission: ['manage_carriers', 'view_carriers'] },
    ]
  },
  
  { title: 'clients', path: '/clients', nuxtIcon: 'ic:outline-handshake', permission: ['manage_clients','view_clients'] },
  { title: 'packages', path: '/packages', nuxtIcon: 'mdi:package-variant-closed', permission: ['manage_packages', 'view_packages'] },
  { title: 'Warehouse Receipts', path: '/wrs', nuxtIcon: 'mdi:location-enter', permission: ['manage_wrs', 'view_wrs'] },
  { title: 'Cargo Releases', path: '/crs', nuxtIcon: 'mdi:location-exit', permission: ['manage_crs', 'view_crs'] },
])

// Controla el estado abierto de los grupos
const openGroups = ref<{ [key: number]: boolean }>({})

function toggleGroup(i: number) {
  openGroups.value[i] = !openGroups.value[i]
}
</script>

<template>
  

  <v-list nav density="compact">
    <template v-for="(item, i) in menu" :key="i">
      <!-- Si el item tiene hijos, usa v-list-group -->
      <v-list-group
        v-if="item.children && hasPermission(item.permission)"
        v-model="openGroups[i]"
        no-action
      >
        <template #activator="{ props }">
          <v-list-item v-bind="props" @click="toggleGroup(i)">
            <template #prepend>
              <Icon v-if="item.nuxtIcon" size="1.5em" :name="item.nuxtIcon" class="mr-6" />
              <v-icon v-else-if="item.icon">{{ item.icon }}</v-icon>
            </template>
            <v-list-item-title class="text-capitalize">{{ t(item.title) }}</v-list-item-title>
          </v-list-item>
        </template>
        <!-- Renderiza los hijos -->
        <template v-for="(child, j) in item.children" :key="j">
          <v-list-item class="menu-child"
            v-if="hasPermission(child.permission)"
            link router exact
            @click="emits('closeDrawer')"
            :to="child.path"
            color="primary"
          >
            <template #prepend>
              <Icon v-if="child.nuxtIcon" size="1.5em" :name="child.nuxtIcon" class="mr-6" />
              <v-icon v-else-if="child.icon">{{ child.icon }}</v-icon>
            </template>
            <v-list-item-title class="text-capitalize">{{ t(child.title) }}</v-list-item-title>
          </v-list-item>
        </template>
      </v-list-group>
      <!-- Si no tiene hijos, renderiza como item normal -->
      <v-list-item
        v-else-if="hasPermission(item.permission)"
        link router exact
        @click="emits('closeDrawer')"
        :to="item.path"
        color="primary"
      >
        <template #prepend>
          <Icon v-if="item.nuxtIcon" size="1.5em" :name="item.nuxtIcon" class="mr-6" />
          <v-icon v-else-if="item.icon">{{ item.icon }}</v-icon>
        </template>
        <v-list-item-title class="text-capitalize">{{ t(item.title) }}</v-list-item-title>
      </v-list-item>
      
    </template>
  </v-list>
</template>

<style scoped> 
.v-list :deep(.menu-child) {
  padding-inline-start: 24px !important;
}
</style>