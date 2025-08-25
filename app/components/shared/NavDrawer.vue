<script setup lang="ts">
import { useDisplay } from 'vuetify'

interface UserData {
  name: string
  email: string
  color: string
  initials: string
  roles: { name: string; color: string }[]
  avatar?: { icon: string }
}

interface Emits {
  ( e: 'closeDrawer' ):void
}
const emits = defineEmits<Emits>()

interface Props {
  drawer: boolean
  miniVariant: boolean
}

const props = withDefaults( defineProps<Props>(), {
  drawer: true,
  miniVariant: true
})

const { signOut, data } = useAuth()
// @ts-expect-error
const { name, email, color, initials, roles, avatar } = data.value!.userData

const { drawer, miniVariant } = toRefs(props)

const rail = ref<boolean>(true)

// const iconSize = computed(() => (miniVariant.value && rail.value ? 'small' : 'x-large'))
const iconSize = computed(() => {
  if (miniVariant.value) {
    const sizeR = rail.value ? 'small' : 'x-large'
    return sizeR
  } else {
    return 'x-large'
  }
})

const updateRail = (val:boolean) => {
  rail.value = val
}

const { smAndDown, mdAndUp } = useDisplay()

const isTemporary = computed(() => smAndDown.value)
const isPermanent = computed(() => mdAndUp.value)

</script>

<template>
  <!-- :fixed="true" -->
  <!-- <v-navigation-drawer app fixed permanent absolute -->
    <!-- class="bg-indigo-lighten-5" -->
    <v-navigation-drawer
    v-model="drawer"
    :temporary="isTemporary"
    :permanent="isPermanent"
    :rail="miniVariant"
    :expand-on-hover="miniVariant"
    @update:rail="updateRail"
  >
    <!-- <v-divider></v-divider> -->
    <v-list density="compact" class="pt-0 pb-0">
      <v-list-item link>
        <template v-slot:prepend>
          <v-avatar :color="color" size="large" variant="tonal">
            <v-icon v-if="avatar" :size="iconSize">mdi-{{ avatar.icon }}</v-icon>
            <v-icon v-else :size="iconSize">mdi-account</v-icon>
          </v-avatar>
        </template>
        <!-- <v-list-item-content> -->
          <v-list-item-title>
            {{ name }}
          </v-list-item-title>
          <v-list-item-subtitle class="font-italic text-caption">{{ email }}</v-list-item-subtitle>
          <v-list-item-subtitle class="font-italic text-caption">
            <template v-for="role in roles">
              <v-chip size="x-small" :color="role.color" variant="tonal">{{ role.name }}</v-chip>
            </template>
          </v-list-item-subtitle>
        <!-- </v-list-item-content> -->
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <shared-menu-list
      @close-drawer="emits('closeDrawer')"
    />
    
  </v-navigation-drawer>
</template>