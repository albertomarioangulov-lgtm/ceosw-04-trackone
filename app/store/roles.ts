import { defineStore } from "pinia";

export const useRolesStore = defineStore('rolesStore', () => {
  const roles = ref([])
  const isLoading = ref<boolean>(false)

  return {
    // State
    roles,
    isLoading,

    // Actions
    setRoles(payload: any) {
      roles.value = payload
    },

    setIsLoading(payload:boolean) {
      isLoading.value = payload
    }
  }
})