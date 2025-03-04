<template>
    <div>
      <header>
        <h1 class="text-3xl font-bold text-gray-900">{{ isEditMode ? 'Edit Article' : 'Create Article' }}</h1>
        <p class="mt-2 text-sm text-gray-700">
          {{ isEditMode ? 'Update details and content of the article.' : 'Create a new article with details and content.' }}
        </p>
      </header>
  
      <div class="mt-8">
        <div v-if="loading" class="flex justify-center py-12">
          <svg class="animate-spin h-10 w-10 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
  
        <form v-else @submit.prevent="submitForm" class="bg-white shadow rounded-lg overflow-hidden">
          <div class="p-6 sm:p-8">
            <!-- Form Fields -->
            <div class="space-y-6">
              <!-- Article Title -->
              <div>
                <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
                <input
                  id="title"
                  v-model="form.title"
                  type="text"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  required
                />
              </div>
              
              <!-- Link -->
              <div>
                <label for="link" class="block text-sm font-medium text-gray-700">Link</label>
                <input
                  id="link"
                  v-model="form.link"
                  type="url"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  placeholder="https://example.com/article"
                  required
                />
                <p class="mt-1 text-xs text-gray-500">Valid URL where the article can be accessed</p>
              </div>
              
              <!-- Company Selection -->
              <div>
                <label for="company" class="block text-sm font-medium text-gray-700">Related Company</label>
                <select
                  id="company"
                  v-model="form.companyId"
                  class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                  required
                >
                  <option value="" disabled>Select a company</option>
                  <option 
                    v-for="company in activeCompanies" 
                    :key="company.id" 
                    :value="company.id"
                  >
                    {{ company.name }}
                  </option>
                </select>
              </div>
              
              <!-- Article Date -->
              <div>
                <label for="date" class="block text-sm font-medium text-gray-700">Date</label>
                <input
                  id="date"
                  v-model="form.date"
                  type="date"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  required
                />
              </div>
              
              <!-- Article Image -->
              <div>
                <label class="block text-sm font-medium text-gray-700">Article Image</label>
                <div v-if="imagePreview" class="mt-2 relative">
                  <img 
                    :src="imagePreview" 
                    alt="Article image preview" 
                    class="h-48 w-full object-cover rounded-md"
                  />
                  <button
                    type="button"
                    @click="clearImage"
                    class="absolute top-2 right-2 bg-white rounded-full p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <XMarkIcon class="h-5 w-5" />
                  </button>
                </div>
                <div
                  v-else
                  class="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md"
                >
                  <div class="space-y-1 text-center">
                    <svg
                      class="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    <div class="flex text-sm text-gray-600">
                      <label
                        for="image-upload"
                        class="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                      >
                        <span>Upload an image</span>
                        <input
                          id="image-upload"
                          name="image-upload"
                          type="file"
                          class="sr-only"
                          @change="handleImageUpload"
                          accept="image/*"
                        />
                      </label>
                      <p class="pl-1">or drag and drop</p>
                    </div>
                    <p class="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                  </div>
                </div>
                <p v-if="imageRequired && !form.image && !imageFile" class="mt-1 text-sm text-red-600">
                  Article image is required
                </p>
              </div>
              
              <!-- Article Content (WYSIWYG Editor) -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Content</label>
                <QuillEditor
                  v-model:content="form.content"
                  theme="snow"
                  toolbar="full"
                  contentType="html"
                  :options="editorOptions"
                  class="h-64"
                />
              </div>
              
              <!-- Form Error -->
              <div v-if="error" class="rounded-md bg-red-50 p-4">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <ExclamationCircleIcon class="h-5 w-5 text-red-400" aria-hidden="true" />
                  </div>
                  <div class="ml-3">
                    <h3 class="text-sm font-medium text-red-800">{{ error }}</h3>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Form Actions -->
            <div class="mt-8 flex justify-end">
              <button
                type="button"
                @click="$router.go(-1)"
                class="btn btn-secondary mr-3"
              >
                Cancel
              </button>
              <button
                v-if="isEditMode && authStore.isEditor && article.status === 'For Edit'"
                type="button"
                @click="publishArticle"
                class="btn bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 mr-3"
                :disabled="submitting"
              >
                <span v-if="publishing">
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Publishing...
                </span>
                <span v-else>Publish</span>
              </button>
              <button
                type="submit"
                class="btn btn-primary"
                :disabled="submitting"
              >
                <span v-if="submitting">
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
                <span v-else>{{ isEditMode ? 'Update' : 'Create' }}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, inject } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { useArticleStore } from '@/stores/article';
  import { useCompanyStore } from '@/stores/company';
  import { useAuthStore } from '@/stores/auth';
  import { QuillEditor } from '@vueup/vue-quill';
  import '@vueup/vue-quill/dist/vue-quill.snow.css';
  import { ExclamationCircleIcon, XMarkIcon } from '@heroicons/vue/24/outline';
  import moment from 'moment';
  
  const router = useRouter();
  const route = useRoute();
  const articleStore = useArticleStore();
  const companyStore = useCompanyStore();
  const authStore = useAuthStore();
  const showNotification = inject('showNotification');
  
  // Form state
  const loading = ref(true);
  const error = ref('');
  const submitting = ref(false);
  const publishing = ref(false);
  const imageFile = ref(null);
  const imagePreview = ref('');
  const imageRequired = ref(true);
  const article = ref(null);
  
  // Form data
  const form = ref({
    title: '',
    link: '',
    companyId: '',
    date: moment().format('YYYY-MM-DD'),
    content: '',
    image: null
  });
  
  // Editor options
  const editorOptions = {
    modules: {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'header': 1 }, { 'header': 2 }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'align': [] }],
        ['link'],
        ['clean']
      ]
    },
    placeholder: 'Write your article content here...'
  };
  
  // Check if in edit mode
  const isEditMode = computed(() => !!route.params.id);
  
  // Get active companies for dropdown
  const activeCompanies = computed(() => {
    return companyStore.companies.filter(company => company.status === 'Active');
  });
  
  // Initialize form
  onMounted(async () => {
    try {
      // Fetch companies for dropdown
      await companyStore.fetchCompanies();
      
      // If editing, fetch article data
      if (isEditMode.value) {
        await articleStore.fetchArticleById(route.params.id);
        
        article.value = articleStore.currentArticle;
        
        // Check if user has permission to edit this article
        if (authStore.user.type === 'Writer' && 
            article.value.writer.id !== authStore.user.id) {
          showNotification('Error', 'You do not have permission to edit this article', 'error');
          router.push('/');
          return;
        }
        
        // Check if writer can edit published article
        if (authStore.user.type === 'Writer' && 
            article.value.status === 'Published') {
          showNotification('Error', 'Cannot edit published articles', 'error');
          router.push('/');
          return;
        }
        
        // Populate form with article data
        form.value = {
          title: article.value.title,
          link: article.value.link,
          companyId: article.value.company.id,
          date: moment(article.value.date).format('YYYY-MM-DD'),
          content: article.value.content,
          image: article.value.image
        };
        
        // Set image preview if article has image
        if (article.value.image) {
          imagePreview.value = article.value.image.startsWith('http') 
            ? article.value.image 
            : `http://localhost:5000${article.value.image}`;
          
          // Image not required when editing if already has one
          imageRequired.value = false;
        }
      }
    } catch (err) {
      error.value = err.message || 'Failed to load data';
      showNotification('Error', error.value, 'error');
    } finally {
      loading.value = false;
    }
  });
  
