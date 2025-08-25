import { usePackagesStore } from "~/store/packages"

const resourceName = 'package'
const store = usePackagesStore()
// const { clients } = storeToRefs(store)

const usePackage = () => {
  const { token } = useAuth()
  const API_URL = `/api/${resourceName}s`

  // Helper for headers
  const getHeaders = () => ({
    Authorization: `${token.value}`,
    'Content-Type': 'application/json',
  })

  // Create package
  const createPackage = (body: any) =>
    fetchResource(API_URL, getHeaders, 'POST', body)

  // Update package
  const updatePackage = (id: string, body: any) =>
    fetchResource(`${API_URL}/${id}`, getHeaders, 'PATCH', body)

  // Get packages by ID
  const getPackage = (id: string) =>
    fetchResource(`${API_URL}/${id}`, getHeaders, 'GET', undefined, `${resourceName}-${id}`)

  // const response = await $fetch(`/api/packages?${queryString}`)

  // Get all packages
  const getPackages = async (query:any) => {
    const queryString = new URLSearchParams(query).toString()
    console.log('Fetching packages with queryString:', queryString)
    // const { data, error, pending, refresh } = await fetchResource(`${API_URL}?${queryString}`, getHeaders, 'GET', undefined, `${resourceName}-list`)
    const { data, error, pending, refresh } = await fetchResource(`${API_URL}?${queryString}`, getHeaders, 'GET')
    watch(() => data.value, packages => {
      if (packages) store.setPackages(packages)
    }, { immediate: true })
    return { packages: data, error, pending, refresh }
  }

  // Get packages by WR
  const getPackagesByWR = async (dataId: string) => {
    // const { data, error, pending, refresh } = await fetchResource(`${API_URL}/wr/${dataId}`, getHeaders, 'GET', undefined)
    const { data, error, pending, refresh } = await fetchResource(`${API_URL}/wr/${dataId}`, getHeaders, 'GET')
    // watch(() => data.value, packagesByWR => {
    //   if (packagesByWR) store.setPackagesByWR(packagesByWR)
    // }, { immediate: true })
    return { packagesByWR: data, error, pending, refresh }
  }

  return {
    createPackage,
    updatePackage,
    getPackage,
    getPackages,
    getPackagesByWR
  }
}

export default usePackage