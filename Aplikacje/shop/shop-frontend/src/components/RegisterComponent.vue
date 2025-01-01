<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const username = ref('')
const password = ref('')
const errorMessage = ref('')

// const handleLogin = async () => {
//   const userData = {
//     username: username.value,
//     password: password.value
//   }
//   try {
//     const response = await axios.post('http://localhost:8888/auth/login', userData)
//     authStore.setAccessToken(response.data.accessToken)
//     router.push('/');
//   } catch (error) {
//     if (error.response && error.response.data && error.response.data.message) {
//       errorMessage.value = error.response.data.message
//     } else {
//       errorMessage.value = 'Błąd połączenia z serwerem.'
//     }
    
//     console.error(error);
//   }
// };

const handleRegister = async () => {
  const userData = {
    username: username.value,
    password: password.value,
    role: 'KLIENT'
  }
  try {
    const response = await axios.post('http://localhost:8888/auth/register', userData)
    const successMessage = response.data.message
    router.push({ path: '/signIn', query : {message: successMessage} })

  } catch(error) {
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage.value = error.response.data.message
    } else {
      errorMessage.value = 'Błąd połączenia z serwerem.'
    }
    
    console.error(error);
  }
};
</script>

<template>
    <div class="d-flex justify-content-center align-items-center vh-100">
      <main class="form-signin w-100 m-auto">
        <form @submit.prevent="handleRegister">
          <h1 class="h3 mb-3 fw-normal">Please register</h1>
  
          <div class="form-floating mb-3">
            <input type="text" class="form-control" id="floatingInput" placeholder="username" v-model="username">
            <label for="floatingInput">Username</label>
          </div>
          <div class="form-floating mb-3">
            <input type="password" class="form-control" id="floatingPassword" placeholder="password" v-model="password">
            <label for="floatingPassword">Password</label>
          </div>
  
          <p v-if="errorMessage" class="text-danger">{{ errorMessage }}</p>

          <button class="btn btn-primary w-100 py-2" type="submit">Register</button>
        </form>
      </main>
    </div>
  </template>
  
  <style scoped>
  .form-signin {
    max-width: 330px;
    padding: 15px;
  }
  
  html,
  body {
    height: 100%;
  }
</style>