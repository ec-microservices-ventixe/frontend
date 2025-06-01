import type { Ref } from "vue";

export interface IUser {
    authenticated: boolean;
    role: string;
    email: string;
}

export interface ICurrentUserContext {
  currentUser: Ref<IUser>;
  updateCurrentUser: (authenticated: boolean, role: string, email: string) => void;
}