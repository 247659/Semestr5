<script setup>
import { ref, provide } from 'vue';
import { RouterLink, RouterView} from 'vue-router'
import { BNavbar, BNavbarBrand, BNavbarToggle, BCollapse, BNavbarNav, BNavItem, BNavItemDropdown, BDropdownItem } from 'bootstrap-vue-next'

const loggedIn = ref(false)
const setLoggedIn = (value) => {
  loggedIn.value = value
}

provide('loggedIn', loggedIn)
provide('setLoggedIn', setLoggedIn)
</script>

<template>
  <div>
    <BNavbar v-b-color-mode="'dark'" toggleable="lg" variant="primary" class="fixed-top w-100">
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
  
  <!-- <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav> -->

  <RouterView />
</template>

<style scoped>

</style>
