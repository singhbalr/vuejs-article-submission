<!-- src/views/articles/ArticleView.vue -->
<template>
    <div>
      <div v-if="loading" class="flex justify-center py-12">
        <svg class="animate-spin h-10 w-10 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      
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
      
      <div v-else>
        <!-- Article Header -->
        <div class="mb-8">
          <div class="flex justify-between items-start">
            <h1 class="text-3xl font-bold text-gray-900">{{ article.title }}</h1>
            <div>
              <span 
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                :class="article.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'"
              >
                {{ article.status }}
              </span>
            </div>
          </div>
          
          <div class="mt-2 flex flex-wrap items-center text-sm text-gray-500 space-x-4">
            <div class="flex items-center">
              <CalendarIcon class="mr-1.5 h-4 w-4 text-gray-400" />
              <span>{{ formattedDate }}</span>
            </div>
            <div class="flex items-center">
              <UserIcon class="mr-1.5 h-4 w-4 text-gray-400" />
              <span>{{ writerName }}</span>
            </div>
            <div class="flex items-center">
              <BuildingOfficeIcon class="mr-1.5 h-4 w-4 text-gray-400" />
              <span>{{ article.company?.name }}</span>
            </div>
            <div v-if="article.editor" class="flex items-center">
              <PencilIcon class="mr-1.5 h-4 w-4 text-gray-400" />
              <span>Editor: {{ editorName }}</span>
            </div>
          </div>
          
          <div class="mt-2">
            <a 
              :href="article.link" 
              target="_blank" 
              class="text-primary-600 hover:text-primary-900 text-sm inline-flex items-center"
            >
              <LinkIcon class="mr-1.5 h-4 w-4" />
              {{ article.link }}
            </a>
          </div>
        </div>
        
        <!-- Article Actions -->
        <div class="mb-6 flex space-x-4">
          <button
            type="button"
            @click="$router.go(-1)"
            class="btn btn-secondary inline-flex items-center"
          >
            <ArrowLeftIcon class="mr-1.5 h-4 w-4" />
            Back
          </button>
          
          <router-link
            v-if="canEdit"
            :to="`/articles/${article.id}/edit`"
            class="btn btn-primary inline-flex items-center"
          >
            <PencilIcon class="mr-1.5 h-4 w-4" />
            Edit
          </router-link>
        </div>
        
        <!-- Article Image -->
        <div class="mb-8">
          <img 
            :src="articleImage" 
            :alt="article.title"
            class="w-full h-64 object-cover rounded-lg"
            @error="onImageError"
          />
        </div>
        
        <!-- Article Content -->
        <div class="bg-white shadow rounded-lg overflow-hidden">
          <div class="p-6 prose prose-primary max-w-none" v-html="article.content"></div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, inject } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useArticleStore } from '@/stores/article';
  import { useAuthStore } from '@/stores/auth';
  import { formatDate } from '@/utils/formatters';
  import { 
    CalendarIcon, 
    UserIcon, 
    BuildingOfficeIcon, 
    PencilIcon,
    LinkIcon,
    ArrowLeftIcon,
    ExclamationCircleIcon
  } from '@heroicons/vue/24/outline';
  
  const route = useRoute();
  const router = useRouter();
  const articleStore = useArticleStore();
  const authStore = useAuthStore();
  const showNotification = inject('showNotification');
  
  const loading = ref(true);
  const error = ref('');
  const article = computed(() => articleStore.currentArticle);
  
  // Handle image path
  const imageFallback = 'https://placehold.co/800x400/png';
  const articleImage = ref('');
  
  // Format date
  const formattedDate = computed(() => {
    if (!article.value?.date) return '';
    return formatDate(article.value.date);
  });
  
  // Get writer's name
  const writerName = computed(() => {
    if (!article.value?.writer) return 'Unknown';
    return `${article.value.writer.firstname} ${article.value.writer.lastname}`;
  });
  
  // Get editor's name
  const editorName = computed(() => {
    if (!article.value?.editor) return 'Not assigned';
    return `${article.value.editor.firstname} ${article.value.editor.lastname}`;
  });
  
  // Check if user can edit this article
  const canEdit = computed(() => {
    if (!authStore.user || !article.value) return false;
    
    // Editors can edit any article
    if (authStore.isEditor) return true;
    
    // Writers can only edit their own unpublished articles
    if (authStore.isWriter) {
      return article.value.writer.id === authStore.user.id && 
             article.value.status === 'For Edit';
    }
    
    return false;
  });
  
  // Handle image loading error
  const onImageError = () => {
    articleImage.value = imageFallback;
  };
  
  onMounted(async () => {
    try {
      await articleStore.fetchArticleById(route.params.id);
      
      // Set article image
      if (article.value?.image) {
        articleImage.value = article.value.image.startsWith('http') 
          ? article.value.image 
          : `http://localhost:5000${article.value.image}`;
      } else {
        articleImage.value = imageFallback;
      }
    } catch (err) {
      error.value = err.message || 'Failed to load article';
      showNotification('Error', error.value, 'error');
    } finally {
      loading.value = false;
    }
  });
  </script>