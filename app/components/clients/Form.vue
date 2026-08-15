<script setup lang="ts">
// Modal de formulario de cliente (crear/editar)
// Patrón estandarizado: lee el estado global de useClientUI (useState) y emite 'saved'.
import { Country, State, City } from 'country-state-city'
import { clientFormSchema } from '~~/shared/client'

const { isFormOpen, selectedClient, closeForm } = useClientUI()
const { saving, submitError, fieldErrors, saveClient } = useClientForm()

const emit = defineEmits<{
  (e: 'saved'): void
}>()

const isEditing = computed(() => !!selectedClient.value)

const formRef = ref<any>(null)

const form = ref<Record<string, any>>({
  name: '',
  seller: null,
  country: '',
  state: '',
  city: '',
  phone: '',
  address: '',
  email: '',
  emails: [],
})

const countries = ref(Country.getAllCountries())
const statesByCountry = ref<any[]>(State.getStatesOfCountry('CO'))
const citiesByState = ref<any[]>([])
const sellers = ref<Array<Record<string, any>>>([])

const loadSellers = async () => {
  try {
    const res = await $fetch('/api/sellers', { params: { limit: 100 } }) as any
    sellers.value = Array.isArray(res) ? res : (res.items ?? [])
  } catch (error) {
    console.error('Error cargando sellers:', error)
  }
}

type VuetifyRule = (v: any) => string | boolean

const zodRule = (schema: any): VuetifyRule => {
  return (v: any) => {
    const result = schema.safeParse(v)
    return result.success || result.error.issues[0]?.message || true
  }
}

// Reglas Vuetify derivadas del esquema zod
const rules: Record<string, VuetifyRule[]> = {
  name: [zodRule(clientFormSchema.shape.name)],
  seller: [zodRule(clientFormSchema.shape.seller)],
}

const resetForm = () => {
  form.value = {
    name: '',
    seller: null,
    country: '',
    state: '',
    city: '',
    phone: '',
    address: '',
    email: '',
    emails: [],
  }
}

const onChangeCountry = () => {
  statesByCountry.value = State.getStatesOfCountry(form.value.country || 'CO')
  citiesByState.value = []
  form.value.state = ''
  form.value.city = ''
}

const onChangeState = () => {
  citiesByState.value = City.getCitiesOfState(form.value.country || 'CO', form.value.state || '')
  form.value.city = ''
}

const addEmail = () => {
  form.value.emails.push({ email: '' })
}

const removeEmail = (index: number) => {
  form.value.emails.splice(index, 1)
}

// Cuando se abre el modal: copiar los datos de la fila seleccionada o resetear.
watch(isFormOpen, async (open) => {
  if (!open) return
  submitError.value = ''
  fieldErrors.value = {}
  resetForm()

  const c = selectedClient.value
  if (c) {
    form.value = {
      name: c.name ?? '',
      seller: typeof c.seller === 'object' && c.seller ? c.seller._id : (c.seller ?? null),
      country: c.country ?? '',
      state: c.state ?? '',
      city: c.city ?? '',
      phone: Array.isArray(c.phone) ? (c.phone[0] ?? '') : (c.phone ?? ''),
      address: c.address ?? '',
      email: c.email ?? '',
      emails: Array.isArray(c.emails) ? c.emails.map((e: any) => ({ email: e.email ?? '' })) : [],
    }
    statesByCountry.value = State.getStatesOfCountry(c.country || 'CO')
    citiesByState.value = City.getCitiesOfState(c.country || 'CO', c.state || '')
  } else {
    statesByCountry.value = State.getStatesOfCountry('CO')
    citiesByState.value = []
  }

  loadSellers()
})

const save = async () => {
  if (formRef.value) {
    const { valid } = await formRef.value.validate()
    if (!valid) return
  }

  const id = selectedClient.value?.id ?? selectedClient.value?._id
  const success = await saveClient(form.value, id ?? undefined)
  if (success) {
    emit('saved')
    closeForm()
  }
}
</script>

<template>
  <v-dialog
    :model-value="isFormOpen"
    max-width="900"
    @update:model-value="(v: boolean) => { if (!v) closeForm() }"
  >
    <v-card>
      <v-progress-linear
        :indeterminate="saving"
        :model-value="saving ? undefined : 100"
      />
      <v-card-title>
        {{ isEditing ? 'Editar Cliente' : 'Nuevo Cliente' }}
      </v-card-title>
      <v-card-text>
        <v-form ref="formRef" @submit.prevent="save">
          <v-container fluid>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="form.name"
                  label="Nombre"
                  density="compact"
                  :rules="rules.name"
                  :error-messages="fieldErrors.name"
                  :disabled="saving"
                  @input="fieldErrors.name = undefined"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-autocomplete
                  v-model="form.seller"
                  label="Vendedor"
                  density="compact"
                  :items="sellers"
                  item-title="name"
                  item-value="_id"
                  :rules="rules.seller"
                  :error-messages="fieldErrors.seller"
                  :disabled="saving"
                  @update:model-value="fieldErrors.seller = undefined"
                />
              </v-col>
              <v-col cols="12" sm="4">
                <v-autocomplete
                  v-model="form.country"
                  label="País"
                  density="compact"
                  :items="countries"
                  item-title="name"
                  item-value="isoCode"
                  :disabled="saving"
                  @update:model-value="onChangeCountry"
                />
              </v-col>
              <v-col cols="12" sm="4">
                <v-autocomplete
                  v-model="form.state"
                  label="Estado"
                  density="compact"
                  :items="statesByCountry"
                  item-title="name"
                  item-value="isoCode"
                  :disabled="saving"
                  @update:model-value="onChangeState"
                />
              </v-col>
              <v-col cols="12" sm="4">
                <v-autocomplete
                  v-model="form.city"
                  label="Ciudad"
                  density="compact"
                  :items="citiesByState"
                  item-title="name"
                  item-value="name"
                  :disabled="saving"
                />
              </v-col>
              <v-col cols="12" sm="4">
                <v-text-field
                  v-model="form.phone"
                  label="Teléfono"
                  density="compact"
                  :disabled="saving"
                />
              </v-col>
              <v-col cols="12" sm="8">
                <v-textarea
                  v-model="form.address"
                  label="Dirección"
                  auto-grow
                  rows="1"
                  density="compact"
                  :disabled="saving"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="form.email"
                  label="Email principal"
                  type="email"
                  density="compact"
                  :disabled="saving"
                />
              </v-col>
              <v-col cols="12" class="d-flex align-center">
                <span class="text-subtitle-2 mr-2">Emails adicionales</span>
                <v-btn
                  size="small"
                  variant="text"
                  color="info"
                  icon="mdi-plus"
                  :disabled="saving"
                  @click="addEmail"
                />
              </v-col>
              <v-col v-for="(e, index) in form.emails" :key="index" cols="12" sm="6">
                <v-text-field
                  v-model="e.email"
                  :label="`Email ${index + 1}`"
                  type="email"
                  density="compact"
                  :disabled="saving"
                >
                  <template v-slot:append>
                    <v-btn
                      icon="mdi-delete-outline"
                      variant="text"
                      color="error"
                      size="small"
                      :disabled="saving"
                      @click="removeEmail(index)"
                    />
                  </template>
                </v-text-field>
              </v-col>
            </v-row>
            <v-alert
              v-if="submitError"
              type="error"
              class="mt-2"
              closable
              @click:close="submitError = ''"
            >
              {{ submitError }}
            </v-alert>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="error" variant="text" :disabled="saving" @click="closeForm">
          Cancelar
        </v-btn>
        <v-btn color="primary" :loading="saving" @click="save">
          Guardar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
