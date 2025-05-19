<script setup lang="ts">
import { ref } from 'vue';
    const email = ref("")
    const password = ref("")

    const signInAsync = async () => {
        const baseUrl = "https://ventixe-auth-service-bxfpa3epcchzazgp.swedencentral-01.azurewebsites.net"
        const res = await fetch(`${baseUrl}/signin`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email: email.value, password: password.value })
        })
        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Request failed: ${res.status} - ${errorText}`);
        }
        const token = res.headers.get("Bearer-Token")
        if (token) {
            localStorage.setItem("accessToken", token); 
        }
        const data = await res.json();
        alert(data.message)
    }
</script>

<template>
    <div>
        <h2>Sign In</h2>
        <form @submit.prevent="signInAsync">
            <input v-model.trim="email" type="text" name="email" placeholder="name@domain.com">
            <input v-model.trim="password" type="password" name="password">
            <button type="submit">Sign In</button>
        </form>
    </div>
</template>