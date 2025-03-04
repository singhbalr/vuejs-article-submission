<!-- src/App.vue -->
<template>
  <div class="app-container">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import axios from 'axios';

const authStore = useAuthStore();

// Set up axios interceptor for auth token
axios.interceptors.request.use(
  config => {
    const token = authStore.token;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Set up axios interceptor for handling auth errors
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      authStore.logout();
    }
    return Promise.reject(error);
  }
);

onMounted(() => {
  // If user is logged in, fetch current user data
  if (authStore.isAuthenticated) {
    authStore.getCurrentUser();
  }
});
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

<!-- src/layouts/MainLayout.vue -->
