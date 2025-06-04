<script setup lang="ts">
    import NavBar from '../components/NavBar.vue'
</script>

<template>
    <div class="header">
        <div class="logo-container">
            <img src="../assets/ventixe-logo.png" alt="ventixe">
            <span class="ventixe-name">Ventixe</span>
        </div>
        <h2 class="current-page">Current Page</h2>
        <NavBar/>
    </div>
</template>

<style scoped>
.header {
    width: 100%;
    height: 100%;
    margin: 0 auto;
    padding-right: 16px;
    padding-left: 16px;
    border-radius: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: var(--cool-gray-10);
}
.ventixe-name {
    display: none;
}
@media (min-width: 420px) {
    .header {
        flex-direction: column;
        justify-content:flex-start;
        width: 80%;
    }
    .logo-container {
        margin-top: 12px;
        margin-bottom: 14px;
    }
    .current-page {
        display: none;
    }
}
@media (min-width: 920px) {
    .logo-container {
        display: flex;
        align-items: center;
    }
    .ventixe-name {
    display: block;
    }   
}

</style>