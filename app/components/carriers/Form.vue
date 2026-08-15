<script setup lang="ts">
// Modal de formulario de carrier (crear/editar)
// Patrón casaroca: lee el estado global de useCarrierUI (useState) y emite 'saved'.
import { carrierFormSchema } from '~~/shared/carrier'

const { isFormOpen, selectedCarrier, closeForm } = useCarrierUI()
const { saving, submitError, fieldErrors, saveCarrier } = useCarrierForm()

const emit = defineEmits<{
  (e: 'saved'): void
}>()

const isEditing = computed(() => !!selectedCarrier.value)

const formRef = ref<any>(null)

const form = ref<Record<string, any>>({
  name: '',
  code: '',
})

type VuetifyRule = (v: any) => string | boolean

// Reglas Vuetify derivadas del esquema zod
const rules: Record<string, VuetifyRule[]> = {
  name: [
    (v: string) => {
      const result = carrierFormSchema.shape.name.safeParse(v)
      return result.success || result.error.issues[0]?.message || true
    },
  ],
  code: [
    (v: string) => {
      const result = carrierFormSchema.shape.code.safeParse(v)
      return result.success || result.error.issues[0]?.message || true
    },
  ],
}

const resetForm = () => {
  form.value = { name: '', code: '' }
}

// Cuando se abre el modal: copiar los datos de la fila seleccionada o resetear.
watch(isFormOpen, (open) => {
  if (!open) return
  submitError.value = ''
  fieldErrors.value = {}
  resetForm()
  const c = selectedCarrier.value
  if (c) {
    form.value = {
      name: c.name ?? '',
      code: c.code ?? '',
    }
  }
})

const save = async () => {
  if (formRef.value) {
    const { valid } = await formRef.value.validate()
    if (!valid) return
  }

  const success = await saveCarrier(form.value, selectedCarrier.value?.id ?? undefined)
  if (success) {
    emit('saved')
    closeForm()
  }
}
</script>

<template>
  <v-dialog
    :model-value="isFormOpen"
    max-width="520"
    @update:model-value="(v: boolean) => { if (!v) closeForm() }"
  >
    <v-card>
      <v-progress-linear
        :indeterminate="saving"
        :model-value="saving ? undefined : 100"
      />
      <v-card-title>
        {{ isEditing ? 'Editar Carrier' : 'Nuevo Carrier' }}
      </v-card-title>
      <v-card-text>
        <v-form ref="formRef" @submit.prevent="save">
          <v-container fluid>
            <v-row>
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
