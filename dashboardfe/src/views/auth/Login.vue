<!-- src/views/auth/Login.vue -->
<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            Archintel Writer/Editor Dashboard
          </p>
        </div>
        
        <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
          <div class="rounded-md shadow-sm -space-y-px">
            <div>
              <label for="email" class="sr-only">Email address</label>
              <input
                id="email"
                type="email"
                v-model="form.email"
                autocomplete="email"
                required
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label for="password" class="sr-only">Password</label>
              <input
                id="password"
                type="password"
                v-model="form.password"
                autocomplete="current-password"
                required
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>
  
          <div v-if="error" class="rounded-md bg-red-50 p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <ExclamationCircleIcon class="h-5 w-5 text-red-400" aria-hidden="true" />
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800">
                  {{ error }}
                </h3>
              </div>
            </div>
          </div>
  
          <div>
            <button
              type="submit"
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              :disabled="loading"
            >
              <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                <LockClosedIcon class="h-5 w-5 text-primary-500 group-hover:text-primary-400" aria-hidden="true" />
              </span>
              <span v-if="loading">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
              <span v-else>Sign in</span>
            </button>
          </div>
          
          <div class="mt-4 text-center">
            <p class="text-sm text-gray-600">
              Demo Credentials:
              <span class="font-medium">editor@archintel.com / editor123</span>
              or
              <span class="font-medium">writer@archintel.com / writer123</span>
            </p>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { useAuthStore } from '@/stores/auth';
  import { LockClosedIcon, ExclamationCircleIcon } from '@heroicons/vue/24/solid';
  
  const router = useRouter();
  const route = useRoute();
  const authStore = useAuthStore();
  
  const form = reactive({
    email: '',
    password: ''
  });
  
  const loading = ref(false);
  const error = ref('');
  
  const handleLogin = async () => {
  loading.value = true;
  error.value = '';
  
  try {
    const success = await authStore.login(form);
    
    if (success) {
      // Handle redirect here based on user type
      if (authStore.user.type === 'Writer') {
        console.log('Redirecting to writer dashboard');
        await router.push('/writer/dashboard'); // Use path instead of name
      } else if (authStore.user.type === 'Editor') {
        console.log('Redirecting to editor dashboard');
        await router.push('/editor/dashboard'); // Use path instead of name
      }
    } else {
      error.value = authStore.error || 'Failed to login. Please try again.';
    }
  } catch (err) {
    console.error('Unexpected login error:', err);
    error.value = 'An unexpected error occurred. Please try again.';
  } finally {
    loading.value = false;
  }
};
  </script>
  

  
