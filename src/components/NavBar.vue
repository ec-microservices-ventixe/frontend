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
</template>

<style scoped>
.mobile-nav-container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    button {
        margin-right: 1em;
    }
    position: relative;

    @media (min-width: 420px) {
        display: none;
    }
}
.mobile-nav {
    background-color: azure;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 8px;
    gap: 4px;
    width: 50%;
    height: auto;
    position: absolute;
    right: 0.75em;
    top: 3em;
}
</style>