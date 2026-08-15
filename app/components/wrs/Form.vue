<script setup lang="ts">
// Modal de WR (crear / agregar paquetes)
// Patrón estandarizado: lee el estado global de useWRUI (useState) y emite 'saved'.

const { isFormOpen, selectedWR, mode, closeForm } = useWRUI()
const { saving, submitError, fieldErrors, saveWR } = useWRForm()

const emit = defineEmits<{
  (e: 'saved', mode: 'create' | 'addPackages'): void
}>()

const formRef = ref<any>(null)

const wrId = ref<string | undefined>(undefined)
const client = ref<Record<string, any> | null>(null)
const packages = ref<Array<Record<string, any>>>([])

const isAddPackages = computed(() => mode.value === 'addPackages')

const loadClient = async (clientRef: any) => {
  if (!clientRef) {
    client.value = null
    return
  }
  if (typeof clientRef === 'object' && clientRef.name) {
    client.value = clientRef
    return
  }
  try {
    client.value = await $fetch(`/api/clients/${clientRef}`)
  } catch (error) {
    console.error('Error cargando cliente:', error)
    client.value = null
  }
}

watch(isFormOpen, async (open) => {
  if (!open) return
  submitError.value = ''
  fieldErrors.value = {}
  wrId.value = selectedWR.value?.id ?? selectedWR.value?._id ?? undefined
  packages.value = []
  await loadClient(selectedWR.value?.client)
})

const addPackage = () => {
  packages.value.push({
    trkgNum: '',
    measures: { l: null, w: null, h: null },
    weight: null,
    notes: '',
  })
}

const removePackage = (index: number) => {
  packages.value.splice(index, 1)
}

const requiredRule = (v: any) => (v != null && v !== '' ? true : 'Requerido')

const save = async () => {
  if (formRef.value) {
    const { valid } = await formRef.value.validate()
    if (!valid) return
  }

  const clientId = client.value?._id ?? client.value?.id ?? (typeof selectedWR.value?.client === 'string' ? selectedWR.value.client : undefined)
  if (!clientId) {
    submitError.value = 'Selecciona un cliente para el WR.'
    return
  }

  const success = await saveWR({
    _id: wrId.value,
    client: clientId,
    packages: packages.value,
  })
  if (success) {
    emit('saved', mode.value)
    closeForm()
  }
}
</script>

<template>
  <v-dialog
    :model-value="isFormOpen"
    max-width="1100"
    @update:model-value="(v: boolean) => { if (!v) closeForm() }"
  >
    <v-card>
      <v-progress-linear
        :indeterminate="saving"
        :model-value="saving ? undefined : 100"
      />
      <v-card-title>
        {{ isAddPackages ? 'Agregar Paquetes al WR' : 'Nuevo WR' }}
      </v-card-title>
      <v-card-text>
        <v-form ref="formRef" @submit.prevent="save">
          <v-container fluid>
            <v-card v-if="client" variant="tonal" class="mb-4">
              <v-card-text>
                <v-row align="center">
                  <v-col cols="12" md="4" class="d-flex align-center">
                    <v-avatar color="primary" variant="tonal" class="mr-4">
                      <v-icon>mdi-account-outline</v-icon>
                    </v-avatar>
                    <div>
                      <div class="text-caption text-medium-emphasis">Nombre</div>
                      <div class="font-weight-medium">{{ client.name }}</div>
                    </div>
                  </v-col>
                  <v-col cols="12" md="4" class="d-flex align-center">
                    <v-avatar color="info" variant="tonal" class="mr-4">
                      <v-icon>mdi-phone-outline</v-icon>
                    </v-avatar>
                    <div>
                      <div class="text-caption text-medium-emphasis">Teléfono</div>
                      <div class="font-weight-medium">
                        {{ Array.isArray(client.phone) ? client.phone.join(', ') : (client.phone || 'N/A') }}
                      </div>
                    </div>
                  </v-col>
                  <v-col v-if="client.emails?.length" cols="12" md="4" class="d-flex align-start">
                    <v-avatar color="success" variant="tonal" class="mr-4 mt-1">
                      <v-icon>mdi-email-outline</v-icon>
                    </v-avatar>
                    <div>
                      <div class="text-caption text-medium-emphasis">Emails</div>
                      <template v-for="(e, i) in client.emails" :key="i">
                        <v-chip size="small" class="mr-1 mb-1">{{ e.email }}</v-chip>
                      </template>
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <v-row class="mt-4 pb-0">
              <v-card-title v-if="packages.length" class="pl-7">Paquetes</v-card-title>
              <v-btn variant="text" color="info" class="mt-2 ml-2" @click="addPackage" :disabled="saving">
                <v-icon>mdi-plus</v-icon>Agregar Paquete
              </v-btn>
            </v-row>

            <v-row>
              <template v-for="(pkg, index) in packages" :key="index">
                <v-col cols="12" sm="4">
                  <v-text-field
                    v-model="pkg.trkgNum"
                    label="Tracking"
                    density="compact"
                    :rules="[requiredRule]"
                    :disabled="saving"
                  />
                </v-col>
                <v-col cols="12" sm="1">
                  <v-text-field
                    v-model="pkg.weight"
                    label="Peso"
                    density="compact"
                    :rules="[requiredRule]"
                    :disabled="saving"
                  />
                </v-col>
                <v-col class="d-flex" cols="12" sm="3">
                  <v-text-field class="mr-1" label="L" v-model="pkg.measures.l" density="compact" :disabled="saving" />
                  <v-text-field class="mr-1" label="W" v-model="pkg.measures.w" density="compact" :disabled="saving" />
                  <v-text-field label="H" v-model="pkg.measures.h" density="compact" :disabled="saving" />
                </v-col>
                <v-col cols="12" sm="4">
                  <v-text-field
                    v-model="pkg.notes"
                    label="Notas"
                    density="compact"
                    :disabled="saving"
                  >
                    <template v-slot:append>
                      <v-btn
                        density="compact"
                        icon
                        variant="plain"
                        color="error"
                        :disabled="saving"
                        @click="removePackage(index)"
                      >
                        <v-icon>mdi-delete-outline</v-icon>
                      </v-btn>
                    </template>
                  </v-text-field>
                </v-col>
              </template>
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
