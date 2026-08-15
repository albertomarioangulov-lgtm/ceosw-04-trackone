<script setup lang="ts">
const props = defineProps<{
  items: Array<Record<string, any>>
  loading: boolean
  total: number
  page: number
  itemsPerPage: number
  sortBy: string
  sortOrder: 'asc' | 'desc'
}>()

const emit = defineEmits<{
  (e: 'view', client: Record<string, any>): void
  (e: 'update:options', options: any): void
}>()
</script>

<template>
  <v-data-iterator
    :items="items || []"
    item-key="id"
    :loading="loading"
    :items-length="total"
    :page="page"
    :items-per-page="itemsPerPage"
    :sort-by="[{ key: sortBy, order: sortOrder }]"
    :hide-default-footer="total <= itemsPerPage"
    @update:options="emit('update:options', $event)"
  >
    <template #default="{ items: iteratorItems }">
      <v-row class="mt-2">
        <v-col
          v-for="item in iteratorItems"
          :key="item.raw.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <v-card class="client-card h-100">
            <v-card-text>
              <div class="d-flex align-center mb-3">
                <v-avatar color="primary" variant="tonal" size="40" class="mr-3">
                  <span class="text-subtitle-1">{{ item.raw.name?.charAt(0) || '?' }}</span>
                </v-avatar>
                <div class="flex-grow-1" style="min-width: 0;">
                  <div
                    class="text-body-1 font-weight-bold text-truncate cursor-pointer"
                    @click="emit('view', item.raw)"
                  >
                    {{ item.raw.name }}
                  </div>
                  <div class="text-caption text-grey text-truncate">
                    {{ item.raw.email || (Array.isArray(item.raw.phone) ? item.raw.phone.join(', ') : item.raw.phone) || '—' }}
                  </div>
                </div>
              </div>

              <v-divider class="mb-2" />

              <div class="d-flex align-center mb-1">
                <v-icon size="small" color="grey" class="mr-2">mdi-inbox-outline</v-icon>
                <span class="text-caption">
                  Pobox: {{ item.raw.poboxid != null ? String(item.raw.poboxid).padStart(4, '0') : '—' }}
                </span>
              </div>
              <div class="d-flex align-center mb-1">
                <v-icon size="small" color="grey" class="mr-2">mdi-phone-outline</v-icon>
                <span class="text-caption">
                  {{ Array.isArray(item.raw.phone) ? item.raw.phone.join(', ') : (item.raw.phone || '—') }}
                </span>
              </div>
              <div class="d-flex align-center mb-1">
                <v-icon size="small" color="grey" class="mr-2">mdi-map-marker-outline</v-icon>
                <span class="text-caption">
                  {{ [item.raw.city, item.raw.state, item.raw.country].filter(Boolean).join(', ') || '—' }}
                </span>
              </div>
              <div class="d-flex align-center mb-1">
                <v-icon size="small" color="grey" class="mr-2">mdi-account-tie-outline</v-icon>
                <span class="text-caption">{{ item.raw.seller?.name || '—' }}</span>
              </div>
            </v-card-text>
            <v-card-actions>
              <v-btn
                size="small"
                variant="text"
                prepend-icon="mdi-eye-outline"
                @click="emit('view', item.raw)"
              >
                Ver
              </v-btn>
              <v-spacer />
              <ClientsBtnEdit :client="item.raw" />
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </template>
    <template #no-data>
      No hay clientes registrados.
    </template>
    <template #loading>
      Cargando clientes...
    </template>
  </v-data-iterator>
</template>
