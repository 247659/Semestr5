<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import ProductsComponent from  '../components/ProductsComponent.vue'

const authStore = useAuthStore()
const token = authStore.getToken
const message = ref('Hello World!')
</script>

<template>
  <div class="d-flex justify-content-center align-items-center vh-100">
    <ProductsComponent/>
  </div>
</template>
