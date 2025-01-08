import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state() {
    return {
    accessToken: null,
    loggedIn: false,
    }
  },
  actions: {
    setAccessToken(message) {
      this.loggedIn = message === "Zalogowano";
    },
  },
})