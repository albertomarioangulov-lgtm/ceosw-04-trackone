import { defineStore } from "pinia";

export const usePackagesStore = defineStore('packagesStore', () => {
  const packages = ref([])
  const packagesByWR = ref([])
  const packagesByCR = ref([])

  return {
    // State
    packages,
    packagesByWR,
    packagesByCR,

    // Actions
    setPackages(payload: any) {
      packages.value = payload
    },

    setPackagesByWR(payload: any) {
      packagesByWR.value = payload
    },

    setPackagesByCR(payload: any) {
      packagesByCR.value = payload
    }
  }
})