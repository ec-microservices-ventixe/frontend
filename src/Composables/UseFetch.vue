<script lang="ts">
import { inject, ref } from 'vue'
import { useRouter } from 'vue-router'

export function useFetch<TData = unknown>(url: string, authorization = false ) {
  const AuthServiceUrl = inject<string>("AuthServiceUrl")
  const router = useRouter()
  const loading = ref(false)
  const error = ref<string>()
  const data = ref<TData>()

  const fetchData = async () => {
    loading.value = true
    try {
      const headers: Record<string, string> = {}
      if (authorization) {
        headers["Authorization"] = `Bearer ${localStorage.getItem("accessToken") || ''}`
      }
      let res = await fetch(url, { headers })
      if (res.status === 401 && authorization) {
        const refreshRes = await fetch(`${AuthServiceUrl}/refresh-token`, { method: "POST", credentials: 'include', headers: { 'Content-Type': 'application/json' }})
        const newToken = refreshRes.headers.get("Bearer-Token")
        if (!newToken) {
          router.push("/auth/signin")
          loading.value = false
          return
        }
        localStorage.setItem("accessToken", newToken)
        headers["Authorization"] = `Bearer ${newToken}`
        res = await fetch(url, { headers })
      }
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
</script>