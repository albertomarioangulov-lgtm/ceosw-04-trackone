<script setup lang="ts">
// Modal de formulario de vendedor (crear/editar)
// Patrón estandarizado: lee el estado global de useSellerUI (useState) y emite 'saved'.
import { sellerFormSchema } from '~~/shared/seller'

const { isFormOpen, selectedSeller, closeForm } = useSellerUI()
const { saving, submitError, fieldErrors, saveSeller } = useSellerForm()

const emit = defineEmits<{
  (e: 'saved'): void
}>()

const isEditing = computed(() => !!selectedSeller.value)

const formRef = ref<any>(null)

const form = ref<Record<string, any>>({
  name: '',
  code: '',
  seller_code: '',
  phone: '',
  email: '',
  emails: [],
  address: '',
  fee: '',
})

type VuetifyRule = (v: any) => string | boolean

const zodRule = (schema: any): VuetifyRule => {
  return (v: any) => {
    const result = schema.safeParse(v)
    return result.success || result.error.issues[0]?.message || true
  }
}

const rules: Record<string, VuetifyRule[]> = {
  name: [zodRule(sellerFormSchema.shape.name)],
  code: [zodRule(sellerFormSchema.shape.code)],
  fee: [zodRule(sellerFormSchema.shape.fee)],
}

const resetForm = () => {
  form.value = {
    name: '',
    code: '',
    seller_code: '',
    phone: '',
    email: '',
    emails: [],
    address: '',
    fee: '',
  }
}

const addEmail = () => {
  form.value.emails.push('')
}

const removeEmail = (index: number) => {
  form.value.emails.splice(index, 1)
}

watch(isFormOpen, (open) => {
  if (!open) return
  submitError.value = ''
  fieldErrors.value = {}
  resetForm()
  const s = selectedSeller.value
  if (s) {
    form.value = {
      name: s.name ?? '',
      // Los vendedores legacy pueden tener solo seller_code; lo usamos como respaldo.
      code: s.code ?? s.seller_code ?? '',
      seller_code: s.seller_code ?? '',
      // Datos legacy pueden traer phone como array; normalizamos a string.
      phone: Array.isArray(s.phone) ? (s.phone[0] ?? '') : (s.phone ?? ''),
      email: typeof s.email === 'string' ? s.email : '',
      emails: Array.isArray(s.emails)
        ? s.emails.map((e: any) => (typeof e === 'string' ? e : (e?.email ?? '')))
        : [],
      address: s.address ?? '',
      fee: s.fee != null ? String(s.fee) : '',
    }
  }
})

const save = async () => {
  if (formRef.value) {
    const { valid } = await formRef.value.validate()
    if (!valid) return
  }

  const success = await saveSeller(form.value, selectedSeller.value?.id ?? undefined)
  if (success) {
    emit('saved')
    closeForm()
  }
}
</script>

<template>
  <v-dialog
    :model-value="isFormOpen"
    max-width="640"
    @update:model-value="(v: boolean) => { if (!v) closeForm() }"
  >
    <v-card>
      <v-progress-linear
        :indeterminate="saving"
        :model-value="saving ? undefined : 100"
      />
      <v-card-title>
        {{ isEditing ? 'Editar Vendedor' : 'Nuevo Vendedor' }}
      </v-card-title>
      <v-card-text>
        <v-form ref="formRef" @submit.prevent="save">
          <v-container fluid>
            <v-row>
              <v-col cols="12" sm="8">
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
              <v-col cols="12" sm="4">
                <v-text-field
                  v-model="form.code"
                  label="Código"
                  density="compact"
                  :rules="rules.code"
                  :error-messages="fieldErrors.code"
                  :disabled="saving"
                  @input="fieldErrors.code = undefined"
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
              <v-col cols="12" sm="4">
                <v-text-field
                  v-model="form.fee"
                  label="Comisión (%)"
                  density="compact"
                  :rules="rules.fee"
                  :error-messages="fieldErrors.fee"
                  :disabled="saving"
                  @input="fieldErrors.fee = undefined"
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
              <v-col cols="12" sm="6">
                <v-textarea
                  v-model="form.address"
                  label="Dirección"
                  auto-grow
                  rows="1"
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
                  v-model="form.emails[index]"
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
