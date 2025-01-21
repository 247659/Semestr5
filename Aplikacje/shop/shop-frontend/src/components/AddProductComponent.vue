<script setup>
import { ref, onMounted } from 'vue';
import { BButton, BForm, BFormGroup, BFormInput, BFormTextarea, BFormSelect } from 'bootstrap-vue-next';
import axios from 'axios';
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';
import Papa from 'papaparse';

const showForm = ref(false);
const name = ref('');
const description = ref('');
const unit_price = ref('');
const unit_weight = ref('');
const category_id = ref('');
const toast = useToast();
const router = useRouter()

const categories = ref([]);

onMounted(async () => {
    try {
        const response = await axios.get('http://localhost:8888/categories')
        categories.value = response.data
    } catch (error) {
        console.log(error)
    }
})

const toggleForm = () => {
  showForm.value = !showForm.value;
};

const submitForm = async () => {
  try {
    console.log(name.value, description.value, unit_price.value, unit_weight.value, category_id.value);
    const response = await axios.post('http://localhost:8888/products', {
      name: name.value,
      description: description.value,
      unit_price: unit_price.value,
      unit_weight: unit_weight.value,
      category_id: category_id.value
    }, {withCredentials: true});
    toast.success(response.data.message);
    router.push({ path: '/'})
    // Reset form fields
    name.value = '';
    description.value = '';
    unit_price.value = '';
    unit_weight.value = '';
    category_id.value = '';
    showForm.value = false;
  } catch (error) {
    toast.error('Failed to add product.');
    console.error(error);
  }
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      complete: (results) => {
        const products = results.data
          .map(row => {
            // Sprawdź, czy wszystkie wymagane pola są obecne i poprawne
            if (!row.name || !row.description || !row.unit_price || !row.unit_weight) {
              toast.error('Invalid data: All fields (name, description, unit_price, unit_weight) are required.');
              return null;
            }

            if (typeof row.unit_price !== 'number' || typeof row.unit_weight !== 'number') {
              toast.error('Invalid data: unit_price and unit_weight must be numbers.');
              return null;
            }

            return {
              name: row.name.trim(), // Usuń nadmiarowe spacje
              description: row.description.trim(),
              unit_price: row.unit_price,
              unit_weight: row.unit_weight
            };
          })
          .filter(product => product !== null); // Usuń błędne dane

        console.log(products);
        loadBase(products);
      },
      error: (error) => {
        toast.error('Failed to parse CSV file.');
        console.error(error);
      }
    });
  }
};

const loadBase = async (products) => {
  try {
    await axios.post('http://localhost:8888/init', products, { withCredentials : true})
    toast.success("Successfully added products to database")
  } catch (error) {
    toast.error(error.response.data.message)
    console.log(error)
  }
    
}

</script>

<template>
  <div>
    <input type="file" @change="handleFileUpload" accept=".csv" style="display: none;" ref="fileInput">
    <BButton class="add-product-file" variant="primary" @click="$refs.fileInput.click()">
      Load products
    </BButton>
    <BButton @click="toggleForm" class="add-product-button" variant="primary">
      {{ showForm ? 'Close' : 'Add Product' }}
    </BButton>
    <div v-if="showForm" class="form-container">
      <BForm @submit.prevent="submitForm">
        <BFormGroup label="Name" label-for="name">
          <BFormInput id="name" v-model="name" required />
        </BFormGroup>
        <BFormGroup label="Description" label-for="description">
          <BFormTextarea id="description" v-model="description" rows="3" required />
        </BFormGroup>
        <BFormGroup label="Price" label-for="unit_price">
          <BFormInput id="unit_price" v-model="unit_price" type="number" required placeholder="$$"/>
        </BFormGroup>
        <BFormGroup label="Weight[KG]" label-for="unit_weight">
          <BFormInput id="unit_weight" v-model="unit_weight" type="number" required placeholder="KG"/>
        </BFormGroup>
        <BFormGroup label="Category" label-for="category_id">
          <BFormSelect id="category_id" v-model="category_id" :options="[{ value: '', text: 'All Categories' }, ...categories.map(category => ({ value: category.id, text: category.name }))]" required />
        </BFormGroup>
        <BButton type="submit" variant="success">Submit</BButton>
      </BForm>
    </div> 
  </div>
</template>

<style scoped>
.add-product-button {
  position: fixed;
  bottom: 20px;
  width: 200px;
  right: 20px;
  z-index: 1000;
}

.add-product-file {
  position: fixed;
  bottom: 70px;
  right: 20px;
  width: 200px;
  z-index: 1000;
}

.form-container {
  position: fixed;
  bottom: 80px;
  right: 20px;
  background: white;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  width: 400px
}
</style>