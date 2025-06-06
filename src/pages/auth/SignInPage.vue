<script setup lang="ts">
import { inject, ref } from 'vue';
import { useRouter } from 'vue-router';
import Modal from '../../components/Modal.vue';
import { useTokenManager } from '../../Composables/UseTokenManager';

const baseUrl = inject<string>("AuthServiceUrl")
const tokenManager = useTokenManager()
const router = useRouter()
const credentials = ref({
  email: "",
  password: ""
})
const message = ref("")
const showModal = ref(false)
const closeModal = () => showModal.value = !showModal.value;

const loading = ref<boolean>(false)
type credentialsType = "email" | "password";
const validationErrors = ref<Record<credentialsType, string>>({
  email: '',
  password: ''
})
const populateErrors = (key: string, msg: string) => {
  key = key.toLowerCase();
  for(let validationErrorKey in validationErrors.value) {
    if(validationErrorKey === key) {
      validationErrors.value[validationErrorKey as credentialsType] = msg
    }
  }
}
const removeErrors = () => {
  validationErrors.value.email = ""
  validationErrors.value.password = ""
}
const signInAsync = async () => {
  loading.value = true;
  removeErrors();
  try {
    const res = await fetch(`${baseUrl}/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: credentials.value.email,
        password: credentials.value.password
      })
    });

    const contentType = res.headers.get("Content-Type");

    if (!res.ok && res.status !== 400) {
      const errorText = contentType?.includes("application/json") ? (await res.json()).message : await res.text();
      showModal.value = true;
      message.value = errorText || "An unknown error occurred.";
      return;
    }

    const data = await res.json();

    if (res.status === 400 && data.errors) {
      for (const key in data.errors) {
        const msg = data.errors[key][0];
        populateErrors(key, msg);
      }
      return;
    }

    const token = res.headers.get("Bearer-Token");
    if (token) {
      tokenManager.setToken(token);
      router.push("/");
    } else {
      showModal.value = true;
      message.value = "Something went wrong while signing in.";
    }
  } catch (err) {
    showModal.value = true;
    message.value = "Network error or server is unreachable.";
  } finally {
    loading.value = false;
  }
};

</script>

<template>
  <Modal :show="showModal" @close="closeModal" :message="message"/>
  <div class="form-container">
    <h2 class="form-title">Sign In</h2>
    <form @submit.prevent="signInAsync" class="form">
      <input
        v-model.trim="credentials.email"
        type="text"
        name="email"
        placeholder="name@domain.com"
        class="form-input"
      />
      <span class="text-danger" v-if="validationErrors.email">{{ validationErrors.email }}</span>
      <input
        v-model.trim="credentials.password"
        type="password"
        name="password"
        placeholder="Password"
        class="form-input"
      />
      <span class="text-danger" v-if="validationErrors.password">{{ validationErrors.password }}</span>
      <button :disabled="loading" type="submit" class="submit-button">{{loading ? "Loading..." : "Sign In"}}</button>
    </form>
    <p>Create an account here <RouterLink class="a-link" to="/auth/signup">Sign up</RouterLink></p>
  </div>
</template>
