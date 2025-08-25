<script setup lang="ts">
import type { NuxtImg } from '#components'
import { useDisplay } from 'vuetify'

const drawer = ref<boolean>( true )
const miniVariant = ref<boolean>( false )
const item = ref<string>("Item Three")

// Vuetify display helper
const { smAndDown } = useDisplay()

const drawerChange = () => {
  drawer.value = !drawer.value
}
const miniVariantChange = () => {
  miniVariant.value = !miniVariant.value
}

// Function to close the drawer
const closeDrawer = () => {
  if (smAndDown.value) {
    drawer.value = false
  }
}

onMounted(() => {
  // Check if the screen size is small or down
  if (smAndDown.value) {
    drawer.value = false
  } else {
    drawer.value = true
  }
})
</script>

<template>
  <v-app>

    <shared-app-bar
      :drawer="drawer"
      :mini-variant="miniVariant"
      @drawer-change="drawerChange"
      @mini-variant-change="miniVariantChange"
    />

    <shared-nav-drawer
      :drawer="drawer"
      :mini-variant="miniVariant"
      @close-drawer="closeDrawer"
    />
    
    <v-main>
      <v-container fluid class="pt-2">
        <slot />
      </v-container>
    </v-main>
    
    <SharedAppFooter />
  </v-app>
</template>