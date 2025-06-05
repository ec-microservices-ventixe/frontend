<script setup lang="ts">
import { inject, ref } from 'vue';
import Modal from '../../components/Modal.vue';
const authUrl = inject("AuthServiceUrl")

    const email = ref<string>("")
    const message = ref("")
    const showModal = ref(false)
    const closeModal = () => showModal.value = !showModal.value

    const loading = ref(false)

    const ResendEmailConfirmation = async () => {
        loading.value = true
        const res = await fetch(`${authUrl}/resend-email-confirmation?email=${email.value}`, {
            method: 'POST',
        })
        const data = await res.json()
        message.value = data.message
        showModal.value = true
        loading.value = false
    }
</script>

<template>
    <Modal :show="showModal" @close="closeModal" :message="message"/>
    <div class="form-container">
        <h2 class="form-title">Resend email confirmation</h2>
        <form @submit.prevent="ResendEmailConfirmation" class="form">
            <input
            v-model.trim="email"
            type="text"
            name="email"
            placeholder="name@domain.com"
            class="form-input"
            />
            <button :disabled="loading" type="submit" class="submit-button">{{loading ? "Loading..." : "Resend confiramtion email"}}</button>
        </form>
    </div>
</template>
