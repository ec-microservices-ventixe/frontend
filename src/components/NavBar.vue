<script setup lang="ts">
import { inject, onMounted, ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { useTemplateRef } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

const router = useRouter()
const loggedIn = ref(false)
const open = ref(false)
const mobileNav = useTemplateRef<HTMLElement>('mobile-nav-ref')
const authUrl = inject<string>("AuthServiceUrl")
onClickOutside(mobileNav, _ => open.value = false)
onMounted(() => {
    const token = localStorage.getItem('ventixeAccessToken')
    if(token) {
        loggedIn.value = true
    }
})
async function signOut() {
  try {
    const res = await fetch(`${authUrl}/signout`, { method: 'POST', credentials: 'include',headers: {'Content-Type': 'application/json'}})
    if (res.ok) {
      loggedIn.value = false
      localStorage.removeItem('ventixeAccessToken') 
      router.push("/")
    } else {
      console.error('Failed to sign out')
    }
  } catch (error) {
    console.error('Sign out error:', error)
  }
}
</script>

<template>
    <div class="mobile-nav-container">
        <button class="burger-menu" @click="open = !open">
            <font-awesome-icon :icon="['fas', 'bars']" size="lg" />
        </button>
        <nav v-show="open" class="mobile-nav" ref="mobile-nav-ref">
            <RouterLink to="/">Events</RouterLink>
            <RouterLink to="/bookings">Bookings</RouterLink>
            <RouterLink v-if="!loggedIn" to="/auth/signin">Sign In / up</RouterLink>
            <button v-if="loggedIn" @click="signOut">Sign Out</button>
        </nav>
    </div>
    <div class="nav-container">
        <nav class="nav">
            <RouterLink to="/">Events</RouterLink>
            <RouterLink to="/bookings">Bookings</RouterLink>
            <RouterLink v-if="!loggedIn" to="/auth/signin">Sign In / up</RouterLink>
            <button v-if="loggedIn" @click="signOut">Sign Out</button>
        </nav>
    </div>
</template>

<style scoped>
.nav-container {
    display: none;
}
.mobile-nav {
    background-color: var(--primary-50);
    display: flex;
    z-index: 1000;
    flex-direction: column;
    align-items: center;
    border-radius: 8px;
    column-gap: 8px;
    row-gap: 12px;
    padding-top: 8px;
    padding-bottom: 8px;
    width: 35vh;
    height: auto;
    position: absolute;
    right: 0.75em;
    top: 3em;
}
@media (min-width: 420px) {
    .mobile-nav-container {
        display: none;
    }
    .nav-container {
        display: block;
    }
    .nav {
        display: flex;
        flex-direction: column;
        row-gap: 18px;
    }
}
</style>