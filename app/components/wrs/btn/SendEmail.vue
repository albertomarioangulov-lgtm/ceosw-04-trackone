<script setup lang="ts">

interface Props {
  item: any
  itemId: string
}

const props = defineProps<Props>()
const { item, itemId } = toRefs(props)



const isLoading = ref<boolean>(false)
const title = ref<string>('Send Email')
const sendEmailDialog = ref<boolean>(false)

const { sendEmailWr } = useWR()
// const { getClient, getClients } = useClient()

const sendEmailProcess = async (id: string) => {
  isLoading.value = true
  try {
    const { data}  = await sendEmailWr(id)
    if (data) {
      // console.log('response', response)
      // emit('onRefresh')
      sendEmailDialog.value = false
      // const { refresh } = await getClient(id)
      // refresh()
      // const { refresh:refreshClients} = await getClients()
      // refreshClients()
    }
  } catch (error) {
    console.error('Error sending email:', error)
  } finally {
    isLoading.value = false
  }
}


</script>

<template>
  
  <v-btn small
    variant="tonal"
    color="primary"
    class="ml-2"
    @click="sendEmailDialog = true"
  >
    <v-icon class="mr-1">mdi-email-outline</v-icon>
    {{ $t('Send Email') }}
  </v-btn>


  <v-dialog absolute
    transition="dialog-top-transition"
    width="auto"
    v-model="sendEmailDialog"
  >
    <v-card>
      <v-toolbar>
        <v-toolbar-title>{{ $t(`${title}`) }}</v-toolbar-title>
      </v-toolbar>

      <v-card-text>Desea enviar un email a este cliente?</v-card-text>

      <v-row class="ml-2 mt-0 mb-4">
            <v-btn class="mr-4 ml-4"
            variant="tonal" color="success" @click="sendEmailProcess(itemId)" :disabled="isLoading">{{ $t('Submit') }}</v-btn>
            <v-btn variant="tonal" color="error" @click="sendEmailDialog = false">{{ $t('Cancel') }}</v-btn>
          </v-row>
    </v-card>
  </v-dialog>
</template>
