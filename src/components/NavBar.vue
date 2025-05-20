<script setup lang="ts">
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { useTemplateRef } from 'vue'
import { RouterLink } from 'vue-router'

const open = ref(false)
const mobileNav = useTemplateRef<HTMLElement>('mobile-nav-ref')
onClickOutside(mobileNav, _ => open.value = false)
</script>

<template>
    <div class="mobile-nav-container">
        <button class="burger-menu" @click="open = !open">
            <font-awesome-icon :icon="['fas', 'bars']" size="lg" />
        </button>
        <nav v-show="open" class="mobile-nav" ref="mobile-nav-ref">
            <RouterLink to="/">Events</RouterLink>
            <RouterLink to="/auth/signin">Sign In</RouterLink>
            <RouterLink to="/auth/signup">Sign Up</RouterLink>
        </nav>
    </div>
    <div class="nav-container">
        <nav class="nav">
            <RouterLink to="/">Events</RouterLink>
            <RouterLink to="/auth/signin">Sign In</RouterLink>
            <RouterLink to="/auth/signup">Sign Up</RouterLink>
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
    flex-direction: column;
    align-items: center;
    border-radius: 8px;
    column-gap: 8px;
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