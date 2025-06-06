import { computed, ref, watch } from "vue";

    const accessToken = ref<string | null>(localStorage.getItem("ventixeAccessToken"))
    const authUrl = "https://localhost:7232"
    watch(accessToken, (newAccessToken) => {
        if (newAccessToken) {
            localStorage.setItem('ventixeAccessToken', newAccessToken)
        } else {
            localStorage.removeItem('ventixeAccessToken')
        }
    })
    const isAuthenticated = computed(() => !!accessToken.value)
    function getCurrentUserRole(): string {
        if (!accessToken.value) return "";
        try {
            const tokenParts = accessToken.value.split('.');
            if (tokenParts.length !== 3) return "";
            const payload = JSON.parse(atob(tokenParts[1]));
            return payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || "";
        } catch (e) {
            console.error("Failed to parse JWT:", e);
            return "";
        }
    }
    async function refreshToken(): Promise<boolean> {
        try {
            const res = await fetch(`${authUrl}/refresh-token`, {
                method: 'POST',
                credentials: 'include'
            });
            if (!res.ok) return false;
            const token = res.headers.get("Bearer-Token");
            if (token) {
                accessToken.value = token;
                return true;
            }

            return false;
        } catch (err) {
            console.error("Refresh token failed:", err);
            return false;
        }
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