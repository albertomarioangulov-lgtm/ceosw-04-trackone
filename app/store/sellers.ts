import { defineStore } from "pinia";

export const useSellersStore = defineStore('sellersStore', () => {
  const sellers = ref([])

  return {
    // State
    sellers,

    // Actions
    setSellers(payload: any) {
      sellers.value = payload
    }
  }
})