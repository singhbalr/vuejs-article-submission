<!-- src/views/editor/Dashboard.vue -->
<template>
    <div>
      <header>
        <h1 class="text-3xl font-bold text-gray-900">Editor Dashboard</h1>
        <p class="mt-2 text-sm text-gray-700">
          Welcome back, {{ user?.firstname }}! Manage articles, users, and companies.
        </p>
      </header>
  
      <div v-if="loading" class="flex justify-center py-12">
        <svg class="animate-spin h-10 w-10 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
  
      <div v-else>
        <!-- Quick Stats -->
        <div class="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <!-- Articles Pending Review -->
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0 bg-primary-100 rounded-md p-3">
                  <ClipboardDocumentListIcon class="h-6 w-6 text-primary-600" aria-hidden="true" />
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Articles Pending Review</dt>
                    <dd>
                      <div class="text-lg font-medium text-gray-900">{{ forPublishArticles.length }}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-4 sm:px-6">
              <div class="text-sm">
                <router-link to="/editor/media?status=For Edit" class="font-medium text-primary-600 hover:text-primary-500">
                  View all
                </router-link>
              </div>
            </div>
          </div>
  
          <!-- Published Articles -->
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0 bg-green-100 rounded-md p-3">
                  <CheckBadgeIcon class="h-6 w-6 text-green-600" aria-hidden="true" />
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Published Articles</dt>
                    <dd>
                      <div class="text-lg font-medium text-gray-900">{{ publishedArticles.length }}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-4 sm:px-6">
              <div class="text-sm">
                <router-link to="/editor/media?status=Published" class="font-medium text-primary-600 hover:text-primary-500">
                  View all
                </router-link>
              </div>
            </div>
          </div>
  
          <!-- Active Writers -->
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0 bg-blue-100 rounded-md p-3">
                  <UserGroupIcon class="h-6 w-6 text-blue-600" aria-hidden="true" />
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Active Writers</dt>
                    <dd>
                      <div class="text-lg font-medium text-gray-900">{{ activeWritersCount }}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-4 sm:px-6">
              <div class="text-sm">
                <router-link to="/editor/users" class="font-medium text-primary-600 hover:text-primary-500">
                  Manage users
                </router-link>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Articles For Review -->
        <section class="mt-8">
          <h2 class="text-xl font-semibold text-gray-900">Articles Pending Review</h2>
          <p class="mt-1 text-sm text-gray-500">
            These articles are awaiting editorial review and publishing.
          </p>
          
          <div v-if="forPublishArticles.length === 0" class="mt-4 bg-white shadow rounded-lg p-6 text-center">
            <CheckCircleIcon class="mx-auto h-12 w-12 text-gray-400" />
            <h3 class="mt-2 text-sm font-medium text-gray-900">No articles pending review</h3>
            <p class="mt-1 text-sm text-gray-500">
              All articles have been reviewed. Great job!
            </p>
          </div>
          
          <div v-else class="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <article-card 
              v-for="article in forPublishArticles" 
              :key="article.id" 
              :article="article"
              :editable="true"
            />
          </div>
        </section>
  
        <!-- Recently Published Articles -->
        <section class="mt-12">
          <h2 class="text-xl font-semibold text-gray-900">Recently Published Articles</h2>
          <p class="mt-1 text-sm text-gray-500">
            Articles that have been reviewed and published.
          </p>
          
          <div v-if="recentlyPublishedArticles.length === 0" class="mt-4 bg-white shadow rounded-lg p-6 text-center">
            <InboxIcon class="mx-auto h-12 w-12 text-gray-400" />
            <h3 class="mt-2 text-sm font-medium text-gray-900">No published articles yet</h3>
            <p class="mt-1 text-sm text-gray-500">
              Published articles will appear here.
            </p>
          </div>
          
          <div v-else class="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <article-card 
              v-for="article in recentlyPublishedArticles" 
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
  import { useUserStore } from '@/stores/user';
  import { 
    ClipboardDocumentListIcon, 
    CheckBadgeIcon, 
    UserGroupIcon, 
    CheckCircleIcon, 
    InboxIcon 
  } from '@heroicons/vue/24/outline';
  import ArticleCard from '@/components/articles/ArticleCard.vue';
  
  const articleStore = useArticleStore();
  const authStore = useAuthStore();
  const userStore = useUserStore();
  const showNotification = inject('showNotification');
  
  const loading = ref(true);
  const error = ref(null);
  
  // Get user from auth store
  const user = computed(() => authStore.user);
  
  // Articles filtered by status
  const forPublishArticles = computed(() => articleStore.forEditArticles);
  const publishedArticles = computed(() => articleStore.publishedArticles);
  
  // Get only the 6 most recently published articles
  const recentlyPublishedArticles = computed(() => {
    return [...publishedArticles.value]
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 6);
  });
  
  // Count of active writers
  const activeWritersCount = ref(0);
  
  onMounted(async () => {
    try {
      // Fetch articles
      await articleStore.fetchArticles();
      
      // Fetch users to get writer count
      await userStore.fetchUsers();
      activeWritersCount.value = userStore.users.filter(
        user => user.type === 'Writer' && user.status === 'Active'
      ).length;
    } catch (err) {
      error.value = err.message || 'Failed to load dashboard data';
      showNotification('Error', error.value, 'error');
    } finally {
      loading.value = false;
    }
  });
  </script>