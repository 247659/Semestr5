<script setup>
import { ref } from 'vue'
import { BModal, BRow, BCol, BFormGroup, BFormInput, BButton, BFormTextarea,  BFormSelect } from 'bootstrap-vue-next'

const props = defineProps({
  id: Number, // Produkt do edycji
  showModal: Boolean,
  categories: Array // Stan widoczności modalu
})

const emit = defineEmits(['update:showModal', 'save', 'cancel']) // Emity do komunikacji z rodzicem

const editedProductData = ref({ ...props.product })

const saveChanges = () => {
  emit('save', editedProductData.value) // Wyślij dane do rodzica
  emit('update:showModal', false) // Zamknij modal
}

const cancelEditing = () => {
  emit('cancel') // Anuluj edycję
  emit('update:showModal', false) // Zamknij modal
}
</script>

<template>
  <BModal v-model="props.showModal" title="Edit Product">
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
                <BFormSelect v-model="editedProductData.category_id" :options="[{ value: '', text: 'Select Category' }, ...props.categories.map(category => ({ value: category.id, text: category.name }))]" label="Category" />
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
  </BModal>
</template>
