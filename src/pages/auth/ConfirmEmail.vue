<script setup lang="ts">
import { inject, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Modal from '../../components/Modal.vue';
const authUrl = inject("AuthServiceUrl")

    const route = useRoute();
    const router = useRouter();
    const email = ref<string>(route.query.email as string)
    const token = ref<string>(route.query.token as string)
    const message = ref("")

    const confirmEmail = async () => {
        console.log(authUrl)
        const res = await fetch(`${authUrl}/confirm-email?email=${email.value}&token=${token.value}`, {
            method: 'POST',
        })
        const data = await res.json()
        if(res.ok) {
            router.push("auth/signin")
        }
        message.value = data.message
    }
</script>

<template>
    <Modal v-if="message" :message="message"/>
    <div class="form-container">
        <button @click="confirmEmail" class="btn btn-lg btn-primary">Confirm Email: {{ email }}</button>
    </div>
</template>

<style scoped>
    div {
        display: flex;
        justify-content: center;
    }
</style>