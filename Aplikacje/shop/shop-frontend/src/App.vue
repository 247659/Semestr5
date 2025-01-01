<script setup>
import { onMounted } from 'vue';
import { RouterLink, RouterView} from 'vue-router'
import { BNavbar, BNavbarBrand, BNavbarToggle, BCollapse, BNavbarNav, BNavItem, BNavItemDropdown, BDropdownItem, vBColorMode } from 'bootstrap-vue-next'
import { useAuthStore } from './stores/auth'

const authStore = useAuthStore()

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
          <RouterLink v-if="!authStore.loggedIn" to="/signIn" class="nav-link">
            <font-awesome-icon icon="fa-solid fa-sign-in-alt" class="me-2"/>Sign In
          </RouterLink>
          <RouterLink v-else to="/" class="nav-link" @click="authStore.setAccessToken(null)">
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
