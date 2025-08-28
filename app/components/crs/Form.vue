<script setup lang="ts">
import { ref, computed } from 'vue';
import { useVuelidate } from '@vuelidate/core'
import { required, email, minLength, alphaNum, helpers } from '@vuelidate/validators'
import { useI18n } from 'vue-i18n';
import type { WR } from '~~/app/interfaces/WR';

const { t } = useI18n()

interface Props {
  isOpen: boolean
  action?: 'create' | 'edit' | ''
  dataForm: WR
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

const state = ref<WR>({ ...props.dataForm })

// Sincroniza state con dataForm al editar
watch( () => props.dataForm,
  (newVal) => {
    state.value = { ...newVal,
      // contacts: newVal.contacts ? [...newVal.contacts] : []
    }
  }, { deep: true, immediate: true }
)

// const state = ref<User>({ ...props.dataForm })
const isLoading = ref(false)

// Computed properties for dynamic values
const title = computed(() => (props.action === 'create' ? 'New WR' : 'Edit WR'))
const color = computed(() => (props.action === 'create' ? 'blue-darken-3' : 'warning'))

// Validation rules
const rules = () => ({
  name: { required },
  // code: { required, alphaNum, minLength: minLength(2) },
  // fee: { required },
  // email: { email },
})

const v$ = useVuelidate(rules, state)

// Error messages
const getFieldErrors = (field: keyof WR) =>
  v$.value[field]?.$errors.map((e: any) => e.$message) || []

// const getContactFieldErrors = (index: number, field: 'name' | 'position' | 'phone' | 'email') =>
//   v$.value.contacts.$errors.map((e: any) => e.$response.$errors[index]?.[field]?.map((e: any) => e.$message))

const { createWR, updateWR } = useWR()

const processForm = async () => {
  v$.value.$touch()
  if (v$.value.$error) return

  try {
    isLoading.value = true
    let actionProcess
    if( props.action === 'create' ) {
      const { data } = await createWR(state.value)
      actionProcess = data
    } else if ( props.action === 'edit' ) {
      const dataId = state.value._id
      const { data:updatedData } = await updateWR(dataId!, state.value)
      actionProcess = updatedData
      await refreshNuxtData([`wr-${dataId}`])
    }

    if (actionProcess) {
      emits('onClose')
      clearForm()
    }
  } catch (error) {
    console.error('Error processing form:', error)
  } finally {
    await refreshNuxtData(['wr-list'])
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
            <v-col cols="12" sm="8">
              <v-text-field density="compact"
                :label="t('name')"
                v-model="state.name"
                @input="v$.name.$touch()"
                @blur="v$.name.$touch()"
                :error-messages="getFieldErrors('name')"
              />
            </v-col>

            

            <v-col cols="12" sm="3">
              <v-text-field
                :label="t('code')"
                v-model="state.code"
              />
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