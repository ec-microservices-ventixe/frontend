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
    const showModal = ref(false)
    const loading = ref(false)

    const confirmEmail = async () => {
        loading.value = true
        const res = await fetch(`${authUrl}/confirm-email?email=${email.value}&token=${token.value}`, {
            method: 'POST',
        })
        const data = await res.json()
        if(res.ok) {
            router.push("auth/signin")
        }
        message.value = data.message
        showModal.value = true
        loading.value = false
    }
</script>
<template>
    <Modal :show="showModal" :message="message"/>
    <div class="form-container">
        <button @click="confirmEmail" class="btn btn-lg btn-primary">{{ loading ? "Loading..." : "Confirm Email" }}</button>
    </div>
</template>

<style scoped>
    div {
        display: flex;
        justify-content: center;
    }
</style>