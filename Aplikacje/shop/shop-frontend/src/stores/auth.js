import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state() {
    return {
    accessToken: null,
    loggedIn: false,
    }
  },
  actions: {
    setAccessToken(token) {
      this.accessToken = token
      if (token) {
        localStorage.setItem('accessToken', token)
        this.loggedIn = true
      } else {
        localStorage.removeItem('accessToken')
        this.loggedIn = false
      }
    },
  },
})