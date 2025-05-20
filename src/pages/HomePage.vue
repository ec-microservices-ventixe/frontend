<script setup lang="ts">
import { onMounted } from 'vue';

    const getEvents = async () => {
        const url = "https://ventixe-event-service-cjebcpbnf0ejcnbw.swedencentral-01.azurewebsites.net"
        const res = await fetch(`${url}/events`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
            },
        })
        if(res.status === 401) {
            const res = await fetch(`https://ventixe-auth-service-bxfpa3epcchzazgp.swedencentral-01.azurewebsites.net/refresh-token`, {
            method: "POST",
            credentials: 'include',
            headers: {
            'Content-Type': 'application/json',
            },
        })
        const token = res.headers.get("Bearer-Token")
        if (token) {
            localStorage.setItem("accessToken", token); 
        }
        const data = await res.json()
        console.log(data)
        }
        console.log(res)
        const data = await res.json()
        console.log(data)
    }
    
    onMounted(() => getEvents())

</script>

<template>
    <div class="card-view">
        <div class="card">
            <p>name</p>
            <p>description</p>
        </div>
    </div>
</template>

<style scoped>
.card-view {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
}
.card {
    width: 90%;
    height: 350px;
    border-radius: 12px;
    background-color: var(--gray-20);
}
</style>