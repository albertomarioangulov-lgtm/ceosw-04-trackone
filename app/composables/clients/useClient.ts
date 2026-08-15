const resourceName = 'client'

const useClient = () => {
  const API_URL = `/api/${resourceName}s`

  // Helper for headers
  const getHeaders = () => ({
    'Content-Type': 'application/json',
  })

  // Solo se conserva getClient para wrs/Form.vue hasta migrar WR.
  const getClient = (id: string) =>
    fetchResource(`${API_URL}/${id}`, getHeaders, 'GET', undefined, `${resourceName}-${id}`)

  return {
    getClient,
  }
}

export default useClient
