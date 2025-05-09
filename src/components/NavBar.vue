<script setup lang="ts">
import { ref } from 'vue'
const open = ref(false)
</script>

<template>
    <button class="burger-menu" @click="open = !open">
        <font-awesome-icon :icon="['fas', 'bars']" size="lg" />
    </button>
    <div v-show="open">
        <p>hello there </p>
    </div>
</template>

<style scoped>
</style>