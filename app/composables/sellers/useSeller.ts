import { useSellersStore } from "~/store/sellers"

const resourceName = 'seller'

const useSeller = () => {
  const store = useSellersStore()
  const API_URL = `/api/${resourceName}s`

  // Helper for headers
  const getHeaders = () => ({
    'Content-Type': 'application/json',
  })

  // Create seller
  const createSeller = (body: any) =>
    fetchResource(API_URL, getHeaders, 'POST', body)

  // Update seller
  const updateSeller = (id: string, body: any) =>
    fetchResource(`${API_URL}/${id}`, getHeaders, 'PATCH', body)

  // Get sellers by ID
  const getSeller = (id: string) =>
    fetchResource(`${API_URL}/${id}`, getHeaders, 'GET', undefined, `${resourceName}-${id}`)

  // Get all sellers
  const getSellers = async () => {
    const { data, error, pending, refresh } = await fetchResource(API_URL, getHeaders, 'GET', undefined, `${resourceName}-list`)
    watch(() => data.value, sellers => {
      if (sellers) store.setSellers(sellers)
    }, { immediate: true })
    return { sellers: data, error, pending, refresh }
  }

  return {
    createSeller,
    updateSeller,
    getSeller,
    getSellers,
  }
}

export default useSeller
