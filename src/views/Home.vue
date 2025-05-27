<script setup>
import { ref } from 'vue';

const email = ref(''),
    name = ref(''),
    password = ref('');

async function data(email, name, password) {
  const res = await fetch('http://192.168.69.87:8000/register/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      email: email.value,
      name: name.value,
      password: password.value,
    })
  })

  const data = await res.json();
  console.log('data', data);
}
</script>

<template>
  <router-link :to="{ name: 'board' }">Перейти в доску</router-link>
  <h1>Домашняя страница</h1>
  <form @submit.prevent="data(email, name, password)">
    <input type="text" v-model="email">
    <input type="text" v-model="name">
    <input type="password" v-model="password">
    <button>Отправить</button>
  </form>
</template>

<style scoped>

</style>