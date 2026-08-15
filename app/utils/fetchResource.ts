// Generic fetch helper with cache and key support
export async function fetchResource(
  endpoint: string,
  getHeaders: () => any,
  method: 'GET' | 'POST' | 'PATCH' = 'GET',
  body?: any,
  cacheKey?: string
) {
  const options: any = {
    method,
    headers: getHeaders(),
  }
  // En SSR reenviamos la cookie de sesión; en el cliente viaja automáticamente.
  if (import.meta.server) {
    options.headers = { ...options.headers, ...useRequestHeaders(['cookie']) }
  }
  if (body) options.body = body
  if (cacheKey) {
    options.key = cacheKey
    options.cache = 'default'
  }

  const { data, error, pending, refresh } = await useFetch(endpoint, options)
  if (error.value) {
    console.error(`Error in ${method} ${endpoint}:`, error.value)
  }
  return { data, error, pending, refresh }
}
