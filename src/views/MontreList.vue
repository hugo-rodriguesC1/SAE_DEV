<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router'

const route = useRoute()


const userId = ref(null);

onMounted(() => {
  // Récupérez l'ID de l'utilisateur à partir des paramètres de l'URL
  userId.value = route.params.id;
});
</script>

<template>
<div class="page">Liste des montres</div>
<p>Utilisateur ID: {{ userId }}</p>

</template>

<style lang="scss" scoped>

</style>