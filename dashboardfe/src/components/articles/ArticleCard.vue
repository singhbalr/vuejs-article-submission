<!-- src/components/articles/ArticleCard.vue -->
<template>
    <article class="bg-white shadow rounded-lg overflow-hidden">
      <div class="p-6">
        <!-- Article Image -->
        <div class="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg overflow-hidden">
          <img 
            :src="articleImage" 
            :alt="article.title"
            class="w-full h-full object-cover"
            @error="onImageError"
          />
        </div>
        
        <!-- Article Title and Content Preview -->
        <div class="mt-4">
          <h3 class="text-lg font-medium text-gray-900 line-clamp-2">{{ article.title }}</h3>
          <div class="mt-2 text-sm text-gray-600 line-clamp-3" v-html="contentPreview"></div>
        </div>
        
        <!-- Article Metadata -->
        <div class="mt-4 flex flex-wrap items-center text-sm text-gray-500 space-x-4">
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
            <span>{{ companyName }}</span>
          </div>
        </div>
        
        <!-- Article Status -->
        <div class="mt-4 flex items-center">
          <span 
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
            :class="statusClass"
          >
            {{ article.status }}
          </span>
          <span class="ml-2 text-xs text-gray-500" v-if="article.editor && article.status === 'Published'">
            Edited by {{ editorName }}
          </span>
        </div>
        
        <!-- Actions -->
        <div class="mt-4 flex justify-between">
          <router-link 
            :to="`/articles/${article.id}`"
            class="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            <EyeIcon class="mr-1.5 h-4 w-4" />
            View
          </router-link>
          <router-link 
            v-if="editable"
            :to="`/articles/${article.id}/edit`"
            class="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            <PencilIcon class="mr-1.5 h-4 w-4" />
            Edit
          </router-link>
        </div>
      </div>
    </article>
  </template>
  
  <script setup>
  import { computed, ref } from 'vue';
  import { formatDate } from '@/utils/formatters';
  import { 
    CalendarIcon, 
    UserIcon, 
    BuildingOfficeIcon, 
    EyeIcon, 
    PencilIcon 
  } from '@heroicons/vue/24/outline';
  
  const props = defineProps({
    article: {
      type: Object,
      required: true
    },
    editable: {
      type: Boolean,
      default: false
    }
  });
  
  // Handle image path
  const imageFallback = 'https://placehold.co/800x400/png';
  const articleImage = ref(props.article.image.startsWith('http') 
    ? props.article.image 
    : `http://localhost:5000${props.article.image}`);
  
  // Handle image loading error
  const onImageError = () => {
    articleImage.value = imageFallback;
  };
  
  // Format date
  const formattedDate = computed(() => formatDate(props.article.date));
  
  // Get writer's name
  const writerName = computed(() => {
    if (!props.article.writer) return 'Unknown';
    return `${props.article.writer.firstname} ${props.article.writer.lastname}`;
  });
  
  // Get editor's name
  const editorName = computed(() => {
    if (!props.article.editor) return '';
    return `${props.article.editor.firstname} ${props.article.editor.lastname}`;
  });
  
  // Get company name
  const companyName = computed(() => props.article.company?.name || 'Unknown');
  
  // Get status class based on status
  const statusClass = computed(() => {
    return props.article.status === 'Published'
      ? 'bg-green-100 text-green-800'
      : 'bg-yellow-100 text-yellow-800';
  });
  
  // Clean HTML for preview
  const contentPreview = computed(() => {
    // Create a temporary div to strip HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = props.article.content;
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    
    // Return first 150 characters
    return textContent.substring(0, 150) + (textContent.length > 150 ? '...' : '');
  });
  </script>

  
