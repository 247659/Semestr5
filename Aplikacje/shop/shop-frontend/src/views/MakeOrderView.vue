<script setup>
import { ref } from 'vue'
import OrderComponent from '../components/MakeOrderComponent.vue'

const message = ref('Hello World!')
</script>

<template>
  <div class="d-flex justify-content-center align-items-center order-view-container">
    <div>
        <OrderComponent/>
    </div>
  </div>
</template>


<style>
.total-price {
  margin-top: 20px;
  font-size: 1.5em;
  font-weight: bold;
  text-align: right;
}
</style>