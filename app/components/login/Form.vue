<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core'
import { email, required } from '@vuelidate/validators'
import { nextTick } from 'vue'

const { signIn, status: authStatus, getSession } = useAuth()

interface Emits {
  (e: 'onClose'):void
}

const isLoading = ref<boolean>(false)
const credentialsError = ref<boolean>(false)

const initialState = {
  email: '',
  password: '',
}

const state = reactive({
  ...initialState,
})

const rules = () => ({
  email: { required, email },
  password: { required },
})

const v$ = useVuelidate(rules, state)

const onSubmit = async () => {
  const isFormValid = await v$.value.$validate()

  if (isFormValid) {
    isLoading.value = true

    try {
      const response = await signIn({
        email: state.email,
        password: state.password
      }, { redirect: false, callbackUrl: '/' })
      
      if (response?.error) {
        credentialsError.value = true
      } else {
        isLoading.value = false
        credentialsError.value = false
        
        // Esperamos a que el DOM se estabilice antes de navegar
        await nextTick() 
        await navigateTo('/')
      }
    } catch (error) {
      isLoading.value = false
      credentialsError.value = true
      console.error('Login error:', error)
    } finally {
      isLoading.value = false
    }
  }
}

const emailErrors = computed(() => v$.value.email.$errors.map((e: any) => e.$message))
const passwordErrors = computed(() => v$.value.password.$errors.map((e: any) => e.$message))

</script>

<template>
  <v-form @submit.prevent="onSubmit">
    <v-progress-linear absolute bottom
      :active="isLoading"
      :indeterminate="isLoading"
      color="primary"
    ></v-progress-linear>
      <!-- color="deep-purple-accent-4" -->

    <v-container fluid align="left">
      <v-row>

        <v-col class="d-flex" cols="12" sm="12">
          <v-text-field density="compact"
          v-model="state.email"
          label="Email"
          append-inner-icon="mdi-email-outline"
          @input="v$.email.$touch()"
          @blur="v$.email.$touch()"
          :error-messages="emailErrors"
          ></v-text-field>
        </v-col>

        <v-col class="d-flex" cols="12" sm="12">
          <v-text-field density="compact" type="password"
          v-model="state.password"
          label="Password"
          append-inner-icon="mdi-lock-outline"
          @input="v$.password.$touch()"
          @blur="v$.password.$touch()"
          :error-messages="passwordErrors"
          ></v-text-field>
        </v-col>

      </v-row>
      <!-- <v-alert v-if="credentialsError" variant="tonal" type="error" class="mt-4">{{ credentialsError }}</v-alert> -->

      <v-row class="mt-8 mb-1" align="center" justify="center">
        <v-btn block type="submit"
          color="blue-darken-3"
          variant="elevated"
          size="large"
          :ripple="false"
        >Sign in
          <v-progress-circular :width="1" :size="20" class="ml-2" v-if="isLoading" indeterminate></v-progress-circular>
        </v-btn>
      </v-row>
    </v-container>
  </v-form>

  <client-only>
    <v-dialog
      v-if="credentialsError"
      attach
      transition="dialog-top-transition"
      width="auto"
      v-model="credentialsError"
    >
      <v-card>
        <v-alert
          density="compact"
          variant="tonal"
          border="top"
          type="error"
          title="Credentials Error"
          text="You have made a terrible mistake while entering your credentials"
        >
        
          <v-btn variant="plain" color="light" block @click="credentialsError = false"
          >Close Dialog</v-btn>
  
          <template #prepend>
            <Icon size="2rem" name="line-md:close-circle" />
          </template>
        </v-alert>
      </v-card>
    </v-dialog>
  </client-only>
</template>