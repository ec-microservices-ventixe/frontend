<template>
  <slot></slot>
</template>

<script setup lang="ts">
import { provide, ref } from 'vue'
import type { ICurrentUserContext, IUser } from '../Interfaces/ICurrentUserContext'

defineOptions({ name: 'CurrentUserProvider' })

const currentUser = ref<IUser>({
  authenticated: false,
  role: "User",
  email: ""
})

function updateCurrentUser(authenticated: boolean, role: string, email: string): void {
  currentUser.value = { authenticated, role, email }
}

const currentUserContext: ICurrentUserContext = {
  currentUser,
  updateCurrentUser
}

provide<ICurrentUserContext>('CurrentUser', currentUserContext)
</script>
