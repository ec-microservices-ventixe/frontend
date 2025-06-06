<script setup lang="ts">
import { inject, ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { useTemplateRef } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useTokenManager } from '../Composables/UseTokenManager'

const tokenManager = useTokenManager()
const router = useRouter()
const open = ref(false)
const authUrl = inject<string>("AuthServiceUrl")
const mobileNav = useTemplateRef<HTMLElement>('mobile-nav-ref')
onClickOutside(mobileNav, _ => open.value = false)

async function signOut() {
  try {
    const res = await fetch(`${authUrl}/signout`, { method: 'POST', credentials: 'include', headers: {'Content-Type': 'application/json'}})
    if (res.ok) {
      tokenManager.clearToken()
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
            <RouterLink v-if="!tokenManager.isAuthenticated.value" to="/auth/signin">Sign In / up</RouterLink>
            <button class="logout-btn" v-if="tokenManager.isAuthenticated.value" @click="signOut">Sign Out</button>
        </nav>
    </div>
    <div class="nav-container">
        <nav class="nav">
            <RouterLink to="/">
                <font-awesome-icon :icon="['fa', 'calendar']" size="md" />
                <span class="link-text">Events</span>
            </RouterLink>
            <RouterLink to="/bookings">
                <font-awesome-icon :icon="['fa', 'calendar-check']" size="md" />
                <span class="link-text">Bookings</span>
            </RouterLink>
            <RouterLink v-if="!tokenManager.isAuthenticated.value" to="/auth/signin">
                <font-awesome-icon :icon="['fa', 'lock']" size="md" />
               <span class="link-text">Sign in/up</span>
            </RouterLink>
            <button class="logout-btn" v-if="tokenManager.isAuthenticated.value" @click="signOut">
                <font-awesome-icon :icon="['fa', 'arrow-left']" size="md" />
                <span class="link-text">Sign Out</span>
            </button>
        </nav>
    </div>
</template>

<style scoped>
.nav-container {
    display: none;
}
.logout-btn {
    background-color: transparent;
    color: var(--secondary-100)
}
.link-text {
    margin-left: 5px;
    font-size: 14px;
    @media(max-width: 920px) {
        display: none;
    }
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