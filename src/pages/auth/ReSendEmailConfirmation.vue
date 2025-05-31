<script setup lang="ts">
import { inject, ref } from 'vue';
import Modal from '../../components/Modal.vue';
const authUrl = inject("AuthServiceUrl")

    const email = ref<string>("")
    const message = ref("")
    const loading = ref(false)

    const ResendEmailConfirmation = async () => {
        loading.value = true
        const res = await fetch(`${authUrl}/resend-email-confirmation?email=${email.value}`, {
            method: 'POST',
        })
        const data = await res.json()
        message.value = data.message
        loading.value = false
    }
</script>

<template>
    <Modal v-if="message" :message="message"/>
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
            <button type="submit" class="submit-button">Resend confiramtion email</button>
        </form>
    </div>
</template>
