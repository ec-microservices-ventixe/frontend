<script setup lang="ts">
import { ref } from 'vue';
    const email = ref("")
    const password = ref("")

    const signInAsync = async () => {
        const baseUrl = "https://ventixe-auth-service-bxfpa3epcchzazgp.swedencentral-01.azurewebsites.net"
        const res = await fetch(`${baseUrl}/signin`, {
            method: "POST",
            credentials: 'include',
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
  <div class="signin-container">
    <h2 class="signin-title">Sign In</h2>
    <form @submit.prevent="signInAsync" class="signin-form">
      <input
        v-model.trim="email"
        type="text"
        name="email"
        placeholder="name@domain.com"
        class="form-input"
      />
      <input
        v-model.trim="password"
        type="password"
        name="password"
        placeholder="Password"
        class="form-input"
      />
      <button type="submit" class="submit-button">Sign In</button>
    </form>
  </div>
</template>

<style scoped>
.signin-container {
  max-width: 400px;
  margin: 5rem auto;
  padding: 2rem;
  background-color: var(--cool-gray-10);
  border-radius: 1rem;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.signin-title {
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 1.75rem;
  color: var(--cool-gray-100);
}

.signin-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-input {
  padding: 0.75rem 1rem;
  border: 1px solid var(--gray-60);
  border-radius: 0.5rem;
  font-size: 1rem;
  outline: none;
}

.form-input:focus {
  border-color: var(--primary-90);
}

.submit-button {
  padding: 0.75rem 1rem;
  background-color: var(--primary-100);
  color: var(--cool-gray-90);
  font-size: 1rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background-color: var(--primary-90);
}
</style>