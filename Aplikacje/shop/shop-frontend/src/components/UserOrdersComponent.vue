<script setup>
import axios from 'axios'
import { ref, onMounted} from 'vue'
import { BTable, BFormSelect, BContainer, BRow, BCol, BFormGroup, BInputGroup, BFormInput, BInputGroupText, BButton} from 'bootstrap-vue-next'

const orders = ref([])

const fields = [
  { key: 'confirmation_date', label: 'Data zatwierdzenia' },
  { key: 'status_id', label: 'Status' },
  { key: 'customer_name', label: 'Imię zamawiającego' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone'}
]

onMounted(async () => {
    try {
        const response = await axios.get('http://localhost:8888/orders/customer/test', { withCredentials: true } )
        orders.value = response.data
        console.log(orders.value)
    } catch (error) {
        console.log(error)
    }
})

</script>

<template>
        <BContainer>
        <BTable :items="orders" :fields="fields" striped bordered hover>
            <template #cell(confirmation_date)="data">
                {{ data.item.confirmation_date }}
            </template>
            <template #cell(status_id)="data">
                {{ data.item.status_id }}
            </template>
            <template #cell(customer_name)="data">
                {{ data.item.customer_name }}
            </template>
            <template #cell(email)="data">
                {{ data.item.email  }}
            </template>
            <template #cell(phone)="data">
                {{ data.item.phone }}
            </template>
            <!-- <template #cell(actions)="data">
                <BButton size="sm" variant="primary" @click="handleAction(data.item)">
                    <font-awesome-icon icon="fa-solid fa-cart-plus" /> Add to card
                </BButton>
            </template> -->
        </BTable>
    </BContainer>
</template>

<style scoped>

</style>
