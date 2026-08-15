import { useWrsStore } from "~/store/wrs"

const resourceName = 'wr'

const useWR = () => {
  const store = useWrsStore()
  const API_URL = `/api/${resourceName}s`

  // Helper for headers
  const getHeaders = () => ({
    'Content-Type': 'application/json',
  })

  // Create WR
  const createWR = (body: any) =>
    fetchResource(API_URL, getHeaders, 'POST', body)

  // Update WR
  const updateWR = (id: string, body: any) =>
    fetchResource(`${API_URL}/${id}`, getHeaders, 'PATCH', body)

  // Get wrs by ID
  const getWR = (id: string) =>
    fetchResource(`${API_URL}/${id}`, getHeaders, 'GET', undefined, `${resourceName}-${id}`)

  // Get all wrs
  const getWrs = async (query: any) => {
    // const { data, error, pending, refresh } = await fetchResource(API_URL, getHeaders, 'GET', undefined, `${resourceName}-list`)
    // watch(() => data.value, wrs => {
    //   if (wrs) store.setWrs(wrs)
    // }, { immediate: true })
    // return { wrs: data, error, pending, refresh }
    const queryString = new URLSearchParams(query).toString()
    const wrs = await $fetch(`${API_URL}?${queryString}`, {
      headers: getHeaders()
    })
    store.setWrs(wrs)
    return { wrs }
  }


  const sendEmailWr = async (id: string ) => 
    fetchResource(`${API_URL}/send-email/${id}`, getHeaders, 'GET', undefined)

  return {
    createWR,
    updateWR,
    getWR,
    getWrs,
    sendEmailWr
  }
}

export default useWR
