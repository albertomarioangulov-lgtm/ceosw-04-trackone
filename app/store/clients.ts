import { defineStore } from "pinia";

export const useClientsStore = defineStore('clientsStore', () => {
  const clients = ref([])

  return {
    // State
    clients,

    // Actions
    setClients(payload: any) {
      clients.value = payload
    }
  }
})