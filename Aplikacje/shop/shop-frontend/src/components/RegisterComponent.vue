<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('')
const password = ref('')

const handleRegister = () => {
  const userData = {
    username: username.value,
    password: password.value,
    role: 'KLIENT'
  }
  console.log(JSON.stringify(userData))
  router.push('/signIn')
}
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