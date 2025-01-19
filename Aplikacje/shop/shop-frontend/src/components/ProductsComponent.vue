<script setup>
import axios from 'axios'
import { ref, onMounted, computed } from 'vue'
import { BTable, BFormSelect, BContainer, BRow, BCol, BFormGroup, BInputGroup, BFormInput, BInputGroupText, BButton, BCard} from 'bootstrap-vue-next'
import { useOrderStore } from '../stores/order'

const orderStore = useOrderStore()

const products = ref([])
const categories = ref([])
const filter = ref('')
const selectedCategory = ref('')

const fields = [
  { key: 'name', label: 'Name' },
  { key: 'unit_price', label: 'Price' },
  { key: 'unit_weight', label: 'Weight' },
  { key: 'actions', label: 'Actions', class: 'text-center' }
]

onMounted(async () => {
    try {
        const response = await axios.get('http://localhost:8888/products')
        products.value = response.data.map(product => ({
      ...product,
      unit_price: parseFloat(product.unit_price),
    }))
        console.log(products.value)
    } catch (error) {
        console.log(error)
    }
    try {
        const response = await axios.get('http://localhost:8888/categories')
        categories.value = response.data
    } catch (error) {
        console.log(error)
    }
})


const filteredProducts = computed(() => {
    if (!selectedCategory.value) {
    return products.value
  }
  return products.value.filter(product => 
    product.category_id === selectedCategory.value
  )
})

const handleAction = (item) => {
    console.log('Clicked on item:', item)
    orderStore.addProductToCard(item)
  // Tutaj dodaj logikę dla przycisku, np. otwarcie modala lub wykonanie akcji
};

</script>

<template>
    <BContainer>
        <BRow>
            <BCol lg="4" class="my-1">
                <BFormGroup>
                    <BInputGroup>
                        <BFormInput v-model="filter" type="search" placeholder="Type to Search"/>
                        <BInputGroupText>
                            <BButton :disabled="!filter" @click="filter = ''">Clear</BButton>
                        </BInputGroupText>
                    </BInputGroup>
                </BFormGroup>
            </BCol>
            <BCol lg="4" class="my-1">
                <BFormGroup>
                    <BFormSelect v-model="selectedCategory" :options="[{ value: '', text: 'All Categories' }, ...categories.map(category => ({ value: category.id, text: category.name }))]" />
                </BFormGroup>
            </BCol>
        </BRow>
        <BTable :items="filteredProducts" :fields="fields" :filter="filter" striped bordered hover>
            <template #cell(name)="data">
                {{ data.item.name }}
            </template>
            <template #cell(unit_price)="data">
                ${{ data.item.unit_price }}
            </template>
            <template #cell(unit_weight)="data">
                {{ data.item.unit_weight }}
            </template>
            <template #cell(actions)="data">
                <BButton size="sm" class="me-1"  @click="handleAction(data.item)">
                    <font-awesome-icon icon="fa-solid fa-cart-plus" /> Add to card
                </BButton>
                <BButton size="sm" @click="data.toggleDetails">
                {{ data.detailsShowing ? 'Hide' : 'Show' }} Details
                </BButton>
            </template>
            <template #row-details="data">
                <BCard>
                    <p>{{ data.item.description }}</p>
                </BCard>
            </template>
        </BTable>
    </BContainer>
</template>