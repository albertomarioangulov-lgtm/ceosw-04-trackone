import { useClientsStore } from "~/store/clients"

const resourceName = 'client'
const store = useClientsStore()
// const { clients } = storeToRefs(store)

const useClient = () => {
  const { token } = useAuth()
  const API_URL = `/api/${resourceName}s`

  // Helper for headers
  const getHeaders = () => ({
    Authorization: `${token.value}`,
    'Content-Type': 'application/json',
  })

  // Create client
  const createClient = (body: any) =>
    fetchResource(API_URL, getHeaders, 'POST', body)

  // Update client
  const updateClient = (id: string, body: any) =>
    fetchResource(`${API_URL}/${id}`, getHeaders, 'PATCH', body)

  // Get clients by ID
  const getClient = (id: string) =>
    fetchResource(`${API_URL}/${id}`, getHeaders, 'GET', undefined, `${resourceName}-${id}`)

  // Get all clients
  const getClients = async () => {
    const { data, error, pending, refresh } = await fetchResource(API_URL, getHeaders, 'GET', undefined, `${resourceName}-list`)
    watch(() => data.value, clients => {
      if (clients) store.setClients(clients)
    }, { immediate: true })
    return { clients: data, error, pending, refresh }
  }


  const sendEmail = async (id: string ) => 
    fetchResource(`${API_URL}/send-email/${id}`, getHeaders, 'GET', undefined)

  

  return {
    createClient,
    updateClient,
    getClient,
    getClients,
    sendEmail
  }
}

export default useClient