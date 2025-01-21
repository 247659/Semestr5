<script setup>
import axios from 'axios'
import { ref, computed } from 'vue'
import { BTable, BFormSelect, BContainer, BRow, BCol, BFormGroup, BInputGroup, BFormInput, BInputGroupText, BButton} from 'bootstrap-vue-next'
import { useOrderStore } from '../stores/order'
import { useAuthStore } from '../stores/auth'

const orderStore = useOrderStore()
const authStore = useAuthStore()

const name = ref('')
const email = ref('')
const number = ref('')
const errorMessage = ref('');
const successMessage = ref('');

const fields = [
  { key: 'name', label: 'Name' },
  { key: 'unit_price', label: 'Price' },
  { key: 'quantity', label: 'Quantity' },
  { key: 'totalPrice', label: 'Total Price' },
  { key: 'actions', label: 'Actions', class: 'text-center' }
]

const products = computed(() => orderStore.getProducts);


const handleOrder = async () => {
    const orderData = {
        customer_name: name.value,
        email: email.value,
        phone: number.value,
        products: orderStore.getProducts.map(product => ({
            product_id: product.id,
            quantity: product.quantity
        }))
    }
  try {
    console.log(orderData)
    const response = await axios.post(
        'http://localhost:8888/orders',
        orderData,
        { withCredentials: true } // Umożliwia przesyłanie ciasteczek
    );
    successMessage.value = response.data.message
    orderStore.clearOrder()
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage.value = error.response.data.message
    } else {
      errorMessage.value = 'Błąd połączenia z serwerem.'
    }
    console.error(error);
  }
};

</script>

<template>
  <div>
    <BContainer v-if:="products.length > 0">
        <BTable :items="products" :fields="fields" striped bordered hover>
            <template #cell(name)="data">
                {{ data.item.name }}
            </template>
            <template #cell(unit_price)="data">
                ${{ data.item.price }}
            </template>
            <template #cell(quantity)="data">
                <div class="d-flex justify-content-center align-items-center">
                    <BButton size="sm" @click="orderStore.incrementProduct(data.item.id)" class="me-2">
                        <font-awesome-icon icon="fa-solid fa-plus"/>
                    </BButton>
                    {{ data.item.quantity }}
                    <BButton size="sm" @click="orderStore.decrementProduct(data.item.id)" class="ms-2">
                        <font-awesome-icon icon="fa-solid fa-minus"/>
                    </BButton>
                </div>
            </template>
            <template #cell(totalPrice)="data">
                ${{ Math.round(data.item.quantity * data.item.price * 100) / 100 }}
            </template>
            <template #cell(actions)="data">
                <BButton size="sm" variant="danger" @click="orderStore.removeProduct(data.item.id)">
                    <font-awesome-icon icon="fa-solid fa-xmark" /> Remove
                </BButton>
            </template>
        </BTable>
        <div class="total-price">
            <h3>Total Price: ${{ orderStore.totalPrice }}</h3>
        </div>
        
        <form @submit.prevent="handleOrder">
          <h1 class="h3 mb-3 fw-normal">Add personal data</h1>
  
          <div class="form-floating mb-3">
            <input type="text" class="form-control" id="floatingInput" placeholder="Name" v-model="name">
            <label for="floatingInput">Name</label>
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

          <button class="btn btn-primary w-100 py-2" type="submit" :disabled="!authStore.loggedIn">Place an order</button>
          <p v-if="!authStore.loggedIn" class="text-warning">You need to be logged in to place an order</p>
        </form>
    </BContainer>
    <BContainer v-else:>
        <div v-if="successMessage" >
          <div class="alert alert-success text-center" role="alert">
          {{ successMessage }}
          </div>
          <div>
          <BButton>
            <RouterLink  to="/user_orders" class="nav-link">
              <font-awesome-icon icon="fa-solid fa-receipt" class="me-2"/> Check your orders here
            </RouterLink>
          </BButton>
        </div>
        </div>
        <div v-else>
            <h1 class="text-center">No products in order</h1>
        </div>
    </BContainer>
  </div>
</template>