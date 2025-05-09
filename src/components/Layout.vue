<script setup lang="ts">
import NavBar from '../components/NavBar.vue'
</script>

<template>
  <div class="layout-grid">
    <header class="header">
      <NavBar />
    </header>
    <div class="top-bar"></div>
    <nav class="side-bar"></nav>
    <main class="page-content"></main>
    <footer class="footer"></footer>
  </div>
</template>

<style scoped>
.layout-grid {
  display: grid;
  width: 100%;
  height: 100vh;
  grid-template-areas: 
    "header header"
    "pageContent pageContent"
    "footer footer";
  grid-template-rows: 60px 1fr 50px;
  grid-template-columns: 150px 1fr;
}
.header {
  grid-area: header;
  background-color: #8ca0ff;
}
.top-bar {
  grid-area: topBar;
  background-color: #8cafff;
} 
.side-bar {
  grid-area: sideBar;
  background-color: #3aafff;
}
.page-content {
  grid-area: pageContent;
  background-color: #3affff;
} 
.footer {
  grid-area: footer;
  background-color: #8ca6ff;
} 
.layout-grid {
  @media (min-width: 420px) {
    grid-template-areas: 
      "header topBar"
      "sideBar pageContent"
      "sideBar footer";
    grid-template-rows: 60px 1fr 35px;
    grid-template-columns: 60px 1fr;
    }
  @media (min-width: 920px) {
    grid-template-areas: 
      "header topBar"
      "sideBar pageContent"
      "sideBar footer";
    grid-template-rows: 60px 1fr 35px;
    grid-template-columns: 150px 1fr;
  }
}
</style>