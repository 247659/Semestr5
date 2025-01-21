<script setup>
import axios from 'axios'
import { ref, onMounted, computed } from 'vue'
import { BButton, BBadge, BCard, BContainer, BRow, BCol, BFormGroup, BFormSelect } from 'bootstrap-vue-next'
import { useToast } from 'vue-toastification';

const orders = ref([]);
const detailsVisibility = ref({});
const opinionVisibility = ref({})
const selectedStatus = ref(null);
const sortBy = ref('')
const toast = useToast();

const statuses = [
  { id: 1, text: 'Unconfirmed', BBadgeVariant: 'warning' },
  { id: 2, text: 'Confirmed', BBadgeVariant: 'info' },
  { id: 3, text: 'Cancelled', BBadgeVariant: 'danger' },
  { id: 4, text: 'Completed', BBadgeVariant: 'success' },
];

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:8888/orders', { withCredentials: true });
    const groupedOrders = groupOrders(response.data);
    orders.value = groupedOrders;
  } catch (error) {
    console.error(error);
  }
});

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
  return statuses.find(status => status.id === status_id) || { text: 'Unknown', BBadgeVariant: 'secondary' };
};

const toggleDetails = (itemId) => {
  detailsVisibility.value[itemId] = !detailsVisibility.value[itemId];
};

const showOpinion = (itemId) => {
  opinionVisibility.value[itemId] = !opinionVisibility.value[itemId]
}

const showOrdersByStatus = async() => {
    console.log(orders)
  if (selectedStatus.value === '') {
    try {
      const response = await axios.get('http://localhost:8888/orders', { withCredentials: true });
      const groupedOrders = groupOrders(response.data);
      orders.value = groupedOrders;
    } catch (error) {
      console.error(error);
    }
  } else {
    try {
      const response = await axios.get(`http://localhost:8888/orders/status/${selectedStatus.value}/test`, { withCredentials: true });
      const groupedOrders = groupOrders(response.data);
      orders.value = groupedOrders;
    } catch (error) {
      console.log(error);
    }
  }
};

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
    const groupedOrders = groupOrders(response2.data);
    console.log(groupedOrders)
    replaceOrder(groupedOrders[0]);
  } catch (error) {
    console.log(error);
  }
};

const replaceOrder = (updatedOrder) => {
    console.log(updatedOrder)
  const orderIndex = orders.value.findIndex((order) => order.id === updatedOrder.id);
  if (orderIndex !== -1) {
    orders.value[orderIndex] = updatedOrder;
    console.log("WYKONANO")
  } else {
    console.log('Order not found!');
  }
};

const calculateTotalPrice = (order) => {
  const total = order.products.reduce((total, product) => total + product.quantity * product.unit_price, 0);
  return Math.round(total * 100) / 100;
};

const sortedOrders = computed(() => {
  if (sortBy.value === 'price') {
    return [...orders.value].sort((a, b) => calculateTotalPrice(b) - calculateTotalPrice(a));
  } else if (sortBy.value === 'date') {
    return [...orders.value].sort((a, b) => new Date(b.confirmation_date) - new Date(a.confirmation_date));
  } else {
    return orders.value;
  }
});

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
      <BCol class="my-3">
        <BFormGroup>
          <BFormSelect id="sort-by" v-model="sortBy" :options="[
            { value: '', text: 'Sort by...' },
            { value: 'price', text: 'Total Price' },
            { value: 'date', text: 'Confirmation Date' }
          ]" />
        </BFormGroup>
      </BCol>
    </BRow>
    <BRow>
      <BCol v-for="order in sortedOrders" :key="order.id" :lg="orders.length === 1 ? 12 : 6" class="mb-4">
        <BCard :class="{'expanded-card': detailsVisibility[order.id]}">
          <div class="d-flex justify-content-between align-items-center">
            <h5>Order #{{ order.id }}</h5>
            <BBadge :variant="getStatus(order.status_id).BBadgeVariant">
              {{ getStatus(order.status_id).text }}
            </BBadge>
          </div>
          <p>Confirmed Date: <strong>{{ order.confirmed_date || 'Waiting for confirmation' }}</strong></p>
          <p>Total Price: <strong>${{ calculateTotalPrice(order) }}</strong></p>
          <div>
            <BFormGroup label="Change Status" class="mt-3">
              <BFormSelect v-model="order.newStatus" :options="statuses.map(status => ({value: status.id, text: status.text}))"/>
            </BFormGroup>
            <BButton size="m" class="mt-2 center" :disabled="order.newStatus === order.status_id" @click="confirmStatusChange(order)">
              Confirm new status
            </BButton>
          </div>

          <div class="d-flex justify-content-between mt-3">
            <BButton size="m" @click="toggleDetails(order.id)">
              <font-awesome-icon icon="fa-solid fa-circle-info" class="me-2"/> {{ detailsVisibility[order.id] ? 'Hide' : 'Show' }} Details
            </BButton>
            <BButton size="m" v-if="order.rating !== null" @click="showOpinion(order.id)">
              <font-awesome-icon icon="fa-solid fa-comment" class="me-2"/> {{ opinionVisibility[order.id] ? "Hide" : "Show opinion" }}
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
          <div v-if="opinionVisibility[order.id]" class="mt-3">
              <p>Rating: {{ order.rating }}</p>
              <p>Opinion date: {{ order.opinion_date }}</p>
              <p>Content: {{ order.content }}</p>
          </div>
        </BCard>
      </BCol>
    </BRow>
  </BContainer>
</template>

<style scoped>
.card {
  border: 1px solid #ddd;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.expanded-card {
  min-height: 300px; /* Adjust this value as needed */
}
.details-container {
  overflow: auto;
}
</style>
