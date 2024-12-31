<script setup>
import { ref, inject } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const loggedIn = inject('loggedIn')
const setLoggedIn = inject('setLoggedIn')
const username = ref('')
const password = ref('')

const handleLogin = () => {
  const userData = {
    username: username.value,
    password: password.value
  }
  console.log(JSON.stringify(userData))
  setLoggedIn(true)
  router.push('/')
}
</script>

<template>
    <div class="d-flex justify-content-center align-items-center vh-100">
      <main class="form-signin w-100 m-auto">
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