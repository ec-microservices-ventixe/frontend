import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTokenManager } from './UseTokenManager'

export function useFetch<TData = unknown>(url: string, authorization = false ) {
  const tokenManager = useTokenManager()
  const router = useRouter()
  const loading = ref(false)
  const error = ref<string>()
  const data = ref<TData>()

  const fetchData = async () => {
    loading.value = true
    try {
      const headers: Record<string, string> = {}
      if (authorization) {
        const token = tokenManager.getToken()
        if(token === null) {
          const successfullyGotNewToken = await tokenManager.refreshToken()
          if(!successfullyGotNewToken) {
            return router.push("/auth/signin")
          }
        }
        headers["Authorization"] = `Bearer ${tokenManager.getToken()}`
      }
      let res = await fetch(url, { headers })
      if (!res.ok) {
        error.value = await res.text()
        return
      }
      const resData = await res.json()
      data.value = resData
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
    }
  }

  return {
    data,
    error,
    loading,
    fetch: fetchData()
  }
}