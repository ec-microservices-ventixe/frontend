<script setup lang="ts">
import { inject, ref } from 'vue';
import { useRouter } from 'vue-router';

const baseUrl = inject<string>("AuthServiceUrl")
const router = useRouter()

const credentials = ref({
  email: "",
  password: ""
})

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
  removeErrors()
  const res = await fetch(`${baseUrl}/signin`, {
      method: "POST",
      credentials: 'include',
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify({ email: credentials.value.email, password: credentials.value.password})
  })
  if(!res.ok && res.status !== 400) {
    const errorText = await res.text();
    loading.value = false;
    alert(errorText)
  }
  const data = await res.json()
  if(res.status == 400 && data.errors) {
    for(const key in data.errors){
      const msg = data.errors[key][0]
      populateErrors(key, msg)
    }
    loading.value = false;
    return
  }
  const token = res.headers.get("Bearer-Token")
  if (token) {
      localStorage.setItem("accessToken", token); 
  }
  loading.value = false;
  router.push("/")
}
</script>

<template>
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
      <button :disabled="loading" type="submit" class="submit-button">Sign In</button>
    </form>
  </div>
</template>
