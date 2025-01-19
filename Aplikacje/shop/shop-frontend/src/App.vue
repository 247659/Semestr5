<script setup>
import { onMounted, ref } from 'vue';
import { RouterLink, RouterView} from 'vue-router'
import { BNavbar, BNavbarBrand, BNavbarToggle, BCollapse, BNavbarNav, BNavItem, vBColorMode, BNavItemDropdown, BDropdownItem } from 'bootstrap-vue-next'
import { useAuthStore } from './stores/auth'
import { useOrderStore } from './stores/order';
import { useToast } from 'vue-toastification';

const authStore = useAuthStore()
const orderStore = useOrderStore()
const toast = useToast();
const logoutMessage = ref('')

onMounted(() => {
  if (localStorage.getItem('loggedIn')) {
    console.log("dddd")
    authStore.loggedIn = localStorage.getItem('loggedIn')
    authStore.username = localStorage.getItem('username')
    authStore.role = localStorage.getItem("role")
    authStore.scheduleTokenRefresh(Number(localStorage.getItem('expiresIn')))
  }

}); 

const handleLogout = async () => {
      try {
        const response = await authStore.logout();
        logoutMessage.value = response;
        toast.success(logoutMessage.value);
      } catch (error) {
        console.error(error);
      }
    };

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
              <font-awesome-icon icon="fa-solid fa-user" /> {{authStore.username}}
            </template>
            <RouterLink  to="/user_orders" class="nav-link">
              <font-awesome-icon icon="fa-solid fa-receipt" class="me-2"/>Your orders
            </RouterLink>
            <RouterLink  to="/" class="nav-link" @click="handleLogout">
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
