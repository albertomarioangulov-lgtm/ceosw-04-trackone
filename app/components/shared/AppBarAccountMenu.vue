<script setup lang="ts">
import { useTheme } from 'vuetify';

const themeCookie = useCookie<string>('theme');

const { signOut, data } = useAuth()
// @ts-expect-error
const { name, email, color, initials, roles, avatar } = data.value!.userData

const iconSize = ref('x-large')

const theme = useTheme();

const iconTheme = computed( () => {
  return theme.global.current.value.dark ? 'mdi:white-balance-sunny' : 'mdi:weather-night'
})
const toggleTheme = () => {
  const newTheme = theme.global.current.value.dark ? 'light' : 'dark';
  theme.global.name.value = newTheme;
  themeCookie.value = newTheme;
}
</script>

<template>
  <v-menu
    min-width="300px"
    rounded
  >
    <template v-slot:activator="{ props }">
      <v-btn icon v-bind="props">
        <!-- <v-avatar color="primary" size="default" variant="tonal">
          <v-icon>mdi-account</v-icon>
        </v-avatar> -->
        <v-avatar :color="color" size="large" variant="tonal">
          <v-icon v-if="avatar" :size="iconSize">mdi-{{ avatar.icon }}</v-icon>
          <v-icon v-else :size="iconSize">mdi-account</v-icon>
        </v-avatar>
      </v-btn>
    </template>
    <v-card>
      <!-- <v-card-text class="mx-0"> -->
        <div class="mt-4 mx-auto text-center">

          <v-avatar :color="color" size="large" variant="tonal">
            <v-icon v-if="avatar" :size="iconSize">mdi-{{ avatar.icon }}</v-icon>
            <v-icon v-else :size="iconSize">mdi-account</v-icon>
          </v-avatar>

          <v-list-item-title class="mx-4">
            <h3>{{ name }}</h3>
          </v-list-item-title>
          <v-list-item-subtitle class="font-italic text-caption">{{ email }}</v-list-item-subtitle>
          <v-list-item-subtitle class="font-italic text-caption">
            <template v-for="role in roles">
              <v-chip size="x-small" :color="role.color" variant="tonal">{{ role.name }}</v-chip>
            </template>
          </v-list-item-subtitle>
        </div>

        <!-- <v-divider class="my-3"></v-divider>
        <v-row class="mx-auto text-center">
          <div class="mx-auto text-center">

            <v-btn variant="text" :icon="iconTheme" @click="toggleTheme"></v-btn>
            <v-btn variant="text" :icon="iconTheme" @click="toggleTheme"></v-btn>
          </div>
        </v-row> -->

        <v-divider class="my-3"></v-divider>

        <div class="mx-auto text-center">
          <v-list class="mx-auto" nav>
            <v-list-item @click.stop="toggleTheme">
              <template v-slot:prepend>
                <Icon size="1.5em" :name="iconTheme" class="mr-3" />
                <span class="text-button">Toggle Theme</span>
              </template>
            </v-list-item>
            <v-list-item @click="signOut({ callbackUrl: '/login' })">
              <template v-slot:prepend>
                <Icon size="1.5em" name="mdi:logout" class="mr-3" />
                <span class="text-button">Logout</span>
              </template>
            </v-list-item>
            <!-- <v-list-item>
              <v-btn rounded variant="text" icon="mdi-logout" @click="signOut({ callbackUrl: '/login' })">
                Logout
              </v-btn>
            </v-list-item> -->
          </v-list>

        </div>


          <!-- <v-btn
            variant="text"
            rounded
          >
            Edit Account
          </v-btn>
          <v-divider class="my-3"></v-divider>
          <v-btn
            variant="text"
            rounded
          >
            Disconnect
          </v-btn> -->
        
      <!-- </v-card-text> -->
    </v-card>
  </v-menu>
</template>