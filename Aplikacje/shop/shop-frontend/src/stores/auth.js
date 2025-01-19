import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state() {
    return {
    accessToken: null,
    loggedIn: false,
    role: null,
    }
  },
  actions: {
    setAccessToken(message) {
      this.loggedIn = message === "Zalogowano";
    },
    login(role) {
      this.role = role;
      this.loggedIn = true;
    },
    logout() {
      this.loggedIn = false;
      this.role = null;
    }
  },
})