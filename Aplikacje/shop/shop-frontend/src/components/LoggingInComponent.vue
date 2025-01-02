<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import axios from 'axios'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const username = ref('')
const password = ref('')
const errorMessage = ref('');
const successMessage = ref('')


onMounted(() => {
  if (route.query.message) {
    successMessage.value = route.query.message
  }
})

const handleLogin = async () => {
  const userData = {
    username: username.value,
    password: password.value
  }
  try {
    const response = await axios.post('http://localhost:8888/auth/login', userData)
    authStore.setAccessToken(response.data.accessToken)
    router.push('/');
  } catch (error) {
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
    <div class="d-flex justify-content-center align-items-center">
      <main class="form-signin w-100 m-auto">

        <div v-if="successMessage" class="alert alert-success text-center" role="alert">
          {{ successMessage }}
        </div>

        <form @submit.prevent="handleLogin">
          <h1 class="h3 mb-3 fw-normal">Please sign in</h1>
  
          <div class="form-floating mb-3">
            <input type="text" class="form-control" id="floatingInput" placeholder="username" v-model="username">
            <label for="floatingInput">Username</label>
          </div>
          <div class="form-floating mb-3">
            <input type="password" class="form-control" id="floatingPassword" placeholder="password" v-model="password">
            <label for="floatingPassword">Password</label>
          </div>
          
          <p v-if="errorMessage" class="text-danger">{{ errorMessage }}</p>

          <button class="btn btn-primary w-100 py-2" type="submit">Sign in</button>
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