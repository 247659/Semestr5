<script setup>
import { ref, inject } from 'vue'

const loggedIn = inject('loggedIn')
const setLoggedIn = inject('setLoggedIn')

const handleLogin = () => {
  setLoggedIn(true)
}
</script>

<template>
  <button @click="handleLogin">Log In</button>
</template>

<style scoped>
button {
  padding: 10px 20px;
  font-size: 16px;
}
</style>