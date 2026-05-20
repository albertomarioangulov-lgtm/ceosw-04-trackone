<script setup lang="ts">
import { ref, computed } from 'vue';
import { useVuelidate } from '@vuelidate/core'
import { required, email, minLength, alphaNum, helpers } from '@vuelidate/validators'
import { useI18n } from 'vue-i18n';
import { Country, State, City }  from 'country-state-city'
import type { Client } from '~~/app/interfaces/Client';
import type { Seller } from '~~/app/interfaces/Seller';

const { t } = useI18n()

interface Props {
  isOpen: boolean
  action?: 'create' | 'edit' | ''
  dataForm: Client
}
interface Emits {
  (e: 'onClose'):void
  (e: 'onClear'):void
  (e: 'onSuccess'):void
}

const props = withDefaults( defineProps<Props>(), {
  isOpen: true,
  action: 'create'
})
const emits = defineEmits<Emits>()

const state = ref<Client>({ ...props.dataForm, emails: props.dataForm.emails ? [...props.dataForm.emails] : [] })

// Sincroniza state con dataForm al editar
watch( () => props.dataForm,
  (newVal) => {
    state.value = { ...newVal,
      // contacts: newVal.contacts ? [...newVal.contacts] : [],
      emails: newVal.emails ? [...newVal.emails] : []
    }
  }, { deep: true, immediate: true }
)

// const state = ref<User>({ ...props.dataForm })
const isLoading = ref(false)

const countries = ref(Country.getAllCountries())
const statesByCountry = ref(State.getStatesOfCountry('CO'))
const citiesByState = ref([{}])

// Computed properties for dynamic values
const title = computed(() => (props.action === 'create' ? 'New Client' : 'Edit Client'))
const color = computed(() => (props.action === 'create' ? 'blue-darken-3' : 'warning'))

// Validation rules
const rules = () => ({
  name: { required },
  // code: { required, alphaNum, minLength: minLength(2) },
  // docTyp: { required },
  seller: { required },
  emails: {
    $each: helpers.forEach({
      required,
      email: { required, email },
    })
  },
  // contacts: {
  //   $each: helpers.forEach({
  //     required,
  //     name: { required },
  //     position: { required },
  //     phone: { required },
  //     email: { email },
  //   })
  // }
})

const v$ = useVuelidate(rules, state)

// Error messages
const getFieldErrors = (field: keyof Client) =>
  v$.value[field]?.$errors.map((e: any) => e.$message) || []


const getEmailsFieldErrors = (index: number, field: 'email') =>
  v$.value.emails.$errors.map((e: any) => e.$response.$errors[index]?.[field]?.map((e: any) => e.$message))


// const query = {
//     page: options.page?.toString() ?? '1',
//     itemsPerPage: options.itemsPerPage?.toString() ?? '25',
//     search: options.search ?? '',
//     sortBy: options.sortBy?.[0]?.key ?? '',
//     sortDesc: options.sortBy?.[0]?.order === 'desc' ? 'true' : 'false'
//   }

const { getSellers } = useSeller()
const { sellers, pending: pendingSellers } = await getSellers() as { sellers: Ref<Seller[]>; pending: Ref<boolean> }

const { createClient, updateClient, getClients } = useClient()

