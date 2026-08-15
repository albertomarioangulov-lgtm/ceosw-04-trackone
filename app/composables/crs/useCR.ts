import { useCrsStore } from "~/store/crs"

const resourceName = 'cr'

const useCR = () => {
  const store = useCrsStore()
  const API_URL = `/api/${resourceName}s`

  // Helper for headers
  const getHeaders = () => ({
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
  const getCrs = async (query: any) => {
    // const { data, error, pending, refresh } = await fetchResource(API_URL, getHeaders, 'GET', undefined, `${resourceName}-list`)
    // watch(() => data.value, crs => {
    //   if (crs) store.setCrs(crs)
    // }, { immediate: true })
    // return { crs: data, error, pending, refresh }
    const queryString = new URLSearchParams(query).toString()
    const crs = await $fetch(`${API_URL}?${queryString}`, {
      headers: getHeaders()
    })
    // Opcional: actualiza el store si lo necesitas
    store.setCrs(crs)
    return { crs }
  }

  const sendEmailCr = async (id: string ) => 
    fetchResource(`${API_URL}/send-email/${id}`, getHeaders, 'GET', undefined)

  return {
    createCR,
    updateCR,
    getCR,
    getCrs,
    sendEmailCr
  }
}

export default useCR
