<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import axios from "axios";
import { client } from '@/utils/axios.js'

const route = useRoute()
const router = useRouter()

const token = localStorage.getItem('token');
const headers = { Authorization: `Bearer ${token}` };

const userId = ref(null);
const name = ref()

const getName = async (id) => {
  const response = await client.get('/user/' + id, { headers })
  return response.data.rows[0].name
}

const Logout = () => {
  localStorage.removeItem('token');
  console.log('deco')
  router.push('/login');
}

onMounted(async () => {
  // Récupérez l'ID de l'utilisateur à partir des paramètres de l'URL
  userId.value = route.params.id;
  name.value = await getName(route.params.id)
  console.log(name.value)
});
</script>

<template>
<div class="page">Liste des montres</div>
<p>Utilisateur ID: {{ userId }}</p>
<p>Name: {{ name }}</p>
<button @click="Logout">DECO</button>
</template>

<style lang="scss" scoped>

</style>