<script setup>
import { ref } from 'vue'
const message = ref('Hello World!')
</script>

<template>
  <div class="d-flex justify-content-center align-items-center vh-100">
    <h1>{{ message }}</h1>
  </div>
</template>
