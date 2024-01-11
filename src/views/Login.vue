<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();

const name = ref("");
const password = ref("");

const loginName = ref("");
const loginPassword = ref("");

const user = ref();
const message = ref();

const createAccount = async () => {
  try {
    const response = await axios.post("http://localhost:3000/register", {
      name: name.value,
      password: password.value,
    });

    console.log(response.data); // Affiche la réponse de l'API
    message.value = "Compte créé";
  } catch (error) {
    console.error("Erreur lors de la création du compte:", error);
    message.value = "Échec de la création";
  }
};

const loginAccount = async () => {
  try {
    const response = await axios.post("http://localhost:3000/login", {
      name: loginName.value,
      password: loginPassword.value,
    });

    console.log(response.data); // Affiche la réponse de l'API
    message.value = "CO OK";
    localStorage.setItem('token', response.data.token);
    setTimeout(() => {
      router.push({
        name: "montre-list-id",
      });
    }, 1500);
  } catch (error) {
    console.error("Erreur lors de la création du compte:", error);
    message.value = "CO ECHEC";
  }
};

onMounted(async () => {
});
</script>

<template>
  <div class="page">
    <div class="hero">REGISTER OR LOGIN TO ACCESS 3D VIEWER</div>
    <form @submit.prevent="createAccount" class="form">
      <label for="name">USERNAME</label>
      <input v-model="name" type="text" id="name" required />
      <label for="password">PASSWORD</label>
      <input v-model="password" type="password" id="password" required />
      <button class="form__button" type="submit">REGISTER</button>
    </form>
    <form @submit.prevent="loginAccount" class="form">
      <label for="loginName">USERNAME</label>
      <input v-model="loginName" type="text" id="loginName" required />
      <label for="loginPassword">PASSWORD</label>
      <input
        v-model="loginPassword"
        type="password"
        id="loginPassword"
        required
      />
      <button class="form__button" type="submit">LOGIN</button>
    </form>
    <div class="result">
      <div class="result__title">CONSOLE</div>
      <div class="result__content">{{ message }}</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page {
  background-color: $primary-color;
  color: $secondary-color;
  width: 100vw;
  height: 100vh;
}

.hero {
  font-size: rem(60);
  padding: rem(10);
  border-bottom: 1px solid $secondary-color;
}

.form {
  display: flex;
  align-items: center;
  font-size: rem(40);
  border-bottom: 1px solid $secondary-color;
  width: 100vw;
  > label {
    padding: rem(10);
    border-right: 1px solid $secondary-color;
    width: 20vw;
  }
  input {
    width: 20vw;
    height: rem(63);
    font-size: rem(40);
  }
  button {
    width: 20vw;
    height: rem(68);
    font-size: rem(40);
  }
}

.result {
  display: flex;
  width: 100vw;
  border-bottom: 1px solid $secondary-color;
  font-size: rem(40);
  color: $third-color;
  &__title {
    padding: rem(10);
    border-right: 1px solid $secondary-color;
  }
  &__content {
    padding: rem(10);
    text-transform: uppercase;
  }
}
</style>
