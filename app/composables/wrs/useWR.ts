import { useWrsStore } from "~/store/wrs"

const resourceName = 'wr'
const store = useWrsStore()
// const { clients } = storeToRefs(store)

const useWR = () => {
  const { token } = useAuth()
  const API_URL = `/api/${resourceName}s`

  // Helper for headers
  const getHeaders = () => ({
    Authorization: `${token.value}`,
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
  const getWrs = async () => {
    const { data, error, pending, refresh } = await fetchResource(API_URL, getHeaders, 'GET', undefined, `${resourceName}-list`)
    watch(() => data.value, wrs => {
      if (wrs) store.setWrs(wrs)
    }, { immediate: true })
    return { wrs: data, error, pending, refresh }
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