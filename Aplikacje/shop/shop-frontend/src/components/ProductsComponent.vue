<script setup>
import axios from 'axios'
import { ref, onMounted, computed } from 'vue'
import { BTable, BFormSelect, BContainer, BRow, BCol, BFormGroup, BInputGroup, BFormInput, BInputGroupText, BButton, BCard, BModal, BFormTextarea } from 'bootstrap-vue-next'
import { useOrderStore } from '../stores/order'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification';

const orderStore = useOrderStore()
const authStore = useAuthStore()
const toast = useToast()

const products = ref([])
const categories = ref([])
const filter = ref('')
const selectedCategory = ref('')
const editingProduct = ref(null) // Produkt, który jest edytowany
const editedProductData = ref({}) // Zmienna przechowująca dane edytowanego produktu
const showModal = ref(false) // Stan modalu
const errorMessage = ref('')

const fields = [
  { key: 'name', label: 'Name' },
  { key: 'unit_price', label: 'Price' },
  { key: 'unit_weight', label: 'Weight[KG]' },
  { key: 'actions', label: 'Actions', class: 'text-center' }
]

onMounted(async () => {
    try {
        const response = await axios.get('http://localhost:8888/products')
        products.value = response.data.map(product => ({
      ...product,
      unit_price: parseFloat(product.unit_price),
    }))
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

const startEditing = (product) => {
  // Ustawienie danych produktu do edycji
  editingProduct.value = product;
  editedProductData.value = { ...product }; // Kopiowanie danych produktu do formularza
  showModal.value = true; // Otwarcie modalu
}

const cancelEditing = () => {
  // Resetowanie stanu edycji
  editingProduct.value = null;
  editedProductData.value = {};
  showModal.value = false; // Zamknięcie modalu
}

const saveChanges = async () => {
  try {
    console.log('co tu tak CICHO???' + editedProductData.value.description)

    const { _showDetails, ...validProductData } = editedProductData.value;

    const response = await axios.put(`http://localhost:8888/products/${editedProductData.value.id}`, validProductData, {withCredentials: true});
    const index = products.value.findIndex(product => product.id === editedProductData.value.id);
    if (index !== -1) {
      products.value[index] = response.data; // Zaktualizowanie produktu w liście
    }
    cancelEditing(); // Zakończenie edycji

    toast.success(response.data.message)
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage.value = error.response.data.message
    } else {
      errorMessage.value = 'Błąd połączenia z serwerem.'
    }
    console.error(error);
  }
}

const generateDescription = async (productId) => {
    try {
        const response = await axios.post(`http://localhost:8888/products/${productId}/seo-description`, null, 
            {withCredentials: true}
        )
        editedProductData.value.description = response.data
        console.log(response.data)
    } catch (error) {
        console.log(error)
    }
}

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
                <BButton v-if="authStore.role === 'PRACOWNIK'" size="sm" class="me-1" @click="startEditing(data.item)">
                    Edit product
                </BButton>
                <BButton v-else size="sm" class="me-1" @click="handleAction(data.item)">
                    <font-awesome-icon icon="fa-solid fa-cart-plus" /> Add to card
                </BButton>
                <BButton size="sm" class="me-1" @click="data.toggleDetails">
                    {{ data.detailsShowing ? 'Hide' : 'Show' }} Details
                </BButton>
            </template>
            <template #row-details="data">
                <BCard>
                    <p>{{ data.item.description }}</p>
                </BCard>
            </template>
        </BTable>

        <BModal v-model="showModal" title="Edit Product" no-footer>
            <BRow>
                <BCol lg="4" class="my-1">
                    <BFormGroup label="Name" label-for="name">
                        <BFormInput id="name" v-model="editedProductData.name"/>
                    </BFormGroup>
                </BCol>
                <BCol lg="4" class="my-1">
                    <BFormGroup label="Price" label-for="price">
                        <BFormInput id="price" v-model="editedProductData.unit_price" label="Price" type="number" />
                    </BFormGroup>
                </BCol>
                <BCol lg="4" class="my-1">
                    <BFormGroup label="Weight[KG]" label-for="weight">
                        <BFormInput id="weight" v-model="editedProductData.unit_weight" label="Weight" type="number" />
                    </BFormGroup>
                </BCol>
            </BRow>
            <BRow>
                <BCol>
                    <BFormGroup label="Category" label-for="category_id">
                        <BFormSelect id="category_id" v-model="editedProductData.category_id" :options="[{ value: '', text: 'All Categories' }, ...categories.map(category => ({ value: category.id, text: category.name }))]" required />
                    </BFormGroup>
                </BCol>
            </BRow>
            <BRow>
                <BCol>
                    <BFormGroup label="Description" label-for="description">
                        <BFormTextarea id="description" v-model="editedProductData.description" rows="3" required />
                    </BFormGroup>
                </BCol>
            </BRow>
            <BRow>
                <BCol>
                    <p v-if="errorMessage" class="text-danger">{{ errorMessage }}</p>
                </BCol>
            </BRow>
            <BRow>
                <BCol class="pt-2" @click="generateDescription(editedProductData.id)">
                    <BButton> Generate description</BButton>
                </BCol>
                <BCol class="d-flex justify-content-end pt-2">
                    <BButton variant="secondary" class="me-1 " @click="cancelEditing">Cancel</BButton>
                    <BButton variant="primary" @click="saveChanges">OK</BButton>
                </BCol>
            </BRow>
        </BModal>

    </BContainer>
</template>
