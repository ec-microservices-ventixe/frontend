import { computed, ref, watch } from "vue";

    const accessToken = ref<string | null>(localStorage.getItem("ventixeAccessToken"))
    const authUrl = "https://ventixe-auth-service-bxfpa3epcchzazgp.swedencentral-01.azurewebsites.net"
    watch(accessToken, (newAccessToken) => {
        if (newAccessToken) {
            localStorage.setItem('ventixeAccessToken', newAccessToken)
        } else {
            localStorage.removeItem('ventixeAccessToken')
        }
    })
    const isAuthenticated = computed(() => !!accessToken.value)
    function getCurrentUserRole(): string {
        if(!accessToken.value) return "";
        const tokenParts = accessToken.value.split('.')
        const payload = JSON.parse(atob(tokenParts[1]))
        return payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
    } 
    async function refreshToken (): Promise<boolean> {
        const res = await fetch(`${authUrl}/refresh-token`, {
            method: 'POST',
            credentials: 'include'
        })
        const token = res.headers.get("Bearer-Token")
        if(token) {
            accessToken.value = token;
            return true
        }
        return false
    }
export function useTokenManager() {
    return {
        accessToken,
        isAuthenticated,
        setToken: (token: string) => (accessToken.value = token),
        clearToken: () => (accessToken.value = null),
        getToken: () => accessToken.value,
        getCurrentUserRole,
        refreshToken
    }
}