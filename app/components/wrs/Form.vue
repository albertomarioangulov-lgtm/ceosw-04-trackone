<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useVuelidate } from '@vuelidate/core'
import { required, email, minLength, alphaNum, helpers } from '@vuelidate/validators'
import { useI18n } from 'vue-i18n';
import type { WR } from '~~/app/interfaces/WR';
import type { Client } from '~~/app/interfaces/Client';

const { t } = useI18n()

interface Props {
  isOpen: boolean
  action?: 'create' | 'edit' | 'addPackages' | ''
  dataForm: WR
}
interface Emits {
  (e: 'onClose'):void
  (e: 'onClear'):void
  (e: 'onWrCreated'):void
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

const { getClient } = useClient()
const client = ref<Client | null>(null)

watch(() => state.value.client, async (clientOrId) => {
  if (!clientOrId) {
    client.value = null
    return
  }
  // If it's a populated object, use it directly
  if (typeof clientOrId === 'object' && clientOrId.name) {
    client.value = clientOrId as Client
  }
  // If it's an ID, fetch the client data
  else if (typeof clientOrId === 'string') {
    const { data: clientData } = await getClient(clientOrId)
    client.value = clientData.value || null
  } else {
    client.value = null
  }
}, { immediate: true, deep: true })

// const state = ref<User>({ ...props.dataForm })
const isLoading = ref(false)

// Computed properties for dynamic values
const title = computed(() => {
  if (props.action === 'create') return 'New WR'
  if (props.action === 'addPackages') return 'Add Packages to WR'
  return 'Edit WR'
})
const color = computed(() => {
  if (props.action === 'create') return 'blue-darken-3'
  if (props.action === 'addPackages') return 'info'
  return 'warning'
})

// Validation rules
const rules = () => ({
  // name: { required },
  packages: {
    $each: helpers.forEach({
      required,
      trkgNum: { required },
      weight: { required },
    })
  },
})

const v$ = useVuelidate(rules, state)

// Error messages
const getFieldErrors = (field: keyof WR) =>
  v$.value[field]?.$errors.map((e: any) => e.$message) || []

// const getContactFieldErrors = (index: number, field: 'name' | 'position' | 'phone' | 'email') =>
//   v$.value.contacts.$errors.map((e: any) => e.$response.$errors[index]?.[field]?.map((e: any) => e.$message))
const getPackagesFieldErrors = (index: number, field: 'trkgNum' | 'weight' | 'notes' | 'measures.l' | 'measures.w' | 'measures.h') =>
  v$.value.packages.$errors.map((e: any) => e.$response.$errors[index]?.[field]?.map((e: any) => e.$message))

const { createWR, updateWR } = useWR()

const processForm = async () => {
  v$.value.$touch()
  if (v$.value.$error) return

  try {
    isLoading.value = true
    let actionProcess
    // For both 'create' and 'edit' actions (like 'Add Packages'), we use the POST endpoint.
    // The backend will differentiate based on the presence of `_id` in the payload.
    if (props.action === 'create' || props.action === 'edit' || props.action === 'addPackages') {
      const { data } = await createWR(state.value)
      actionProcess = data
      if ((props.action === 'edit' || props.action === 'addPackages') && state.value._id) {
        await refreshNuxtData([`wr-${state.value._id}`])
      }
    }

    if (actionProcess) {
      emits('onClose')
      // Emit success event for both create and edit to trigger a refresh on the parent page.
      emits('onWrCreated')
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

const addPackage = () => {
  if (!Array.isArray(state.value.packages)) {
    state.value.packages = [];
  }
  state.value.packages?.push({
    trkgNum: undefined,
    measures:{l: undefined, w: undefined, h: undefined},
    weight: undefined,
    notes: undefined
  } as any)
};

const removePackage = (index:any) => {
  if (Array.isArray(state.value.packages)) {
    state.value.packages.splice(index, 1)
  }
}


</script>

<template>
  <v-dialog max-width="1250"
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
          <v-card v-if="client" variant="tonal" class="mb-4">
            <v-card-text>
              <v-row align="center">
                <v-col cols="12" md="4" class="d-flex align-center">
                  <v-avatar color="primary" variant="tonal" class="mr-4">
                    <v-icon>mdi-account-outline</v-icon>
                  </v-avatar>
                  <div>
                    <div class="text-caption text-medium-emphasis">{{ t('Name') }}</div>
                    <div class="font-weight-medium">{{ client.name }}</div>
                  </div>
                </v-col>
                <v-col cols="12" md="4" class="d-flex align-center">
                  <v-avatar color="info" variant="tonal" class="mr-4">
                    <v-icon>mdi-phone-outline</v-icon>
                  </v-avatar>
                  <div>
                    <div class="text-caption text-medium-emphasis">{{ t('Phone') }}</div>
                    <div class="font-weight-medium">{{ client.phone || 'N/A' }}</div>
                  </div>
                </v-col>
                <v-col v-if="client.emails && client.emails.length > 0" cols="12" md="4" class="d-flex align-start">
                  <v-avatar color="success" variant="tonal" class="mr-4 mt-1">
                    <v-icon>mdi-email-outline</v-icon>
                  </v-avatar>
                  <div>
                    <div class="text-caption text-medium-emphasis">Emails</div>
                    <div>
                      <template v-for="(email, i) in client.emails" :key="i">
                        <v-chip size="small" class="mr-1 mb-1">{{ email.email }}</v-chip>
                      </template>
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <v-row class="mt-4 pb-0">
            <v-card-title v-if="state.packages && state.packages![0]" class="pl-7">{{ t('Packages') }}</v-card-title>
            <v-btn variant="text" color="info" class="mt-2 ml-2" @click="addPackage">
              <v-icon>mdi-plus</v-icon>{{ t('Add Package') }}
            </v-btn>
          </v-row>

          <v-row >
            <template v-for="(v, index) in state.packages" :key="index">
              <v-col cols="12" sm="4" >
                <v-text-field
                  label="trkgNum"
                  v-model="v.trkgNum"
                  @input="v$.packages.$touch()"
                  @blur="v$.packages.$touch()"
                  :error-messages="getPackagesFieldErrors(index, 'trkgNum')"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="1" >
                <v-text-field
                  label="weight"
                  v-model="v.weight"
                  @input="v$.packages.$touch()"
                  @blur="v$.packages.$touch()"
                  :error-messages="getPackagesFieldErrors(index, 'weight')"
                ></v-text-field>
              </v-col>

              <v-col class="d-flex" cols="12" sm="3" >
                <v-text-field class="mr-1"
                    label="L"
                    v-model="v.measures.l"
                ></v-text-field>
                <v-text-field class="mr-1"
                    label="W"
                    v-model="v.measures.w"
                ></v-text-field>
                <v-text-field
                    label="H"
                    v-model="v.measures.h"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="4" >
                <v-text-field
                  label="Notes"
                  v-model="v.notes"
                >
                  <template v-slot:append class="mr-0">
                    <v-btn class="mr-0" density="compact" icon variant="plain" color="error"
                      @click="removePackage(index)" v-if="index >= 0">
                      <v-icon>mdi-delete-outline</v-icon>
                      <v-tooltip activator="parent" location="top">Delete email</v-tooltip>
                    </v-btn>
                  </template>
                </v-text-field>
              </v-col>
            </template>
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