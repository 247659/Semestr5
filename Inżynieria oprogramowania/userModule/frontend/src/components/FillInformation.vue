<template>
    <div>
      <h2>Wypełnij dane</h2>
      <form @submit.prevent="fillData">
        <div>
          <label for="name">Imię:</label>
          <input type="text" v-model="name" id="name" required />
        </div>
        <div>
          <label for="surname">Nazwisko:</label>
          <input type="text" v-model="surname" id="surname" required />
        </div>
        <div>
          <label for="pesel">PESEL:</label>
          <input type="text" v-model="pesel" id="pesel" required />
        </div>
        <button type="submit">Potwierdź dane</button>
      </form>
      <div v-if="error" class="error">
        <p>Błąd podczas wypełniania danych: {{ error }}</p>
      </div>
      <div v-if="updatedUser" class="success">
        <p>Dane użytkownika zostały zaktualizowane!</p>
        <pre>{{ updatedUser }}</pre>
      </div>
    </div>
  </template>
  
  <script>
  import UserService from '@/services/UserService'; // Zakładając, że masz UserService.js w odpowiednim katalogu
  
  export default {
    data() {
      return {
        username: 'testowy', // Możesz dynamicznie ustawić nazwę użytkownika w zależności od aplikacji
        name: '',
        surname: '',
        pesel: '',
        updatedUser: null,
        error: null,
      };
    },
    methods: {
      fillData() {
        const requestData = {
          name: this.name,
          surname: this.surname,
          pesel: this.pesel
        };
  
        UserService.fillUserInformation(this.username, requestData)
          .then(updatedUser => {
            this.updatedUser = updatedUser;
            this.error = null;
          })
          .catch(error => {
            this.error = error.response ? error.response.data : 'Nieznany błąd';
            this.updatedUser = null;
          });
      },
    },
  };
  </script>
  
  <style scoped>
  .error {
    color: red;
  }
  
  .success {
    color: green;
  }
  </style>
  