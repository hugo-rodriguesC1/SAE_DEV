<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const name = ref("");
const password = ref("");

const loginName = ref('');
const loginPassword = ref('');

const createAccount = async () => {
  try {
    const response = await axios.post("http://localhost:3000/users", {
      name: name.value,
      password: password.value,
    });

    console.log(response.data); // Affiche la réponse de l'API
  } catch (error) {
    console.error("Erreur lors de la création du compte:", error);
  }
};

const Login = () => {
  const user = users.value.users.find(
    (u) => u.name === loginName.value && u.password === loginPassword.value
  );

  if (user) {
    console.log("Connexion réussie");
    // Ajoutez ici la logique pour rediriger l'utilisateur
  } else {
    console.log("Échec de la connexion");
  }
};

const users = ref({});

const getUsers = async () => {
  const response = await axios.get("http://localhost:3000/users");
  return response.data;
};

onMounted(async () => {
  users.value = await getUsers();
  console.log(users);
});
</script>

<template>
  <form @submit.prevent="createAccount">
    <label for="name">Nom d'utilisateur:</label>
    <input v-model="name" type="text" id="name" required />

    <label for="password">Mot de passe:</label>
    <input v-model="password" type="password" id="password" required />

    <button type="submit">Créer un compte</button>
  </form>
  <form @submit.prevent="Login">
      <label for="loginName">Nom d'utilisateur:</label>
      <input v-model="loginName" type="text" id="loginName" required />

      <label for="loginPassword">Mot de passe:</label>
      <input v-model="loginPassword" type="password" id="loginPassword" required />

      <button type="submit">Connexion</button>
    </form>
</template>

<style lang="scss" scoped>
</style>
