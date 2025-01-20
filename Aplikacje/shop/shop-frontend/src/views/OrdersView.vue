<script setup>
import UserOrdersComponent from '../components/UserOrdersComponent.vue'
import AllOrders from '@/components/AllOrders.vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore()

</script>

<template>
  <div class="d-flex justify-content-center align-items-center order-view-container">
      <div v-if="authStore.role === 'KLIENT'">
        <UserOrdersComponent/>
      </div>
      <div v-else>
        <AllOrders/>
      </div>
  </div>
</template>
