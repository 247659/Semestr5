import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref(localStorage.getItem('accessToken') || null)
  const loggedIn = ref(!!accessToken.value)

  const setAccessToken = (token) => {
    accessToken.value = token
    if (token) {
      localStorage.setItem('accessToken', token)
      loggedIn.value = true
    } else {
      localStorage.removeItem('accessToken')
      loggedIn.value = false
    }
  }

  const getToken = computed(() => accessToken.value)

  return { accessToken, loggedIn, setAccessToken }
})