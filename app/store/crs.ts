import { defineStore } from "pinia";

export const useCrsStore = defineStore('crsStore', () => {
  const crs = ref([])

  return {
    // State
    crs,

    // Actions
    setCrs(payload: any) {
      crs.value = payload
    }
  }
})