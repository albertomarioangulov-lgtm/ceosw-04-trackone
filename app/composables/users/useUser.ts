import { useUsersStore } from "~/store/users"

const useUser = () => {
  const store = useUsersStore()
  const { users } = storeToRefs(store)
  const API_URL = '/api/users'

  // Helper function to generate headers dynamically
  const getHeaders = () => ({
    'Content-Type': 'application/json',
  })

  // Create a new user
  const createUser = async (body: any) => {
    const { data, error } = await useFetch(`${API_URL}`, {
      method: 'POST',
      body,
      headers: getHeaders(),
    })
    if (error.value) {
      console.error('Error creating user:', error.value)
    }
    return {data, error}
  }
  // const createUser = async (body: any) => {
  //   try {
  //     const data = await $fetch(`${API_URL}`, {
  //       method: 'POST',
  //       body,
  //       headers: getHeaders(),
  //     })
  //     return { data, error: null }
  //   } catch (error) {
  //     console.error('Error creating user:', error)
  //     return { data: null, error }
  //   }
  // }

  // Update an existing user
  const updateUser = async (id: any, body: any) => {
    const { data, error } = await useFetch(`${API_URL}/${id}`, {
      // @ts-expect-error
      method: 'PATCH',
      body,
      headers: getHeaders(),
    })
    if (error.value) {
      console.error('Error updating user:', error.value)
    }
    return {data, error}
  }
  // const updateUser = async (id: any, body: any) => {
  //   try {
  //     const data = await $fetch(`${API_URL}/${id}`, {
  //       // @ts-expect-error
  //       method: 'PATCH',
  //       body,
  //       headers: getHeaders(),
  //       key: `user-${id}`,
  //       cache: 'default',
  //     })
  //     return { data, error: null }
  //   } catch (error) {
  //     console.error('Error updating user:', error)
  //     return { data: null, error }
  //   }
  // }

  // Get a user by ID
  const getUser = async (id: string) => {
    const { data, error } = await useFetch(`${API_URL}/${id}`, {
      method: 'GET',
      headers: getHeaders(),
      key: `user-${id}`,
      cache: 'default',
    })
    if (error.value) {
      console.error('Error fetching user:', error.value)
    }
    return {data, error}
  }
  // const getUser = async (id: string) => {
  //   try {
  //     const data = await $fetch(`${API_URL}/${id}`, {
  //       method: 'GET',
  //       headers: getHeaders(),
  //       key: `user-${id}`,
  //       cache: 'default',
  //     })
  //     return { data, error: null }
  //   } catch (error) {
  //     console.error('Error fetching user:', error)
  //     return { data: null, error }
  //   }
  // }

  // Get all users
  const getUsers = async () => {
    const { data, pending, refresh, error } = await useFetch(`${API_URL}`, {
      method: 'GET',
      headers: getHeaders(),
      key: 'user-list',
      cache: 'default',
    })
    if (error.value) {
      console.error('Error fetching users:', error.value)
    }
    watch( data, users => {
      if( users )
        store.setUsers( users )
    }, { immediate: true })
    return { users, pending, refresh, error }
  }

  return {
    createUser,
    updateUser,
    getUser,
    getUsers,
  }
}

export default useUser
