<template>
  <div class="login">
    <h2>Employee Login</h2>
    <form @submit.prevent="login">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const email = ref('');
const password = ref('');
const error = ref('');

async function login() {
  error.value = '';
  try {
    const base = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
    const { data } = await axios.post(base + '/api/auth/login', { email: email.value, password: password.value });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    window.location.href = '/';
  } catch (e) {
    error.value = e?.response?.data?.message || 'Login failed';
  }
}
</script>

<style>
.login { max-width: 360px; margin: 48px auto; display: flex; flex-direction: column; gap: 12px; }
input { padding: 10px; font-size: 14px; }
button { padding: 10px; }
.error { color: #d9534f; }
</style>
