import { defineStore } from "pinia";

export const useUsersStore = defineStore('usersStore', () => {
  const users = ref([])

  return {
    // State
    users,

    // Actions
    setUsers(payload: any) {
      users.value = payload
    }
  }
})