const processForm = async () => {
  v$.value.$touch()
  if (v$.value.$error) return

  try {
    isLoading.value = true
    let actionProcess
    if( props.action === 'create' ) {
      const { data } = await createClient(state.value)
      actionProcess = data
    } else if ( props.action === 'edit' ) {
      const dataId = state.value._id
      const { data:updatedData } = await updateClient(dataId!, state.value)
      actionProcess = updatedData
      await refreshNuxtData([`client-${dataId}`])
    }

    if (actionProcess) {
      emits('onSuccess')
      emits('onClose')
      clearForm()
    }
  } catch (error) {
    console.error('Error processing form:', error)
  } finally {
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

const addContact = () => {
  if (!Array.isArray(state.value.contacts)) {
    state.value.contacts = []
  }
  state.value.contacts?.push({ name: null, position: null, phone: null, email: null })
  // state.value.contacts?.push({})
}

const removeContact = (index:any) => {
  if (Array.isArray(state.value.contacts)) {
    state.value.contacts.splice(index, 1)
  }
}

const addEmail = () => {
  if (!Array.isArray(state.value.emails)) {
    state.value.emails = [];
  }
  state.value.emails?.push({ email: null } as { email: string | null } );
};

const removeEmail = (index: number) => {
  if (Array.isArray(state.value.emails)) {
    state.value.emails.splice(index, 1)
  }
}

const onChangeCountry = () => {
  statesByCountry.value = State.getStatesOfCountry(state.value.country)
  // citiesByState.value = City.getCitiesOfState('CO', state.value.state!)
  state.value.state = undefined
  state.value.city = undefined
}

const onChangeState = () => {
  citiesByState.value = City.getCitiesOfState(state.value.country!, state.value.state!)
  state.value.city = undefined
}

onBeforeUpdate(() => {
  // statesByCountry.value = State.getStatesOfCountry('CO')
  statesByCountry.value = State.getStatesOfCountry(state.value.country || 'CO')
  citiesByState.value = City.getCitiesOfState(state.value.country || 'CO', state.value.state || '')
})

</script>

<template>
  <v-dialog max-width="1100"
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
            <v-col cols="12" sm="12">
              <v-text-field density="compact"
                :label="t('name')"
                v-model="state.name"
                @input="v$.name.$touch()"
                @blur="v$.name.$touch()"
                :error-messages="getFieldErrors('name')"
              />
            </v-col>

            <!-- <v-col cols="12" sm="3">
              <v-text-field
                :label="t('code')"
                v-model="state.code"
                @input="v$.code.$touch()"
                @blur="v$.code.$touch()"
                :error-messages="getFieldErrors('code')"
              />
            </v-col> -->

            <!-- <v-col cols="12" sm="6">
              <v-text-field
                :label="t('docType')"
                v-model="state.docTyp"
                hide-details="auto"
                @input="v$.docTyp.$touch()"
                @blur="v$.docTyp.$touch()"
                :error-messages="getFieldErrors('docTyp')"
              />
            </v-col>

            <v-col cols="12" sm="6">
              <v-text-field
                :label="t('docNum')"
                v-model="state.docNum"
                hide-details="auto"
                @input="v$.docNum.$touch()"
                @blur="v$.docNum.$touch()"
                :error-messages="getFieldErrors('docNum')"
              />
            </v-col> -->
            

            

            <v-col cols="12" sm="4">
              <v-autocomplete clearable
                :label="$t('country')"
                v-model="state.country"
                :items="countries"
                item-title="name"
                item-value="isoCode"
                @update:modelValue="onChangeCountry"
              >
                <template v-slot:selection="{ item }">
                  <Icon class="mr-2" size="1.0em" :name="`flagpack:${item.isoCode.toLowerCase()}`"></Icon>
                  {{ item.name }}
                </template>
                
                <template v-slot:item="{ props, item }">
                  <v-list-item v-bind="props"
                    :title="item.name"
                    :subtitle="item.isoCode"
                  >
                    <template v-slot:append>
                      <Icon size="1.0em" :name="`flagpack:${item.isoCode.toLowerCase()}`"></Icon>
                    </template>
                  </v-list-item>
                </template>
              </v-autocomplete>
            </v-col>

            <v-col cols="12" sm="4">
              <v-autocomplete chips
                :label="$t('state')"
                v-model="state.state"
                hide-details="auto"
                :items="statesByCountry"
                item-title="name"
                item-value="isoCode"
                @update:modelValue="onChangeState"
              >
                <template v-slot:chip="{ props, item }">
                  <v-chip v-bind="props"
                    :text="`${item.name} - ${item.isoCode}`"
                  ></v-chip>
                </template>

                <template v-slot:item="{ props, item }">
                  <v-list-item v-bind="props"
                    :title="item.name"
                    :subtitle="item.isoCode"
                  ></v-list-item>
                </template>
              </v-autocomplete>
            </v-col>

            <v-col cols="12" sm="4">
              <v-autocomplete
                :label="$t('city')"
                v-model="state.city"
                hide-details="auto"
                :items="citiesByState"
                item-title="name"
                item-value="isoCode"
              >
              </v-autocomplete>
            </v-col>

            <v-col cols="12" sm="4">
              <v-text-field
                :label="$t('phone')"
                v-model="state.phone"
                hide-details="auto"
              />
            </v-col>

            <v-col cols="12" sm="8">
              <v-textarea auto-grow rows="1"
                :label="$t('address')"
                v-model="state.address"
              />
            </v-col>

              <!-- <div class="d-flex align-center mb-2">
                <span class="text-subtitle-1">Emails</span>
                <v-btn class="ml-2" size="small" variant="tonal" color="primary" @click="addEmail" icon="mdi-plus"></v-btn>
              </div>
              <v-row v-for="(v, index) in state.emails" :key="index">
                <v-col cols="12">
                  <v-text-field
                    v-model="v.email"
                    :label="`Email ${index + 1}`"
                    @input="v$.contacts.$touch()"
                    @blur="v$.emails.$touch()"
                    :error-messages="getEmailsFieldErrors(index, 'email')"
                  >
                    <template v-slot:append>
                      <v-btn
                        icon="mdi-delete-outline"
                        variant="text"
                        color="error"
                        size="small"
                        @click="removeEmail(index)"
                      ></v-btn>
                    </template>
                  </v-text-field>
                
                </v-col>
              </v-row> -->

            <v-col cols="12" sm="12">
              <v-autocomplete dense outlined clearable
                label="Seller"
                v-model="state.seller"
                :items="sellers"
                item-title="name"
                item-value="_id"
                @input="v$.seller.$touch()"
                @blur="v$.seller.$touch()"
                :error-messages="getFieldErrors('seller')"
              >
                  <!-- <template slot="selection" slot-scope="data">
                      {{ data.item.name }} - {{ data.item.seller_code }}
                  </template>
                  <template slot="item" slot-scope="data">
                      {{ data.item.name }} - {{ data.item.seller_code }}
                  </template> -->
              </v-autocomplete>
            </v-col>
            

          </v-row>

          <v-row class="mt-4 pb-0">
            <v-card-title v-if="state.emails![0]" class="pl-7">{{ t('Emails') }}</v-card-title>
            <v-btn variant="text" color="info" class="mt-2 ml-2" @click="addEmail">
              <v-icon>mdi-plus</v-icon>{{ t('Add Email') }}
            </v-btn>
          </v-row>

          <v-row >
            <template v-for="(v, index) in state.emails" :key="index">

              
              <v-col cols="12" sm="4" >
                <v-text-field
                  label="Email"
                  v-model="v.email"
                  @input="v$.emails.$touch()"
                  @blur="v$.emails.$touch()"
                  :error-messages="getEmailsFieldErrors(index, 'email')"
                >
                  <template v-slot:append class="mr-0">
                    <v-btn class="mr-0" density="compact" icon variant="plain" color="error"
                      @click="removeEmail(index)" v-if="index >= 0">
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