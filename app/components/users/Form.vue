<script setup lang="ts">
import { ref, computed } from 'vue';
import { useVuelidate } from '@vuelidate/core'
import { required, email, sameAs } from '@vuelidate/validators'
import { useI18n } from 'vue-i18n';

import type { User } from '~~/app/interfaces/User';

const { t } = useI18n()

interface Props {
  isOpen: boolean
  action?: 'create' | 'edit' | ''
  dataForm: User
}
interface Emits {
  (e: 'onClose'):void
  (e: 'onClear'):void
}

const props = withDefaults( defineProps<Props>(), {
  isOpen: true,
  action: 'create'
})
const emits = defineEmits<Emits>()

const { dataForm: state } = toRefs(props)
// const { dataForm } = toRefs(props)
// const isLoading = ref<boolean>(false)

// const state = ref<User>({ ...props.dataForm })

// Sincroniza state con dataForm al editar
// watch( () => props.dataForm,
//   (newVal) => {
//     state.value = { ...newVal }
//   }, { deep: true, immediate: true }
// )

const isLoading = ref(false)

// Computed properties for dynamic values
const title = computed(() => (props.action === 'create' ? 'New User' : 'Edit User'))
const color = computed(() => (props.action === 'create' ? 'blue-darken-3' : 'warning'))

const passRule = computed(() => {
  switch (props.action) {
    case 'create': return { required }
    case 'edit': return {}
  }
})

// Validation rules
const rules = () => ({
  name: { required },
  username: { required },
  initials: { required },
  email: { required, email },
  password: passRule.value,
  confirmPassword: {
    sameAsPassword: sameAs(state.value.password),
  },
})

const v$ = useVuelidate(rules, state)

// Error messages
const getFieldErrors = (field: keyof User) =>
  v$.value[field]?.$errors.map((e: any) => e.$message) || []

const { createUser, updateUser, getUser } = useUser()

const processForm = async () => {
  v$.value.$touch()
  if (v$.value.$error) return

  try {
    isLoading.value = true
    let actionProcess
    if( props.action === 'create' ) {
      const { data } = await createUser(state.value)
      actionProcess = data
    } else if ( props.action === 'edit' ) {
      const dataId = state.value._id
      const { data:updatedData } = await updateUser(dataId, state.value)
      actionProcess = updatedData
      // const { data:userData } = await getUser(dataId!)
      await refreshNuxtData([`user-${dataId}`])
      // refresh()
    }

    if (actionProcess) {
      emits('onClose')
      clearForm()
    }
  } catch (error) {
    console.error('Error processing form:', error)
  } finally {
    await refreshNuxtData(['users-list'])
    isLoading.value = false
  }
}

// Cancel form
const cancel = () => {
  clearForm()
  emits('onClose')
  isLoading.value = false
}

// Clear form and reset validation
const clearForm = () => {
  v$.value.$reset()
  emits('onClear')
}

</script>

<template>
  <v-dialog max-width="800"
    v-model="props.isOpen"
  >
    <v-progress-linear absolute bottom
      model-value="100"
      :color="color"
      :indeterminate="isLoading"
    ></v-progress-linear>
    
    <v-card>
      <v-toolbar density="compact">
        <v-toolbar-title>{{ t(`${title}`) }}</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <form @submit.prevent="processForm">
        <v-container fluid>
          <v-row>
            <v-col cols="12" sm="5">
              <v-text-field density="compact"
                label="Name"
                v-model="state.name"
                @input="v$.name.$touch()"
                @blur="v$.name.$touch()"
                :error-messages="getFieldErrors('name')"
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="5">
              <v-text-field density="compact"
                label="Username"
                v-model="state.username"
                @input="v$.username.$touch()"
                @blur="v$.username.$touch()"
                :error-messages="getFieldErrors('username')"
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="2">
              <v-text-field density="compact"
                label="Initials"
                v-model="state.initials"
                @input="v$.initials.$touch()"
                @blur="v$.initials.$touch()"
                :error-messages="getFieldErrors('initials')"
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="6">
              <v-text-field density="compact" type="password"
                label="Password"
                v-model="state.password"
                @input="v$.password.$touch()"
                @blur="v$.password.$touch()"
                :error-messages="getFieldErrors('password')"
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="6">
              <v-text-field density="compact" type="password"
                label="Confirm Password"
                v-model="state.confirmPassword"
                @input="v$.confirmPassword.$touch()"
                @blur="v$.confirmPassword.$touch()"
                :error-messages="getFieldErrors('confirmPassword')"
                ></v-text-field>
            </v-col>

            <v-col cols="12" sm="12">
              <v-text-field density="compact"
                label="E-mail"
                v-model="state.email"
                @input="v$.email.$touch()"
                @blur="v$.email.$touch()"
                :error-messages="getFieldErrors('email')"
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="12">
              <v-text-field density="compact"
                label="Roles"
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="12">
              <v-color-input
                label="Color"
                v-model="state.color"
                mode="hexa"
                :base-color="state.color"
                :color="state.color"
                :icon-color="true"
                append-inner-icon="mdi-palette"
                ></v-color-input>
            </v-col>

          </v-row>

          <v-row class="mb-1 mt-6">
            <v-btn class="mr-4 ml-4" color="success" type="submit" :disabled="isLoading">Submit</v-btn>
            <v-btn color="error" @click="cancel">Cancel</v-btn>
          </v-row>
        </v-container>
      </form>
    </v-card>
  </v-dialog>
</template>