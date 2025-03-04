<template>
    <div>
      <header class="flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">All Media</h1>
          <p class="mt-2 text-sm text-gray-700">
            View, edit, and publish all articles.
          </p>
        </div>
      </header>
  
      <div class="mt-8">
        <!-- Filters -->
        <div class="bg-white shadow overflow-hidden sm:rounded-lg p-4 mb-6">
          <div class="flex flex-col sm:flex-row gap-4">
            <div class="flex-1">
              <label for="status-filter" class="block text-sm font-medium text-gray-700">Status</label>
              <select
                id="status-filter"
                v-model="filters.status"
                class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              >
                <option value="">All</option>
                <option value="For Edit">For Edit</option>
                <option value="Published">Published</option>
              </select>
            </div>
            <div class="flex-1">
              <label for="writer-filter" class="block text-sm font-medium text-gray-700">Writer</label>
              <select
                id="writer-filter"
                v-model="filters.writer"
                class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              >
                <option value="">All Writers</option>
                <option v-for="writer in writers" :key="writer.id" :value="writer.id">
                  {{ writer.firstname }} {{ writer.lastname }}
                </option>
              </select>
            </div>
            <div class="flex-1">
              <label for="company-filter" class="block text-sm font-medium text-gray-700">Company</label>
              <select
                id="company-filter"
                v-model="filters.company"
                class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              >
                <option value="">All Companies</option>
                <option v-for="company in companies" :key="company.id" :value="company.id">
                  {{ company.name }}
                </option>
              </select>
            </div>
            <div class="flex-1">
              <label for="search" class="block text-sm font-medium text-gray-700">Search</label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <input
                  type="text"
                  name="search"
                  id="search"
                  v-model="filters.search"
                  class="focus:ring-primary-500 focus:border-primary-500 block w-full pr-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Search by title..."
                />
                <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center py-12">
          <svg class="animate-spin h-10 w-10 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        
        <!-- Error State -->
        <div v-else-if="error" class="bg-red-50 p-4 rounded-md">
          <div class="flex">
            <div class="flex-shrink-0">
              <ExclamationCircleIcon class="h-5 w-5 text-red-400" aria-hidden="true" />
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">{{ error }}</h3>
            </div>
          </div>
        </div>
        
        <!-- Empty State -->
        <div v-else-if="filteredArticles.length === 0" class="bg-white shadow rounded-lg p-6 text-center">
          <DocumentTextIcon class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900">No articles found</h3>
          <p class="mt-1 text-sm text-gray-500">
            Try adjusting your search or filter criteria.
          </p>
        </div>
        
        <!-- Articles Table -->
        <div v-else class="bg-white shadow overflow-hidden sm:rounded-lg">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Article
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Writer / Editor
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" class="relative px-6 py-3">
                    <span class="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="article in filteredArticles" :key="article.id">
                  <!-- Article -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-16 bg-gray-100 rounded">
                        <img 
                          :src="article.image.startsWith('http') ? article.image : `http://localhost:5000${article.image}`" 
                          :alt="article.title"
                          class="h-10 w-16 object-cover rounded"
                        />
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900 truncate max-w-xs">{{ article.title }}</div>
                        <div class="text-sm text-gray-500">
                          <a :href="article.link" target="_blank" class="text-primary-600 hover:text-primary-900 truncate max-w-xs inline-block">
                            {{ article.link }}
                          </a>
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <!-- Company -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div v-if="article.company?.logo" class="flex-shrink-0 h-8 w-8">
                        <img 
                          :src="article.company.logo" 
                          :alt="article.company?.name"
                          class="h-8 w-8 object-contain"
                        />
                      </div>
                      <div class="ml-2">
                        <div class="text-sm text-gray-900">{{ article.company?.name }}</div>
                      </div>
                    </div>
                  </td>
                  
                  <!-- Date -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ formatDate(article.date) }}</div>
                  </td>
                  
                  <!-- Writer / Editor -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">
                      Writer: {{ getFullName(article.writer) }}
                    </div>
                    <div class="text-sm text-gray-500">
                      Editor: {{ article.editor ? getFullName(article.editor) : 'Not assigned' }}
                    </div>
                  </td>
                  
                  <!-- Status -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span 
                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                      :class="article.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'"
                    >
                      {{ article.status }}
                    </span>
                  </td>
                  
                  <!-- Actions -->
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <router-link 
                      :to="`/articles/${article.id}`"
                      class="text-secondary-600 hover:text-secondary-900 mr-4"
                    >
                      View
                    </router-link>
                    <router-link 
                      :to="`/articles/${article.id}/edit`"
                      class="text-primary-600 hover:text-primary-900"
                    >
                      Edit
                    </router-link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, inject, watch } from 'vue';
  import { useRoute } from 'vue-router';
  import { useArticleStore } from '@/stores/article';
  import { useUserStore } from '@/stores/user';
  import { useCompanyStore } from '@/stores/company';
  import { formatDate } from '@/utils/formatters';
  import { 
    DocumentTextIcon, 
    MagnifyingGlassIcon, 
    ExclamationCircleIcon 
  } from '@heroicons/vue/24/outline';
  
  const route = useRoute();
  const articleStore = useArticleStore();
  const userStore = useUserStore();
  const companyStore = useCompanyStore();
  const showNotification = inject('showNotification');
  
  const loading = ref(true);
  const error = ref(null);
  const filters = ref({
    status: route.query.status || '',
    writer: route.query.writer || '',
    company: route.query.company || '',
    search: route.query.search || ''
  });
  
  // Watch for route query changes
  watch(() => route.query, (newQuery) => {
    filters.value.status = newQuery.status || '';
    filters.value.writer = newQuery.writer || '';
    filters.value.company = newQuery.company || '';
    filters.value.search = newQuery.search || '';
  }, { immediate: true });
  
  // Get data from stores
  const articles = computed(() => articleStore.articles);
  const writers = computed(() => 
    userStore.users.filter(user => user.type === 'Writer')
  );
  const companies = computed(() => companyStore.companies);
  
  // Filter articles based on criteria
  const filteredArticles = computed(() => {
    return articles.value.filter(article => {
      // Status filter
      const statusMatch = !filters.value.status || article.status === filters.value.status;
      
      // Writer filter
      const writerMatch = !filters.value.writer || article.writer?.id === filters.value.writer;
      
      // Company filter
      const companyMatch = !filters.value.company || article.company?.id === filters.value.company;
      
      // Search filter (case insensitive search in title and content)
      const searchTerm = filters.value.search.toLowerCase();
      const searchMatch = !searchTerm || 
        article.title.toLowerCase().includes(searchTerm) || 
        article.content.toLowerCase().includes(searchTerm);
      
      return statusMatch && writerMatch && companyMatch && searchMatch;
    });
  });
  
  // Helper to get full name
  const getFullName = (user) => {
    if (!user) return 'Unknown';
    return `${user.firstname} ${user.lastname}`;
  };
  
  onMounted(async () => {
    try {
      // Load all required data
      const promises = [
        articleStore.fetchArticles(),
        userStore.fetchUsers(),
        companyStore.fetchCompanies()
      ];
      
      await Promise.all(promises);
    } catch (err) {
      error.value = err.message || 'Failed to load articles';
      showNotification('Error', error.value, 'error');
    } finally {
      loading.value = false;
    }
  });
  </script>