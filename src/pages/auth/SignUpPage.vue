<script setup lang="ts">
  import { inject, ref } from 'vue';
  import Modal from '../../components/Modal.vue';

  const baseUrl = inject<string>("AuthServiceUrl")

  const message = ref("")

  const credentials = ref({
    email: "",
    password: "",
    confirmPassword: ""
  })

  const loading = ref<boolean>(false)

  type credentialsType = "email" | "password" |"confirmPassword";

  const validationErrors = ref<Record<credentialsType, string>>({
    email: '',
    password: '',
    confirmPassword: ""
  })
  const validateForm = () : boolean => {
    const form = credentials.value
    const validEmail = /^\S+@\S+\.\S+$/.test(form.email)
    const validPassword = form.password.length >= 6
    const validConfirmPassword = form.confirmPassword === form.password
    if(!validEmail) validationErrors.value.email = "The email is not valid"
    if(!validPassword) validationErrors.value.password = "The password must have at least 6 characters"
    if(!validConfirmPassword) validationErrors.value.confirmPassword = "The passwords do not match"
    if(validEmail && validPassword && validConfirmPassword) return true;
    return false;
  }
  const populateErrors = (key: string, msg: string) => {
    const firstChar = key.charAt(0).toLocaleLowerCase()
    const restOfKey = key.substring(1, key.length)
    key = `${firstChar}${restOfKey}`
    console.log(key)
    for(let validationErrorKey in validationErrors.value) {
      if(validationErrorKey === key) {
        validationErrors.value[validationErrorKey as credentialsType] = msg
      }
    }
  }
  const removeErrors = () => {
    validationErrors.value.email = ""
    validationErrors.value.password = ""
    validationErrors.value.confirmPassword = ""
  }
  const signUpAsync = async () => {
    loading.value = true;
    message.value = ""
    removeErrors()
    if(!validateForm()) return
    const res = await fetch(`${baseUrl}/signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: credentials.value.email, password: credentials.value.password, confirmPassword: credentials.value.confirmPassword})
    })
    if(!res.ok && res.status !== 400) {
      const errorText = await res.text();
      loading.value = false;
      message.value = errorText
    }
    const data = await res.json()
    if(res.status === 400 && data.errors) {
      console.log(data.errors)
      for(const key in data.errors){
        const msg = data.errors[key].join(" ")
        populateErrors(key, msg)
      }
      loading.value = false;
      return
    }
    loading.value = false;
    message.value = "You have successfully signed up, please confirm your password"
  }
</script>

<template>
  <Modal v-if="message"  :message="message"/>
  <div class="form-container">
    <h2 class="form-title">Sign Up</h2>
    <form @submit.prevent="signUpAsync" class="form">
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
      <input
        v-model.trim="credentials.confirmPassword"
        type="password"
        name="confirmPassword"
        placeholder="Password"
        class="form-input"
      />
      <span class="text-danger" v-if="validationErrors.confirmPassword">{{ validationErrors.confirmPassword }}</span>
      <button type="submit" class="submit-button">Sign Up</button>
    </form>
  </div>
</template>