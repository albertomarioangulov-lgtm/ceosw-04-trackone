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
  <v-container>
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
          <v-card>
            <v-card-title>Detalles Principales</v-card-title>
            <v-divider></v-divider>
            <v-list density="compact">
              <v-list-item prepend-icon="mdi-inbox-outline" title="P.O. Box" :subtitle="formatPobox(client)"></v-list-item>
              <v-list-item prepend-icon="mdi-phone-outline" title="Teléfono" :subtitle="client.phone"></v-list-item>
              <v-list-item prepend-icon="mdi-email-outline" title="Emails" lines="two">
                <template #subtitle>
                  <template  v-for="email in client.emails" :key="email">
                    <span class="mr-2"><v-chip density="compact">{{ email }}</v-chip></span>
                  </template>
                </template>
              </v-list-item>
              <template v-if="client.createdAt">
                <v-list-item prepend-icon="mdi-calendar-star" title="Miembro desde" :subtitle="formatDate(client.createdAt)"></v-list-item>
              </template>
              <v-list-item prepend-icon="mdi-map-marker-outline" title="Location" lines="two">
                <template #subtitle>
                  <!-- <div class="font-weight-medium">{{ client.country }}</div> -->
                   
                  <div class="font-weight-medium">
                    <Icon class="mr-2" size="1.0em" :name="`flagpack:${client.country.toLowerCase()}`"></Icon>
                    {{ client.country }}, {{ client.state }} {{ client.city }}
                  </div>
                  <div>{{ client.address }}</div>
                </template>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>

        <!-- Columna Derecha: Actividad Reciente -->
        <v-col cols="12" md="6">
          <v-card>
            <v-card-title>Actividad Reciente</v-card-title>
            <v-divider></v-divider>
            <v-list v-if="client.recentActivity?.length > 0" lines="two">
              <v-list-item
                v-for="activity in client.recentActivity"
                :key="activity.id"
                :title="activity.description"
                :subtitle="formatDate(activity.date)"
              >
                <template #prepend>
                  <v-avatar color="blue-lighten-4">
                    <v-icon color="primary">mdi-history</v-icon>
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

      <!-- Fila para Últimos Paquetes -->
      <v-row>
        <v-col cols="12">
          <v-card class="mt-6">
            <v-card-title>Últimos Paquetes Recibidos</v-card-title>
            <v-divider></v-divider>
            <v-list v-if="client.latestPackages?.length > 0" lines="two">
              <v-list-item
                v-for="pkg in client.latestPackages"
                :key="pkg.id"
                :title="pkg.description"
                :subtitle="`Recibido el: ${formatDate(pkg.receivedOn)}`"
              >
                <template #prepend>
                  <v-avatar color="green-lighten-4">
                    <v-icon color="success">mdi-package-variant-closed</v-icon>
                  </v-avatar>
                </template>
              </v-list-item>
            </v-list>
            <v-card-text v-else class="text-center text-medium-emphasis pa-6">
              No se han recibido paquetes recientemente.
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>
