import { defineStore } from "pinia";

export const usePackagesStore = defineStore('packagesStore', () => {
  const packages = ref([])
  const packagesByWR = ref([])

  return {
    // State
    packages,
    packagesByWR,

    // Actions
    setPackages(payload: any) {
      packages.value = payload
    },

    setPackagesByWR(payload: any) {
      packagesByWR.value = payload
    }
  }
})