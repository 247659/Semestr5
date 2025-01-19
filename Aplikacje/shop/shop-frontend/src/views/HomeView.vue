<script setup>
import { computed } from 'vue';
import ProductsComponent from '../components/ProductsComponent.vue';
import AddProductComponent from '../components/AddProductComponent.vue';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();

const userRole = computed(() => authStore.role);

</script>

<template>
  <div class="d-flex justify-content-center align-items-center order-view-container">
    <ProductsComponent/>

    <div v-if="userRole === 'PRACOWNIK'">
      <AddProductComponent/>
    </div>
  </div>
</template>