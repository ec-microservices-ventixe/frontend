<script setup lang="ts">
import { ref } from 'vue'

const token = localStorage.getItem('ventixeAccessToken')
let currentUser = ref({loggedIn: false, role: ""})
if(token) {
const tokenParts = token.split('.')
const payload = JSON.parse(atob(tokenParts[1]))
const role = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
currentUser.value.loggedIn = true
currentUser.value.role = role
}
</script>
<template>
    <div class="container">
        <p v-if="currentUser.loggedIn" class="role">Logged in as {{ currentUser.role }}</p>
    </div>
</template>

<style scoped>
.container {
    display: flex;
    justify-content: flex-end;
    padding-right: 30px;
    padding-left: 30px;
    padding-top: 22px;
}
</style>