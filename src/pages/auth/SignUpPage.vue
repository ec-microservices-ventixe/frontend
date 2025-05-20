<script setup lang="ts">
import { ref } from 'vue';
    const email = ref("")
    const password = ref("")

    const signUpAsync = async () => {
    }
</script>

<template>
  <div class="signup-container">
    <h2 class="signup-title">Sign Up</h2>
    <form @submit.prevent="signUpAsync" class="signup-form">
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
      <input
        v-model.trim="password"
        type="password"
        name="password"
        placeholder="Password"
        class="form-input"
      />
      <button type="submit" class="submit-button">Sign Up</button>
    </form>
  </div>
</template>

<style scoped>
.signup-container {
  max-width: 400px;
  margin: 5rem auto;
  padding: 2rem;
  background-color: var(--cool-gray-10);
  border-radius: 1rem;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.signup-title {
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 1.75rem;
  color: var(--cool-gray-100);
}

.signup-form {
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