<script setup lang="ts">
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { useTemplateRef } from 'vue'

const open = ref(false)
const mobileNav = useTemplateRef<HTMLElement>('mobile-nav-ref')
onClickOutside(mobileNav, event => open.value = false)
</script>

<template>
    <div class="mobile-nav-container">
        <button class="burger-menu" @click="open = !open">
            <font-awesome-icon :icon="['fas', 'bars']" size="lg" />
        </button>
        <nav v-show="open" class="mobile-nav" ref="mobile-nav-ref">
            <p>Events</p>
            <p>bookings</p>
        </nav>
    </div>
    <div class="nav-container">
        <nav class="nav">
            <p>Eve</p>
            <p>book</p>
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