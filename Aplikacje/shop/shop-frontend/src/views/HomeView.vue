<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const token = authStore.getToken
const message = ref('Hello World!')
</script>

<template>
  <div class="d-flex justify-content-center align-items-center vh-100">
    <h1>{{ message }}</h1>
    <h2 v-if="authStore.accessToken"> {{authStore.accessToken}}</h2>
    <h2 v-else> Brak tokenu </h2> 
  </div>
</template>
