<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const dataId = route.params.id?.toString() || '0'

const { getClient } = useClient()
const { data:clientData, refresh } = await getClient( dataId )

const title = ref('Client Details')

const pageName = 'Client Details'
  const pageTitle = t(`${ pageName }`)

  const items = [
    { title: t('home'), href: '/' },
    { title: t('clients'), href: '/clients' },
    { title: ':-)', href: `/${ pageName }` }
  ]
</script>

<template>
  <!-- <v-container class="px-3" fluid> -->
  <v-container class="pt-0 pl-0 pr-0 pb-2" fluid>
    <!-- Toolbar -->
    <v-toolbar flat color="transparent">
      <div>
        <v-toolbar-title>{{ pageTitle }}</v-toolbar-title>
        <v-breadcrumbs
          :items="items"
          class="breadcrumbs-under-title mt-0 pt-0 pb-0"
          style="font-size: 0.85rem;"
        />
      </div>
      <v-spacer></v-spacer>

      <!-- Botones alineados a la derecha -->
    <div class="d-flex justify-end my-2" v-if="clientData">
      <v-btn color="warning" class="mr-2" @click="editClient(clientData)">
        <v-icon left>mdi-pencil</v-icon>
        {{ t('Edit') }}
      </v-btn>
      <v-btn color="secondary" class="mr-2" @click="sendEmail(clientData)">
        <v-icon left>mdi-email</v-icon>
        {{ t('Welcome Email') }}
      </v-btn>
      <v-btn color="purple" @click="sendEmail(clientData)">
        <v-icon left>mdi-ticket</v-icon>
        {{ t('Ticket') }}
      </v-btn>
    </div>
      
      <!-- Breadcrumb -->
      <!-- <v-breadcrumbs :items="items" class="d-none d-sm-flex"/> -->
      
    </v-toolbar>
    <!-- <v-breadcrumbs :items="items" class="d-flex d-sm-none mb-2 pt-0" /> -->
    

    <v-card>
      <v-progress-linear absolute bottom
        height="2"
        :active="!clientData"
        :indeterminate="!clientData"
        color="primary"
      ></v-progress-linear>
      <v-row fluid>
        <v-col cols="12" sm="6" class="px-0 py-2">


          <template v-if="clientData">
            <div class="mx-2">
              <v-table density="compact">
                <tbody>
                  <tr>
                    <td class="fit-content"><strong>Name: </strong></td>
                    <td>{{ clientData.name }}</td>
                  </tr>
                  <tr>
                    <td class="fit-content"><strong>Phone: </strong></td>
                    <td>{{ clientData.phone }}</td>
                  </tr>
                  <tr>
                    <td class="fit-content"><strong>Email: </strong></td>
                    <td>{{ clientData.email }}</td>
                  </tr>
                  <tr>
                    <td class="fit-content"><strong>Email Status: </strong></td>
                    <td>
                      <v-chip size="small" variant="tonal" rounded="pill" :color="clientData.emailStatus">
                        {{ clientData.emailStatus }}
                      </v-chip>
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </div>
            
          </template>
          <template v-else>
            <v-skeleton-loader type="text" />
          </template>
        </v-col>
      </v-row>
    </v-card>

    
  </v-container>
</template>

<style scoped>
.fit-content {
  width: 1%;
  white-space: nowrap;
}
</style>
  
