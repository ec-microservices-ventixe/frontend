import { inject } from 'vue'
import type { ICurrentUserContext } from '../Interfaces/ICurrentUserContext'

export function useCurrentUser() {
  const currentUserContext = inject<ICurrentUserContext>('CurrentUser')
  if (!currentUserContext) {
    throw new Error('CurrentUser context not provided')
  }
  return currentUserContext
}

