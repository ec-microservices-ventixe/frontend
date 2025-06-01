<template>
  <slot></slot>
</template>

<script setup lang="ts">
import { provide, ref } from 'vue'
import type { Ref } from 'vue'

defineOptions({ name: 'CurrentUserProvider' })

interface IUser {
  authenticated: boolean;
  role: string;
  email: string;
}

interface ICurrentUserContext {
  currentUser: Ref<IUser>;
  updateCurrentUser: (authenticated: boolean, role: string, email: string) => void;
}

const currentUser = ref<IUser>({
  authenticated: false,
  role: "User",
  email: ""
})

function updateCurrentUser(authenticated: boolean, role: string, email: string): void {
    console.log("hi")
  currentUser.value = { authenticated, role, email }
  console.log(currentUser.value)
}

const currentUserContext: ICurrentUserContext = {
  currentUser,
  updateCurrentUser
}

provide<ICurrentUserContext>('CurrentUser', currentUserContext)
</script>
