<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'
import { BTableSimple, BThead, BTr, BTh, BTbody, BTd } from 'bootstrap-vue-next'

const products = ref([])

onMounted(async () => {
    try {
        const response = await axios.get('http://localhost:8888/products')
        products.value = response.data
    } catch (error) {
        console.log(error)
    }
  
})

</script>

<template>
    <div class="container mt-5">
    <h1 class="mb-4">Products</h1>
    <BTableSimple hover responsive>
      <BThead class="table-dark">
        <BTr>
          <BTh>Name</BTh>
          <BTh>Description</BTh>
          <BTh>Price</BTh>
          <BTh>Weight</BTh>
        </BTr>
      </BThead>
      <BTbody>
        <BTr v-for="product in products" :key="product.id">
          <BTd>{{ product.name }}</BTd>
          <BTd>{{ product.description }}</BTd>
          <BTd>{{ product.unit_price }}</BTd>
          <BTd>{{ product.unit_weight }}</BTd>
        </BTr>
      </BTbody>
    </BTableSimple>
  </div>
</template>