<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'
import { BButton, BBadge, BCard, BContainer, BRow, BCol, BForm, BFormGroup, BFormTextarea, BFormInput, BFormSelect} from 'bootstrap-vue-next'
import { useToast } from 'vue-toastification';

const orders = ref([])
const detailsVisibility = ref({})
const formVisibility = ref({})
const selectedStatus = ref(null)
const toast = useToast()

const statuses = [
  { id: 1, text: 'Unconfirmed', BBadgeVariant: 'warning' },
  { id: 2, text: 'Confirmed', BBadgeVariant: 'info' },
  { id: 3, text: 'Cancelled', BBadgeVariant: 'danger' },
  { id: 4, text: 'Completed', BBadgeVariant: 'success' },
]

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:8888/orders', { withCredentials: true })
    orders.value = response.data
  } catch (error) {
    console.error(error)
  }
})

const getStatus = (status_id) => {
  return statuses.find(status => status.id === status_id) || { text: 'Unknown', BBadgeVariant: 'secondary' }
}

const toggleDetails = (itemId) => {
  detailsVisibility.value[itemId] = !detailsVisibility.value[itemId]
}

const showOrdersByStatus = async() => {
    console.log("co ty dajesz??" + selectedStatus.value)
    if(selectedStatus.value === '') {
        try {
            const response = await axios.get('http://localhost:8888/orders', { withCredentials: true })
            orders.value = response.data
        } catch (error) {
            console.error(error)
  }
    } else {
        try {
            const response = await axios.get(`http://localhost:8888/orders/status/${selectedStatus.value}/test`, { withCredentials: true})
            orders.value = response.data 
        } catch(error) {
            console.log(error)
        }
    }
}

const confirmStatusChange = async (order) => {
  try {
    const newStatus = statuses.find(status => status.id === order.newStatus);
    const response = await axios.patch(
      `http://localhost:8888/orders/${order.id}/test`,
      { newStatus: newStatus.text.toUpperCase() },
      { withCredentials: true }
    );
    toast.success(response.data.message);
  } catch (error) {
    console.log(error);
  }

  try {
    const response2 = await axios.get(
      `http://localhost:8888/orders/${order.id}/get`,
      { withCredentials: true }
    );
    replaceOrder(response2.data[0]);
  } catch (error) {
    console.log(error);
  }
};


const replaceOrder = (updatedOrder) => {
  console.log("Co tu chowasz?" + updatedOrder.phone);
  const orderIndex = orders.value.findIndex((order) => order.id === updatedOrder.id);
  if (orderIndex !== -1) {
    orders.value[orderIndex] = updatedOrder;
  } else {
    console.log('Order not found!');
  }
};

</script>

<template>
    <BContainer>
        <BRow>
            <BCol lg="6" class="my-3">
                <BFormGroup>
                    <BFormSelect v-model="selectedStatus" :options="[{ value: '', text: 'All Statuses' }, ...statuses.map(status => ({ value: status.id, text: status.text }))]" />
                </BFormGroup>
            </BCol>
            <BCol class="my-3">
                <BButton size="bg" variant="primary" @click="showOrdersByStatus()">Show</BButton>
            </BCol>
        </BRow>
        <BRow>
        <BCol v-for="order in orders" :key="order.id" :lg="orders.length === 1 ? 12 : 6"  class="mb-4">
            <BCard :class="{'expanded-card': detailsVisibility[order.id] || formVisibility[order.id]}">
            <div class="d-flex justify-content-between align-items-center">
                <h5>Order #{{ order.id }}</h5>
                <BBadge :variant="getStatus(order.status_id).BBadgeVariant">
                {{ getStatus(order.status_id).text }}
                </BBadge>
            </div>
            <p>Confirmed Date: <strong>{{ order.confirmed_date || 'Waiting for confirmation' }}</strong></p>

            <div>
                <BFormGroup label="Change Status" class="mt-3">
                    <BFormSelect v-model="order.newStatus" :options="statuses.map(status => ({value: status.id, text: status.text,}))"/>
                </BFormGroup>
                <BButton size="sm" class="mt-2 center" :disabled="order.newStatus === order.status_id" @click="confirmStatusChange(order)">
                    Confirm new status
                </BButton>
            </div>
            

            <div class="d-flex justify-content-between mt-3">
                <BButton size="sm" @click="toggleDetails(order.id)">
                    {{ detailsVisibility[order.id] ? 'Hide' : 'Show' }} Details
                </BButton>
            </div>
            
            <div v-if="detailsVisibility[order.id]" class="details-container mt-3">
                <hr />
                <h6>Details:</h6>
                <p>Name: {{ order.customer_name }}</p>
                <p>e-mail: {{ order.email }}</p>
                <p>Phone: {{ order.phone }}</p>
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
