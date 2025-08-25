<template>
  <!-- <v-container class="fill-height" fluid> -->
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card>
          <v-card-title class="text-h5">Iniciar sesión</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="loginWithCredentials">
              <v-text-field
                v-model="email"
                label="Correo"
                type="email"
                required
                prepend-inner-icon="mdi-email"
              />
              <v-text-field
                v-model="password"
                label="Contraseña"
                type="password"
                required
                prepend-inner-icon="mdi-lock"
              />
              <v-btn type="submit" color="primary" block>Entrar</v-btn>
            </v-form>
            <v-divider class="my-4" />
            <v-btn color="red darken-1" block @click="loginWithGoogle">
              <v-icon left>mdi-google</v-icon>
              Entrar con Google
            </v-btn>
            <v-alert v-if="error" type="error" class="mt-4">{{ error }}</v-alert>
            <v-alert v-if="status === 'authenticated'" type="success" class="mt-4">
              Bienvenido, {{ data?.user?.name || data?.user?.email }}
              <v-btn size="small" @click="signOut" class="ml-2">Cerrar sesión</v-btn>
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  <!-- </v-container> -->
</template>

<script setup lang="ts">
import { ref } from 'vue'
// import { useAuth } from '#auth'
// import { useAuth } from 'next-auth'

const { signIn, status, data, signOut } = useAuth()
const email = ref('')
const password = ref('')
const error = ref('')

const loginWithCredentials = async () => {
  error.value = ''
  const result = await signIn('credentials', {
    email: email.value,
    password: password.value,
    redirect: false
  })
  if (result?.error) {
    error.value = 'Credenciales incorrectas'
  }
}

const loginWithGoogle = () => {
  signIn('google')
}
</script>