<script setup>
import { onMounted } from 'vue';
import { RouterLink, RouterView} from 'vue-router'
import { BNavbar, BNavbarBrand, BNavbarToggle, BCollapse, BNavbarNav, BNavItem, vBColorMode, BNavItemDropdown, BDropdownItem } from 'bootstrap-vue-next'
import { useAuthStore } from './stores/auth'
import { useOrderStore } from './stores/order';

const authStore = useAuthStore()
const orderStore = useOrderStore()

onMounted(() => {
  // Sprawdź, czy token istnieje w localStorage (np. po odświeżeniu strony)
  const token = localStorage.getItem('accessToken');
  if (token) {
    authStore.setAccessToken(token)
  }
});
</script>

<template>
  <div>
    <BNavbar v-b-color-mode="'light'" toggleable="lg" variant="primary" class="fixed-top w-100 navbar">
      <BNavbarBrand>
        <RouterLink to="/" class="nav-link">
          <font-awesome-icon icon="fa-solid fa-house" class="me-2"/>Home</RouterLink>
      </BNavbarBrand>
      <BNavbarToggle target="nav-collapse" />
      <BCollapse id="nav-collapse" is-nav>
        <BNavbarNav class="ms-auto mb-2 mb-lg-0">
          <RouterLink to="/order" class="nav-link">
            <font-awesome-icon icon="fa-solid fa-cart-shopping" /> Order({{ orderStore.diffrentProductsQuantity }})
          </RouterLink>
          <RouterLink v-if="!authStore.loggedIn" to="/signIn" class="nav-link">
            <font-awesome-icon icon="fa-solid fa-sign-in-alt" class="me-2"/>Sign In
          </RouterLink>
          <BNavItemDropdown v-else text="Username">
            <template #button-content>
              <font-awesome-icon icon="fa-solid fa-user" /> Username
            </template>
            <RouterLink  to="/user_orders" class="nav-link">
              <font-awesome-icon icon="fa-solid fa-receipt" class="me-2"/>Orders
            </RouterLink>
            <RouterLink  to="/" class="nav-link" @click="authStore.setAccessToken(null)">
              <font-awesome-icon icon="fa-solid fa-sign-out-alt" class="me-2"/>Sign Out
            </RouterLink>
          </BNavItemDropdown> 
          <RouterLink to="/register" class="nav-link">
            <font-awesome-icon icon="fa-solid fa-user-plus" class="me-2"/>Register
          </RouterLink>
        </BNavbarNav>
      </BCollapse>
    </BNavbar>
    <RouterView />
  </div>
</template>

<style>
  /* .navbar {
  height: 60px;
  background-color: #333;
  color: white;
  display: flex;
  align-items: center;
  padding: 0 20px;
} */

.order-view-container {
  margin-top: 100px; /* Dopasuj do wysokości navbar */
}
</style>
