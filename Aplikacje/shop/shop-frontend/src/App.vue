<script setup>
import { ref, provide, onMounted } from 'vue';
import { RouterLink, RouterView} from 'vue-router'
import { BNavbar, BNavbarBrand, BNavbarToggle, BCollapse, BNavbarNav, BNavItem, BNavItemDropdown, BDropdownItem, vBColorMode } from 'bootstrap-vue-next'

const accessToken = ref(null)
const loggedIn = ref(false)
const setLoggedIn = (value) => {
  loggedIn.value = value
  if (!value) {
    accessToken.value = null
    localStorage.removeItem('accessToken')
  }
}

provide('loggedIn', loggedIn)
provide('setLoggedIn', setLoggedIn)
provide('accessToken', accessToken);

onMounted(() => {
  // Sprawdź, czy token istnieje w localStorage (np. po odświeżeniu strony)
  const token = localStorage.getItem('accessToken');
  if (token) {
    accessToken.value = token;
    loggedIn.value = true;
  }
});
</script>

<template>
  <div>
    <BNavbar v-b-color-mode="'light'" toggleable="lg" variant="primary" class="fixed-top w-100">
      <BNavbarBrand>
        <RouterLink to="/" class="nav-link">
          <font-awesome-icon icon="fa-solid fa-house" class="me-2"/>Home</RouterLink>
      </BNavbarBrand>
      <BNavbarToggle target="nav-collapse" />
      <BCollapse id="nav-collapse" is-nav>
        <BNavbarNav class="ms-auto mb-2 mb-lg-0">
          <BNavItem> 
            <font-awesome-icon icon="fa-solid fa-cart-shopping" /> Order
          </BNavItem>
          <RouterLink v-if="!loggedIn" to="/signIn" class="nav-link">
            <font-awesome-icon icon="fa-solid fa-sign-in-alt" class="me-2"/>Sign In
          </RouterLink>
          <RouterLink v-else to="/" class="nav-link" @click="setLoggedIn(false)">
            <font-awesome-icon icon="fa-solid fa-sign-out-alt" class="me-2"/>Sign Out
          </RouterLink>
          <RouterLink to="/register" class="nav-link">
            <font-awesome-icon icon="fa-solid fa-user-plus" class="me-2"/>Register
          </RouterLink>
        </BNavbarNav>
      </BCollapse>
    </BNavbar>
  </div>
  
  <RouterView />
</template>

<style scoped>

</style>
