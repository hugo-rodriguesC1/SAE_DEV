<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import axios from "axios";
import { client } from '@/utils/axios.js'

const route = useRoute()
const router = useRouter()

const token = localStorage.getItem('token');
const headers = { Authorization: `Bearer ${token}` };

const name = ref()
const montres = ref()
const boitier = ref()

function redirect(err) {
  if(err.response.data.error==="Token invalide"){
    router.push('/login');
  }
}

const getName = async () => {
  const response = await client.get('/username', { headers }).catch(
    redirect
  )
  return response.data.rows[0].name
}
const getMontres = async () => {
  const response = await client.get('/cart', { headers }).catch(
    redirect
  )
  return response.data.rows
}

const Logout = () => {
  localStorage.removeItem('token');
  console.log('deco')
  router.push('/login');
}

onMounted(async () => {
  name.value = await getName()
  montres.value = await getMontres()
});
</script>

<template>
<div class="page">
  <div class="firstline">
      <div class="firstline__content">
        <p><span></span>WATCH</p>
      </div>
      <div class="firstline__content">
        <p>3D VIEWER</p>
      </div>
      <div class="firstline__content">
        <div @click="Logout">LOGOUT</div>
      </div>
    </div>
    <div class="collection">
      <div class="collection__title">
        CART
      </div>
      <div class="collection__container">
        <div class="collection__card" v-for="montre in montres" :key="montre.montre_id">
          <div class="collection__content"># <span>{{ montre.montre_id }}</span></div>
          <div class="collection__content">BOITIER : <span>{{ montre.boitier ? 'ROND' : 'CARRÉ' }}</span></div>
          <div class="collection__content">BRACELET : <span>{{ montre.braceletName }}</span></div>
          <div class="collection__button">MODIFY</div>
        </div>
      </div>
    </div>
    <div class="username">{{ name }}</div>
</div>
</template>

<style lang="scss" scoped>

.page {
  background-color: $primary-color;
  color: $secondary-color;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.firstline{
  display: flex;
  width: 100vw;
  justify-content: space-between;
  border-bottom: 1px solid $secondary-color;
  &__content {
    display: flex;
    width: fit-content;
    height: rem(20);
    padding: rem(10);
    &:nth-child(3) {
      border-left: 1px solid $secondary-color;  
      display: flex; 
      gap: rem(20);
      a {
        color: $secondary-color; 
      }
      &:hover {
        background-color: $secondary-color;
        color: $primary-color;
        a {
          color: $primary-color; 
        }
      }
    }
  }
}

.collection {
  padding: rem(10);
  &__container {
    margin-top: rem(10);
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: rem(10);
  }
  &__card {
    border: solid 1px $secondary-color;
    display: flex;
    flex-direction: column;
    align-items: start;
    padding: rem(10);
  }
  &__button {
    padding: rem(10);
    margin-top: rem(20);
    background-color: $third-color;
    align-self: flex-end;
    &:hover {
      background-color: $secondary-color;
      color: $primary-color;
    }
  }
}

.username {
  text-transform: uppercase;
  position: absolute;
  bottom: rem(10);
  right: rem(10);
  text-align: center;
}

</style>