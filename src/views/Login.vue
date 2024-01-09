<template>
    <form @submit.prevent="createAccount">
      <label for="name">Nom d'utilisateur:</label>
      <input v-model="name" type="text" id="name" required />
  
      <label for="password">Mot de passe:</label>
      <input v-model="password" type="password" id="password" required />
  
      <button type="submit">Créer un compte</button>
    </form>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import axios from 'axios';
  
  const name = ref('');
  const password = ref('');
  
  const createAccount = async () => {
    try {
      const response = await axios.post('http://localhost:3000/users', {
        name: name.value,
        password: password.value,
      });
  
      console.log(response.data); // Affiche la réponse de l'API
    } catch (error) {
      console.error('Erreur lors de la création du compte:', error);
    }
  };
  </script>
  