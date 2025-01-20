<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'
import { BButton, BBadge, BCard, BContainer, BRow, BCol, BForm, BFormGroup, BFormTextarea, BFormInput} from 'bootstrap-vue-next'
import { useToast } from 'vue-toastification';

const orders = ref([])
const detailsVisibility = ref({})
const formVisibility = ref({})
const opinionText = ref('')
const rangeValue = ref('3')
const toast = useToast()

const statuses = [
  { value: 1, text: 'Unconfirmed', BBadgeVariant: 'warning' },
  { value: 2, text: 'Confirmed', BBadgeVariant: 'info' },
  { value: 3, text: 'Cancelled', BBadgeVariant: 'danger' },
  { value: 4, text: 'Completed', BBadgeVariant: 'success' },
]

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:8888/orders/customer/test', { withCredentials: true })
    const groupedOrders = groupOrders(response.data);
    orders.value = groupedOrders
  } catch (error) {
    console.error(error)
  }
})

const groupOrders = (data) => {
  return data.reduce((acc, item) => {
    let order = acc.find(o => o.id === item.id);
    if (!order) {
      order = { ...item, products: [] };
      acc.push(order);
    }
    order.products.push({
      name: item.name,
      quantity: item.quantity,
      unit_price: item.unit_price,
    });
    return acc;
  }, []);
};

const getStatus = (status_id) => {
  return statuses.find(status => status.value === status_id) || { text: 'Unknown', BBadgeVariant: 'secondary' }
}

const toggleDetails = (itemId) => {
  detailsVisibility.value[itemId] = !detailsVisibility.value[itemId]
}

const toggleForm = (itemId) => {
  formVisibility.value[itemId] = !formVisibility.value[itemId]
}

const submitOpinion = async (itemId) => {
    const data = {
        rating: rangeValue.value,
        content: opinionText.value
    }
    console.log(data)
  try {
    const response = await axios.post(`http://localhost:8888/orders/${itemId}/opinions`, {
      rating: rangeValue.value,
      content: opinionText.value
    }, { withCredentials: true })
    toast.success(response.data.message);
    // toast.success(response.data.message)
    opinionText.value = ''
    formVisibility.value[itemId] = false
  } catch (error) {
    // console.log(error.response.data.message)
    console.error('Error submitting opinion:', error)
    // alert('Failed to submit opinion.')
  }
}

function calculateTotalPrice(order) {
    let totalPrice = 0
    for (let product of order) {
        totalPrice += (product.quantity * parseFloat(product.unit_price))
    }
    return totalPrice
};


</script>

<template>
    <BContainer>
        <BRow>
        <BCol v-for="order in orders" :key="order.id" lg="6" class="mb-4">
            <BCard :class="{'expanded-card': detailsVisibility[order.id] || formVisibility[order.id]}">
            <div class="d-flex justify-content-between align-items-center">
                <h5>Order #{{ order.id }}</h5>
                <BBadge :variant="getStatus(order.status_id).BBadgeVariant">
                {{ getStatus(order.status_id).text }}
                </BBadge>
            </div>
            <p>Confirmed Date: <strong>{{ order.confirmed_date || 'Waiting for confirmation' }}</strong></p>
            <p>Total Price: <strong>${{ calculateTotalPrice(order.products) }}</strong></p>
            <div class="d-flex justify-content-between mt-3">
                <BButton size="sm" @click="toggleDetails(order.id)">
                {{ detailsVisibility[order.id] ? 'Hide' : 'Show' }} Details
                </BButton>
                <BButton size="sm" @click="toggleForm(order.id)" :disabled="order.status_id === 2 || order.status_id === 1">
                {{formVisibility[order.id] ? 'Hide' : 'Add Opinion'}}
                </BButton>
            </div>
            
            <hr />
            <div v-if="detailsVisibility[order.id]" class="details-container mt-3 d-flex justify-content-between align-items-center">   
              <div> 
                  <h6>Details:</h6>
                  <p>Name: {{ order.customer_name }}</p>
                  <p>e-mail: {{ order.email }}</p>
                  <p>Phone: {{ order.phone }}</p>
              </div>
              <div> 
                  <h6>Products:</h6>
                  <ul>
                  <li v-for="product in order.products" :key="product.name">
                      {{ product.name }} - {{ product.quantity }} x ${{ product.unit_price }}
                  </li>
                  </ul> 
              </div>
            </div>
            <div v-if="formVisibility[order.id]" class="mt-3">
                <hr />
                <BForm @submit.prevent="submitOpinion(order.id)">
                    <label for="range-1">Rate the order:</label>
                    <BFormInput id="range-1" v-model="rangeValue" type="range" min="1" max="5" />
                    <div class="mt-2">Grade: {{ rangeValue }}</div>
                    <hr />
                    <BFormGroup label="Your Opinion" label-for="opinion">
                        <BFormTextarea id="opinion" v-model="opinionText" rows="3" required></BFormTextarea>
                    </BFormGroup>
                    <BButton type="submit" variant="primary" class="mt-2">Submit</BButton>
                </BForm>
            </div>
            </BCard>
        </BCol>
        </BRow>
    </BContainer>
</template>

<style scoped>
/* Opcjonalne dostosowanie stylów dla kafelków */
.card {
  border: 1px solid #ddd;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.expanded-card {
  min-height: 300px; /* Adjust this value as needed */
}
.details-container {/* Adjust this value as needed */
  overflow: auto;
}
</style>