// When handling the image upload:
const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  
  // Store the actual File object
  imageFile.value = file;
  
  // Create preview
  const reader = new FileReader();
  reader.onload = (e) => {
    imagePreview.value = e.target.result;
  };
  reader.readAsDataURL(file);
};
  
  // Clear image selection
  const clearImage = () => {
    imageFile.value = null;
    imagePreview.value = '';
    
    // If in edit mode and had an existing image, clear that too
    if (isEditMode.value && form.value.image) {
      form.value.image = null;
    }
  };
  
  // Submit the form
  const submitForm = async () => {
    // Validate form
    if (imageRequired.value && !imageFile.value && !form.value.image) {
      showNotification('Error', 'Please upload an article image', 'error');
      return;
    }
    
    submitting.value = true;
    error.value = '';
    
    try {
      // Create FormData for file upload
      const formData = new FormData();
      
      // Add form fields
      formData.append('title', form.value.title);
      formData.append('link', form.value.link);
      formData.append('companyId', form.value.companyId);
      formData.append('date', moment(form.value.date).toISOString());
      formData.append('content', form.value.content);
      
      // Add image file if provided
      if (imageFile.value) {
        formData.append('image', imageFile.value);
      }
      
      let result;
      
      if (isEditMode.value) {
        // Update existing article
        result = await articleStore.updateArticle(article.value.id, formData);
        showNotification('Success', 'Article updated successfully', 'success');
      } else {
        // Create new article
        result = await articleStore.createArticle(formData);
        showNotification('Success', 'Article created successfully', 'success');
      }
      
      // Redirect to article view
      router.push(`/articles/${result.id}`);
    } catch (err) {
      error.value = err.message || 'Failed to save article';
      showNotification('Error', error.value, 'error');
      
      // Scroll to the top to show the error
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      submitting.value = false;
    }
  };
  
  // Publish the article (Editor only)
  const publishArticle = async () => {
    publishing.value = true;
    error.value = '';
    
    try {
      // Create FormData for file upload
      const formData = new FormData();
      
      // Add form fields
      formData.append('title', form.value.title);
      formData.append('link', form.value.link);
      formData.append('companyId', form.value.companyId);
      formData.append('date', moment(form.value.date).toISOString());
      formData.append('content', form.value.content);
      formData.append('status', 'Published');
      
      // Add image file if provided
        if (imageFile.value) {
            formData.append('image', imageFile.value, imageFile.value.name);
            console.log('Image file appended:', imageFile.value.name);

        }

    // Add this before sending the request
        console.log('Image file:', imageFile.value);
    for (const pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
    }
      
      // Update and publish article
      const result = await articleStore.updateArticle(article.value.id, formData, true);
      
      showNotification('Success', 'Article published successfully', 'success');
      
      // Redirect to article view
      router.push(`/articles/${result.id}`);
    } catch (err) {
      error.value = err.message || 'Failed to publish article';
      showNotification('Error', error.value, 'error');
      
      // Scroll to the top to show the error
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      publishing.value = false;
    }
  };
  </script>