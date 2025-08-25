import { useCarriersStore } from "~/store/carriers"

const resourceName = 'carrier'
const store = useCarriersStore()
// const { clients } = storeToRefs(store)

const useCarrier = () => {
  const { token } = useAuth()
  const API_URL = `/api/${resourceName}s`

  // Helper for headers
  const getHeaders = () => ({
    Authorization: `${token.value}`,
    'Content-Type': 'application/json',
  })

  // Create carrier
  const createCarrier = (body: any) =>
    fetchResource(API_URL, getHeaders, 'POST', body)

  // Update carrier
  const updateCarrier = (id: string, body: any) =>
    fetchResource(`${API_URL}/${id}`, getHeaders, 'PATCH', body)

  // Get carriers by ID
  const getCarrier = (id: string) =>
    fetchResource(`${API_URL}/${id}`, getHeaders, 'GET', undefined, `${resourceName}-${id}`)

  // Get all carriers
  const getCarriers = async () => {
    const { data, error, pending, refresh } = await fetchResource(API_URL, getHeaders, 'GET', undefined, `${resourceName}-list`)
    watch(() => data.value, carriers => {
      if (carriers) store.setCarriers(carriers)
    }, { immediate: true })
    return { carriers: data, error, pending, refresh }
  }

  return {
    createCarrier,
    updateCarrier,
    getCarrier,
    getCarriers,
  }
}

export default useCarrier