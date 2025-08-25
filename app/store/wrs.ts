import { defineStore } from "pinia";

export const useWrsStore = defineStore('wrsStore', () => {
  const wrs = ref([])

  return {
    // State
    wrs,

    // Actions
    setWrs(payload: any) {
      wrs.value = payload
    }
  }
})