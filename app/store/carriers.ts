import { defineStore } from "pinia";

export const useCarriersStore = defineStore('carriersStore', () => {
  const carriers = ref([])

  return {
    // State
    carriers,

    // Actions
    setCarriers(payload: any) {
      carriers.value = payload
    }
  }
})