<script setup lang="ts">
import CurrentUserProvider from "./providers/CurrentUserProvider.vue"
</script>

<template>
   <CurrentUserProvider>
      <RouterView />
   </CurrentUserProvider>
</template>
