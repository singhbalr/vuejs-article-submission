<!-- src/views/writer/Dashboard.vue -->
<template>
    <div>
      <header>
        <h1 class="text-3xl font-bold text-gray-900">Writer Dashboard</h1>
        <p class="mt-2 text-sm text-gray-700">
          Welcome back, {{ user?.firstname }}! Manage your articles and check publishing status.
        </p>
      </header>
  
      <div v-if="loading" class="flex justify-center py-12">
        <svg class="animate-spin h-10 w-10 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
  
      <div v-else>
        <!-- Create Article Button -->
        <div class="mt-6 mb-8">
          <router-link to="/articles/create" class="btn btn-primary inline-flex items-center">
            <PlusIcon class="h-5 w-5 mr-2" />
            Create New Article
          </router-link>
        </div>
  
        <!-- Articles For Edit -->
        <section class="mt-8">
          <h2 class="text-xl font-semibold text-gray-900">Articles For Edit</h2>
          <p class="mt-1 text-sm text-gray-500">
            These articles are in draft state and need to be completed before they can be published.
          </p>
          
          <div v-if="forEditArticles.length === 0" class="mt-4 bg-white shadow rounded-lg p-6 text-center">
            <DocumentTextIcon class="mx-auto h-12 w-12 text-gray-400" />
            <h3 class="mt-2 text-sm font-medium text-gray-900">No articles in editing</h3>
            <p class="mt-1 text-sm text-gray-500">
              Get started by creating a new article.
            </p>
            <div class="mt-6">
              <router-link to="/articles/create" class="btn btn-primary inline-flex items-center">
                <PlusIcon class="h-5 w-5 mr-2" />
                New Article
              </router-link>
            </div>
          </div>
          
          <div v-else class="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <article-card 
              v-for="article in forEditArticles" 
              :key="article.id" 
              :article="article"
              :editable="article.writer?.id === user?.id && article.status === 'For Edit'"
            />
          </div>
        </section>
  
        <!-- Published Articles -->
        <section class="mt-12">
          <h2 class="text-xl font-semibold text-gray-900">Published Articles</h2>
          <p class="mt-1 text-sm text-gray-500">
            Articles that have been reviewed and published by an editor.
          </p>
          
          <div v-if="publishedArticles.length === 0" class="mt-4 bg-white shadow rounded-lg p-6 text-center">
            <InboxIcon class="mx-auto h-12 w-12 text-gray-400" />
            <h3 class="mt-2 text-sm font-medium text-gray-900">No published articles yet</h3>
            <p class="mt-1 text-sm text-gray-500">
              Your articles will appear here once they're reviewed and published by an editor.
            </p>
          </div>
          
          <div v-else class="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <article-card 
              v-for="article in publishedArticles" 
              :key="article.id" 
              :article="article" 
              :editable="false"
            />
          </div>
        </section>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, inject } from 'vue';
  import { useArticleStore } from '@/stores/article';
  import { useAuthStore } from '@/stores/auth';
  import { PlusIcon, DocumentTextIcon, InboxIcon } from '@heroicons/vue/24/outline';
  import ArticleCard from '@/components/articles/ArticleCard.vue';
  
  const articleStore = useArticleStore();
  const authStore = useAuthStore();
  const showNotification = inject('showNotification');
  
  const loading = ref(true);
  const error = ref(null);
  
  // Get user from auth store
  const user = computed(() => authStore.user);
  
  // Articles filtered by status
  const forEditArticles = computed(() => articleStore.forEditArticles);
  const publishedArticles = computed(() => articleStore.publishedArticles);
  
  onMounted(async () => {
    try {
      await articleStore.fetchArticles();
    } catch (err) {
      error.value = err.message || 'Failed to load articles';
      showNotification('Error', error.value, 'error');
    } finally {
      loading.value = false;
    }
  });
  </script>