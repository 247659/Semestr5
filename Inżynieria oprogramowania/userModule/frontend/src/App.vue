<template>
  <UsersComponent />
  <FillInformation />
</template>

<script>
import FillInformation from './components/FillInformation.vue';
import UsersComponent from './components/UsersComponent.vue';

export default {
  name: 'App',
  components: {
    UsersComponent,
    FillInformation
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
