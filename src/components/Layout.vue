<script setup lang="ts">
import HeaderContent from '../components/HeaderContent.vue'
import TopBar from '../components/TopBar.vue';
</script>

<template>
  <div class="layout-grid">
    <header class="header">
      <HeaderContent/>
    </header>
    <div class="top-bar">
      <TopBar/>
    </div>
    <main class="page-content">
      <routerView />
    </main>
    <footer class="footer"></footer>
  </div>
</template>

<style scoped>
.layout-grid {
  display: grid;
  width: 100%;
  height: 100vh;
  grid-template-areas: 
    "header"
    "pageContent"
    "footer";
  grid-template-rows: 60px 1fr 50px;
  grid-template-columns: 1fr;
}
.header {
  grid-area: header;
}
.top-bar {
  grid-area: topBar;
  border-radius: 8px;
  display: none;
} 
.page-content {
  grid-area: pageContent;
  justify-content: center;
} 
.footer {
  grid-area: footer;
} 
.layout-grid {
  @media (min-width: 420px) {
    grid-template-areas: 
      "header topBar"
      "header pageContent"
      "header footer";
    grid-template-rows: 60px 1fr 35px;
    grid-template-columns: 60px 1fr;
    }
  @media (min-width: 920px) {
    grid-template-rows: 60px 1fr 35px;
    grid-template-columns: 150px 1fr;
  }
}
</style>