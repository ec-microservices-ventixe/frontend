<script setup lang="ts">
    import NavBar from '../components/NavBar.vue'
</script>


<template>
    <div class="header">
        <h1 class="logo">Logo</h1>
        <h2 class="current-page">Current Page</h2>
        <NavBar/>
    </div>
</template>

<style scoped>
.header {
    width: 94%;
    height: 96%;
    margin: auto auto;
    padding-right: 16px;
    padding-left: 16px;
    border-radius: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: var(--cool-gray-10);
}
</style>