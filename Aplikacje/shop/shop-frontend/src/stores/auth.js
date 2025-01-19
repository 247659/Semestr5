import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
  state() {
    return {
    loggedIn: false,
    role: null,
    username: null,
    refreshTimeout: null,
    }
  },
  actions: {
    async login(userData) {
      try {
        const response = await axios.post('http://localhost:8888/auth/login', userData, { withCredentials: true });
        console.log(response.data)
        this.role = response.data.role;
        this.loggedIn = true;
        this.username = response.data.username;
        this.scheduleTokenRefresh(response.data.expiresIn);

        localStorage.setItem("loggedIn", this.loggedIn)
        localStorage.setItem("role", this.role)
        localStorage.setItem("username", this.username)
        localStorage.setItem("expiresIn", this.expiresIn)
        
        console.log(response.data.message)
      } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          return error.response.data.message
        } else {
          console.log(error)
        }
      }
    },
    async logout() { // Używaj zwykłej funkcji zamiast funkcji strzałkowej
      try {
        const response = await axios.post('http://localhost:8888/auth/logout', null, {
          withCredentials: true,
        });
        this.loggedIn = false;
        this.role = null;
        this.username = null;

        localStorage.removeItem('username');
        localStorage.removeItem('role');
        localStorage.removeItem('loggedIn');
        localStorage.removeItem('expiresIn');

        if (this.refreshTimeout) {
          clearTimeout(this.refreshTimeout);
          this.refreshTimeout = null;
        }

        return response.data.message;
      } catch (error) {
        console.error('Błąd podczas wylogowania:', error);
        throw error;
      }
    },
    scheduleTokenRefresh(expiresIn) {
      // Odśwież token minutę przed jego wygaśnięciem
      const refreshTime = (expiresIn - 60) * 1000;

      if (this.refreshTimeout) {
        clearTimeout(this.refreshTimeout); // Wyczyszczenie poprzedniego timeoutu
      }

      this.refreshTimeout = setTimeout(async () => {
        try {
          const response = await axios.post('http://localhost:8888/auth/refresh', null, {
            withCredentials: true,
          });
          console.log('Token odświeżony:', response.data.message);

          // Ustawienie nowego timeoutu
          this.scheduleTokenRefresh(response.data.expiresIn);
        } catch (error) {
          console.error('Błąd podczas odświeżania tokenu:', error);

          // Jeśli odświeżenie tokenu się nie uda, wyloguj użytkownika
          this.logout();
        }
      }, refreshTime);
    },
  },
})