import { useCrsStore } from "~/store/crs"

const resourceName = 'cr'
const store = useCrsStore()
// const { clients } = storeToRefs(store)

const useCR = () => {
  const { token } = useAuth()
  const API_URL = `/api/${resourceName}s`

  // Helper for headers
  const getHeaders = () => ({
    Authorization: `${token.value}`,
    'Content-Type': 'application/json',
  })

  // Create CR
  const createCR = (body: any) =>
    fetchResource(API_URL, getHeaders, 'POST', body)

  // Update CR
  const updateCR = (id: string, body: any) =>
    fetchResource(`${API_URL}/${id}`, getHeaders, 'PATCH', body)

  // Get crs by ID
  const getCR = (id: string) =>
    fetchResource(`${API_URL}/${id}`, getHeaders, 'GET', undefined, `${resourceName}-${id}`)

  // Get all crs
  const getCrs = async () => {
    const { data, error, pending, refresh } = await fetchResource(API_URL, getHeaders, 'GET', undefined, `${resourceName}-list`)
    watch(() => data.value, crs => {
      if (crs) store.setCrs(crs)
    }, { immediate: true })
    return { crs: data, error, pending, refresh }
  }

  return {
    createCR,
    updateCR,
    getCR,
    getCrs,
  }
}

export default useCR