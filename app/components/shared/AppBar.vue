<script setup lang="ts">
import { useTheme } from 'vuetify';

const runConfig  = useRuntimeConfig().public
const clientLogo = ref<any>(runConfig.clientLogo)

const { signOut, data } = useAuth()

// const { name, email, color, initials, roles, avatar } = data.value!.userData
// const { name, email, color, initials, roles, avatar } = data.value!.userData

const title = ref('APM')
const iconSize = ref('x-large')

interface Props {
  drawer?: boolean
  miniVariant?: boolean
}

interface Emits {
  ( e: 'drawerChange' ):void
  ( e: 'miniVariantChange' ):void
}

const props = withDefaults( defineProps<Props>(), {
  drawer: false,
  miniVariant: false
})

const emits = defineEmits<Emits>()

const { drawer, miniVariant } = toRefs(props)


const theme = useTheme()

const iconTheme = computed( () => {
  return theme.global.current.value.dark ? 'mdi:white-balance-sunny' : 'mdi:weather-night'
})
const toggleTheme = (() => {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
})

</script>

<template>
  <v-app-bar app elevation="4" fixed density="comfortable"
  >
  <!-- class="bg-primary" -->
    <template v-slot:prepend>
      <!-- <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon> -->
      <v-app-bar-nav-icon @click.stop="emits('drawerChange')"></v-app-bar-nav-icon>
      <!-- <v-btn icon @click.stop="miniVariant = !miniVariant"> -->
      <v-btn icon @click.stop="emits('miniVariantChange')">
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <!-- <img src="@/assets/logo-min.png" height="40" class=""/> -->
       <!-- <NuxtImg src="/images/ceosw-s-logo.svg" height="45" quality="80"/> -->
       <SharedLogo height="45" />
      <!-- <p class="text-h6 text-left">CEOSW</p> -->

      <template v-if="clientLogo">
        <v-divider vertical class="mx-4" inset></v-divider>
        <!-- <img src="https://tiendaredboston.com/wp-content/uploads/2023/04/SVG-ESCUDO-BIS.svg" height="40" class=""/> -->
        <img :src="clientLogo" height="40" class=""/>
      </template>
      
    </template>

    <!-- <v-app-bar-title>{{ title }}</v-app-bar-title> -->

    <template v-slot:append>
      <!-- <img src="https://tiendaredboston.com/wp-content/uploads/2023/04/SVG-ESCUDO-BIS.svg" height="40" class=""/> -->
      <v-divider vertical class="mx-4" inset></v-divider>
      <SharedAppBarAccountMenu />
    </template>
  </v-app-bar>
</template>