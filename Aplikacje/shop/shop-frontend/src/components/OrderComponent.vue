<script setup>
import axios from 'axios'
import { ref } from 'vue'
import { BTable, BFormSelect, BContainer, BRow, BCol, BFormGroup, BInputGroup, BFormInput, BInputGroupText, BButton} from 'bootstrap-vue-next'
import { useOrderStore } from '../stores/order'

const orderStore = useOrderStore()

const username = ref('')
const email = ref('')
const number = ref('')
const errorMessage = ref('');
const products = orderStore.getProducts

const fields = [
  { key: 'name', label: 'Name' },
  { key: 'unit_price', label: 'Price' },
  { key: 'quantity', label: 'Quantity' },
  { key: 'totalPrice', label: 'Total Price' },
  { key: 'actions', label: 'Actions', class: 'text-center' }
]
const handleAction = () => {
    console.log(products)
  // Tutaj dodaj logikę dla przycisku, np. otwarcie modala lub wykonanie akcji
};

// const handleOrder = async () => {
//   const userData = {
//     username: username.value,
//     password: password.value
//   }
//   try {
//     const response = await axios.post('http://localhost:8888/auth/login', userData)
//     authStore.setAccessToken(response.data.accessToken)
//     router.push('/');
//   } catch (error) {
//     if (error.response && error.response.data && error.response.data.message) {
//       errorMessage.value = error.response.data.message
//     } else {
//       errorMessage.value = 'Błąd połączenia z serwerem.'
//     }
    
//     console.error(error);
//   }
// };

</script>

<template>
    <BContainer>
        <BTable :items="products" :fields="fields" striped bordered hover>
            <template #cell(name)="data">
                {{ data.item.name }}
            </template>
            <template #cell(unit_price)="data">
                ${{ data.item.price }}
            </template>
            <template #cell(quantity)="data">
                {{ data.item.quantity }}
            </template>
            <template #cell(totalPrice)="data">
                ${{ data.item.quantity * data.item.price }}
            </template>
            <template #cell(actions)="data">
                <BButton size="sm" variant="danger" @click="handleAction()">
                    <font-awesome-icon icon="fa-solid fa-xmark" /> Remove
                </BButton>
            </template>
        </BTable>
        <div class="total-price">
            <h3>Total Price: ${{ orderStore.totalPrice }}</h3>
        </div>

        <form @submit.prevent="handleLogin">
          <h1 class="h3 mb-3 fw-normal">Add personal data</h1>
  
          <div class="form-floating mb-3">
            <input type="text" class="form-control" id="floatingInput" placeholder="username" v-model="username">
            <label for="floatingInput">Username</label>
          </div>
          <div class="form-floating mb-3">
            <input type="email" class="form-control" id="floatingEmail" placeholder="name@example.com" v-model="email">
            <label for="floatingEmail">Email</label>
          </div>
          <div class="form-floating mb-3">
            <input type="text" class="form-control" id="floatingNumber" placeholder="phone number" v-model="number">
            <label for="floatingNumber">Phone number</label>
          </div>
          
          <p v-if="errorMessage" class="text-danger">{{ errorMessage }}</p>

          <button class="btn btn-primary w-100 py-2" type="submit">Place an order</button>
        </form>
    </BContainer>
</template>