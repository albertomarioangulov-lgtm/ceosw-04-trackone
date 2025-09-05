<script setup lang="ts">
const route = useRoute();
const clientId = route.params.id as string;

const { token } = useAuth()

// Helper for headers
const getHeaders = () => ({
  Authorization: `${token.value}`,
  'Content-Type': 'application/json',
})


// `useFetch` obtiene los datos del lado del servidor (o cliente) y maneja los estados de carga y error.
const { data: client, pending, error } = await useFetch(`/api/clients/${clientId}`, { headers: getHeaders(), lazy: true });

// Función de utilidad para formatear fechas
const formatDate = (dateString: string) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
};

// Función para formatear el P.O. Box
const formatPobox = (client: any) => {
  if (!client || !client.seller || client.poboxid == null) {
    return 'No asignado';
  }
  const poboxid = client.poboxid.toString().padStart(4, '0');
  return `${client.seller.code} - ${poboxid}`;
};

// Si la API devuelve un 404, muestra la página de error de Nuxt.
if (error.value?.statusCode === 404) {
  showError({ statusCode: 404, statusMessage: 'Cliente No Encontrado' });
}
</script>

<template>
  <v-container class="pt-0 pl-0 pr-0" fluid>
    <!-- Estado de Carga -->
    <div v-if="pending" class="text-center pa-12">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      <p class="mt-4 text-medium-emphasis">Cargando información del cliente...</p>
    </div>

    <!-- Estado de Error -->
    <v-alert
      v-else-if="error"
      type="error"
      title="Error al cargar"
      :text="error.statusMessage || 'No se pudo encontrar la información del cliente.'"
      variant="tonal"
      class="mx-auto"
      max-width="600"
    ></v-alert>

    <!-- Contenido Principal -->
    <div v-else-if="client">
      <h1 class="mb-5 text-h4 font-weight-bold">{{ client.name }}</h1>
      <v-row>
        <!-- Columna Izquierda: Detalles y Dirección -->
        <v-col cols="12" md="6">
          <v-card class="fill-height">
            <v-card-title>Detalles Principales</v-card-title>
            <v-divider></v-divider>
            <v-list density="compact">
              <v-list-item prepend-icon="mdi-inbox-outline" title="P.O. Box" :subtitle="formatPobox(client)"></v-list-item>
              <v-list-item prepend-icon="mdi-phone-outline" title="Teléfono" :subtitle="client.phone"></v-list-item>
              <v-list-item prepend-icon="mdi-email-outline" title="Emails" lines="two">
                <template #subtitle>
                  <template  v-for="email in client.emails" :key="email">
                    <span class="mr-2"><v-chip density="compact">{{ email.email }}</v-chip></span>
                  </template>
                </template>
              </v-list-item>
              <template v-if="client.createdAt">
                <v-list-item prepend-icon="mdi-calendar-star" title="Miembro desde" :subtitle="formatDate(client.createdAt)"></v-list-item>
              </template>
              <v-list-item prepend-icon="mdi-map-marker-outline" title="Location" lines="two">
                <v-list-item-subtitle class="mb-1 text-high-emphasis opacity-100">
                  <div class="">
                    <span><Icon class="mr-2" size="1.1em" :name="`flagpack:${client.country.toLowerCase()}`"></Icon></span>
                    <span class="text-high-emphasis opacity-80">{{ client.country }}, {{ client.state }} {{ client.city }}</span>
                  </div>
                  <!-- <div>{{ client.address }}</div> -->
                </v-list-item-subtitle>
                <v-list-item-subtitle>
                  {{ client.address }}
                </v-list-item-subtitle>
                <!-- <template #subtitle>
                  <div class="font-weight-medium">
                    <Icon opacity="1" class="mr-2" size="1.0em" :name="`flagpack:${client.country.toLowerCase()}`"></Icon>
                    {{ client.country }}, {{ client.state }} {{ client.city }}
                  </div>
                  <div>{{ client.address }}</div>
                </template> -->
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>

        <!-- Columna Derecha: Actividad Reciente -->
        <v-col cols="12" md="6">
          <v-card class="fill-height">
            <v-card-title>Actividad Reciente</v-card-title>
            <v-divider></v-divider>
            <v-list v-if="client.lastWr || client.lastCr || client.lastPackage" lines="two">
              <v-list-item
                v-if="client.lastWr"
                :to="`/wrs/${client.lastWr._id}`"
                :title="`Último WR: #${client.lastWr.wrId}`"
                :subtitle="`Creado el: ${formatDate(client.lastWr.createdAt)}`"
              >
                <template #prepend>
                  <v-avatar color="deep-purple-lighten-5">
                    <v-icon color="deep-purple-accent-2">mdi-receipt-text-outline</v-icon>
                  </v-avatar>
                </template>
              </v-list-item>
              <v-list-item
                v-if="client.lastCr"
                :to="`/crs/${client.lastCr._id}`"
                :title="`Último CR: #${client.lastCr.crId}`"
                :subtitle="`Creado el: ${formatDate(client.lastCr.createdAt)}`"
              >
                <template #prepend>
                  <v-avatar color="teal-lighten-5">
                    <v-icon color="teal-accent-3">mdi-receipt-text-check-outline</v-icon>
                  </v-avatar>
                </template>
              </v-list-item>
              <v-list-item
                v-if="client.lastPackage"
                :to="`/packages/${client.lastPackage._id}`"
                :title="`Último Paquete: ${client.lastPackage.trkgNum}`"
                lines="two"
              >
                <template #subtitle>
                  <div>{{ `Recibido el: ${formatDate(client.lastPackage.createdAt)}` }}</div>
                  <div v-if="client.lastPackage.notes" class="text-caption mt-1 d-flex align-center">
                    <v-icon size="x-small" class="mr-1">mdi-note-text-outline</v-icon>
                    <span class="text-truncate">{{ client.lastPackage.notes }}</span>
                  </div>
                </template>
                <template #prepend>
                  <v-avatar color="blue-lighten-5">
                    <v-icon color="blue-accent-2">mdi-package-variant-closed</v-icon>
                  </v-avatar>
                </template>
              </v-list-item>
            </v-list>
            <v-card-text v-else class="text-center text-medium-emphasis pa-6">
              No hay actividad reciente para mostrar.
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Aquí se podrían mostrar los paquetes si se incluyeran en la API -->
    </div>
  </v-container>
</template>
