<script setup lang="ts">
// Modal de formulario de usuario (crear/editar)
// Patrón casaroca: lee el estado global de useUserUI (useState) y emite 'saved'.
import { userCreateSchema, userUpdateSchema } from '~~/shared/user'
import { AVAILABLE_ROLES } from '~~/shared/permissions'

const { isFormOpen, selectedUser, closeForm } = useUserUI()
const { saving, submitError, fieldErrors, saveUser } = useUserForm()

const emit = defineEmits<{
  (e: 'saved'): void
}>()

const isEditing = computed(() => !!selectedUser.value)

const formRef = ref<any>(null)

const form = ref<Record<string, any>>({
  name: '',
  username: '',
  initials: '',
  email: '',
  password: '',
  confirmPassword: '',
  roles: [],
  color: 'blue',
})

type VuetifyRule = (v: any) => string | boolean

const zodRule = (schema: any): VuetifyRule => {
  return (v: any) => {
    const result = schema.safeParse(v)
    return result.success || result.error.issues[0]?.message || true
  }
}

// Reglas Vuetify derivadas de los esquemas zod
const rules: Record<string, VuetifyRule[]> = {
  name: [zodRule(userCreateSchema.shape.name)],
  username: [zodRule(userCreateSchema.shape.username)],
  initials: [zodRule(userCreateSchema.shape.initials)],
  email: [zodRule(userCreateSchema.shape.email)],
  // En edición la contraseña es opcional (vacía = no cambiar);
  // la regla se evalúa en cada validación según el modo actual.
  password: [
    (v: any) => {
      const schema = isEditing.value ? userUpdateSchema.shape.password : userCreateSchema.shape.password
      const result = schema.safeParse(v)
      return result.success || result.error.issues[0]?.message || true
    },
  ],
  confirmPassword: [
    (v: string) => v === form.value.password || 'Las contraseñas no coinciden',
  ],
}

const resetForm = () => {
  form.value = {
    name: '',
    username: '',
    initials: '',
    email: '',
    password: '',
    confirmPassword: '',
    roles: [],
    color: 'blue',
  }
}

// Cuando se abre el modal: copiar los datos de la fila seleccionada o resetear.
watch(isFormOpen, (open) => {
  if (!open) return
  submitError.value = ''
  fieldErrors.value = {}
  resetForm()
  const u = selectedUser.value
  if (u) {
    form.value = {
      name: u.name ?? '',
      username: u.username ?? '',
      initials: u.initials ?? '',
      email: u.email ?? '',
      password: '',
      confirmPassword: '',
      roles: u.roles ?? [],
      color: u.color ?? 'blue',
    }
  }
})

const save = async () => {
  if (formRef.value) {
    const { valid } = await formRef.value.validate()
    if (!valid) return
  }

  const success = await saveUser(form.value, selectedUser.value?.id ?? undefined)
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
        {{ isEditing ? 'Editar Usuario' : 'Nuevo Usuario' }}
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
              <v-col cols="12" sm="3">
                <v-text-field
                  v-model="form.username"
                  label="Usuario"
                  density="compact"
                  :rules="rules.username"
                  :error-messages="fieldErrors.username"
                  :disabled="saving"
                  @input="fieldErrors.username = undefined"
                />
              </v-col>
              <v-col cols="12" sm="3">
                <v-text-field
                  v-model="form.initials"
                  label="Iniciales"
                  density="compact"
                  :rules="rules.initials"
                  :error-messages="fieldErrors.initials"
                  :disabled="saving"
                  @input="fieldErrors.initials = undefined"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="form.email"
                  label="E-mail"
                  type="email"
                  density="compact"
                  :rules="rules.email"
                  :error-messages="fieldErrors.email"
                  :disabled="saving"
                  @input="fieldErrors.email = undefined"
                />
              </v-col>
              <v-col cols="12" sm="3">
                <v-text-field
                  v-model="form.password"
                  :label="isEditing ? 'Contraseña (opcional)' : 'Contraseña'"
                  type="password"
                  density="compact"
                  :rules="rules.password"
                  :error-messages="fieldErrors.password"
                  :disabled="saving"
                  @input="fieldErrors.password = undefined"
                />
              </v-col>
              <v-col cols="12" sm="3">
                <v-text-field
                  v-model="form.confirmPassword"
                  label="Confirmar contraseña"
                  type="password"
                  density="compact"
                  :rules="rules.confirmPassword"
                  :disabled="saving"
                />
              </v-col>
              <v-col cols="12" sm="8">
                <v-select
                  v-model="form.roles"
                  label="Roles"
                  density="compact"
                  :items="AVAILABLE_ROLES"
                  multiple
                  chips
                  clearable
                  :disabled="saving"
                />
              </v-col>
              <v-col cols="12" sm="4">
                <v-color-input
                  v-model="form.color"
                  label="Color"
                  density="compact"
                  mode="hexa"
                  :disabled="saving"
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
