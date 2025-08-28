import { get } from "mongoose"
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

  // Get all packages
  const getPackages = async (query: any) => {
    const queryString = new URLSearchParams(query).toString()
    const packages = await $fetch(`${API_URL}?${queryString}`, {
      headers: getHeaders()
    })
    store.setPackages(packages)
    return { packages }
  }

  // Get packages by WR
  const getPackagesByWR = async (dataId: string, query: any) => {
    const queryString = new URLSearchParams(query).toString()
    const packagesByWR = await $fetch(`${API_URL}/wr/${dataId}?${queryString}`, {
      headers: getHeaders()
    })
    store.setPackagesByWR(packagesByWR)
    return { packagesByWR }
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