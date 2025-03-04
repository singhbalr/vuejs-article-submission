<!-- src/views/editor/CompanyManagement.vue -->
<template>
    <div>
      <header class="flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Company Management</h1>
          <p class="mt-2 text-sm text-gray-700">
            Add and manage companies for article categorization.
          </p>
        </div>
        <button 
          @click="openCreateCompanyModal"
          class="btn btn-primary inline-flex items-center"
        >
          <PlusIcon class="h-5 w-5 mr-2" />
          Add Company
        </button>
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
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
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
                  placeholder="Search by company name..."
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
        <div v-else-if="filteredCompanies.length === 0" class="bg-white shadow rounded-lg p-6 text-center">
          <BuildingOfficeIcon class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900">No companies found</h3>
          <p class="mt-1 text-sm text-gray-500">
            {{ filters.search || filters.status ? 'Try adjusting your search or filter criteria.' : 'Get started by adding a new company.' }}
          </p>
          <div v-if="!filters.search && !filters.status" class="mt-6">
            <button @click="openCreateCompanyModal" class="btn btn-primary inline-flex items-center">
              <PlusIcon class="h-5 w-5 mr-2" />
              Add Company
            </button>
          </div>
        </div>
        
        <!-- Companies Grid -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="company in filteredCompanies" 
            :key="company.id"
            class="bg-white shadow rounded-lg overflow-hidden"
          >
            <div class="p-6">
              <div class="flex items-start justify-between">
                <div class="flex items-center">
                  <div class="h-12 w-12 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                    <img 
                      :src="company.logo" 
                      :alt="company.name"
                      class="h-12 w-12 object-contain"
                      onerror="this.src='https://via.placeholder.com/150x150?text=Logo'; this.onerror=null;"
                    />
                  </div>
                  <div class="ml-4">
                    <h3 class="text-lg font-medium text-gray-900">{{ company.name }}</h3>
                    <span 
                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full mt-1"
                      :class="company.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                    >
                      {{ company.status }}
                    </span>
                  </div>
                </div>
                <div>
                  <button
                    @click="openEditCompanyModal(company)"
                    class="text-primary-600 hover:text-primary-900"
                  >
                    <PencilIcon class="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <div class="mt-6 border-t border-gray-200 pt-4">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-500">Articles:</span>
                  <span class="text-gray-900 font-medium">{{ getCompanyArticlesCount(company.id) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Create/Edit Company Modal -->
      <TransitionRoot appear :show="showCompanyModal" as="template">
        <Dialog as="div" @close="closeCompanyModal" class="relative z-10">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0"
            enter-to="opacity-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100"
            leave-to="opacity-0"
          >
            <div class="fixed inset-0 bg-black bg-opacity-25" />
          </TransitionChild>
  
          <div class="fixed inset-0 overflow-y-auto">
            <div class="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as="template"
                enter="duration-300 ease-out"
                enter-from="opacity-0 scale-95"
                enter-to="opacity-100 scale-100"
                leave="duration-200 ease-in"
                leave-from="opacity-100 scale-100"
                leave-to="opacity-0 scale-95"
              >
                <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                    {{ isEditMode ? 'Edit Company' : 'Create New Company' }}
                  </DialogTitle>
                  
                  <form @submit.prevent="submitCompanyForm" class="mt-4 space-y-4">
                    <!-- Company Name -->
                    <div>
                      <label for="name" class="block text-sm font-medium text-gray-700">Company Name</label>
                      <input
                        id="name"
                        v-model="companyForm.name"
                        type="text"
                        required
                        class="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    
                    <!-- Logo URL -->
                    <div>
                      <label for="logo" class="block text-sm font-medium text-gray-700">Logo URL</label>
                      <input
                        id="logo"
                        v-model="companyForm.logo"
                        type="url"
                        required
                        class="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        placeholder="https://example.com/logo.png"
                      />
                      <p class="mt-1 text-xs text-gray-500">Enter a valid URL to an image file</p>
                    </div>
                    
                    <!-- Status -->
                    <div>
                      <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
                      <select
                        id="status"
                        v-model="companyForm.status"
                        required
                        class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                    
                    <!-- Preview -->
                    <div class="mt-4">
                      <label class="block text-sm font-medium text-gray-700">Logo Preview</label>
                      <div class="mt-2 flex justify-center p-4 border-2 border-gray-300 border-dashed rounded-md">
                        <div v-if="companyForm.logo" class="flex flex-col items-center">
                          <img 
                            :src="companyForm.logo" 
                            alt="Logo preview" 
                            class="h-24 w-auto object-contain"
                            onerror="this.src='https://via.placeholder.com/150x150?text=Invalid+URL'; this.onerror=null;"
                          />
                        </div>
                        <div v-else class="text-center">
                          <PhotoIcon class="mx-auto h-12 w-12 text-gray-400" />
                          <p class="mt-1 text-sm text-gray-500">Enter a URL to see a preview</p>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Form Error -->
                    <div v-if="formError" class="bg-red-50 p-4 rounded-md">
                      <div class="flex">
                        <div class="flex-shrink-0">
                          <ExclamationCircleIcon class="h-5 w-5 text-red-400" aria-hidden="true" />
                        </div>
                        <div class="ml-3">
                          <h3 class="text-sm font-medium text-red-800">{{ formError }}</h3>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Form Actions -->
                    <div class="mt-6 flex justify-end space-x-3">
                      <button
                        type="button"
                        @click="closeCompanyModal"
                        class="btn btn-secondary"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        class="btn btn-primary"
                        :disabled="formSubmitting"
                      >
                        <svg v-if="formSubmitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {{ isEditMode ? 'Update' : 'Create' }}
                      </button>
                    </div>
                  </form>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </TransitionRoot>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, inject } from 'vue';
  import { useCompanyStore } from '@/stores/company';
  import { useArticleStore } from '@/stores/article';
  import { 
    PlusIcon, 
    MagnifyingGlassIcon, 
    ExclamationCircleIcon,
    BuildingOfficeIcon,
    PencilIcon,
    PhotoIcon
  } from '@heroicons/vue/24/outline';
  import { 
    Dialog, 
    DialogPanel, 
    DialogTitle, 
    TransitionChild, 
    TransitionRoot 
  } from '@headlessui/vue';
  
  const companyStore = useCompanyStore();
  const articleStore = useArticleStore();
  const showNotification = inject('showNotification');
  
  const loading = ref(true);
  const error = ref(null);
  const filters = ref({
    status: '',
    search: ''
  });
  
  // Company Modal
  const showCompanyModal = ref(false);
  const isEditMode = ref(false);
  const companyForm = ref({
    id: null,
    name: '',
    logo: '',
    status: 'Active'
  });
  const formError = ref('');
  const formSubmitting = ref(false);
  
  // Get companies from store
  const companies = computed(() => companyStore.companies);
  const articles = computed(() => articleStore.articles);
  
  // Filter companies based on criteria
  const filteredCompanies = computed(() => {
    return companies.value.filter(company => {
      // Status filter
      const statusMatch = !filters.value.status || company.status === filters.value.status;
      
      // Search filter (case insensitive search in name)
      const searchTerm = filters.value.search.toLowerCase();
      const searchMatch = !searchTerm || company.name.toLowerCase().includes(searchTerm);
      
      return statusMatch && searchMatch;
    });
  });
  
  // Get number of articles for a company
  const getCompanyArticlesCount = (companyId) => {
    return articles.value.filter(article => article.company?.id === companyId).length;
  };
  
  // Open modal to create a new company
  const openCreateCompanyModal = () => {
    isEditMode.value = false;
    companyForm.value = {
      id: null,
      name: '',
      logo: '',
      status: 'Active'
    };
    formError.value = '';
    showCompanyModal.value = true;
  };
  
  // Open modal to edit an existing company
  const openEditCompanyModal = (company) => {
    isEditMode.value = true;
    companyForm.value = { ...company };
    formError.value = '';
    showCompanyModal.value = true;
  };
  
  // Close company modal
  const closeCompanyModal = () => {
    showCompanyModal.value = false;
  };
  
  // Submit company form (create or update)
  const submitCompanyForm = async () => {
    formSubmitting.value = true;
    formError.value = '';
    
    try {
      // Validate URL
      try {
        new URL(companyForm.value.logo);
      } catch (e) {
        formError.value = 'Please enter a valid URL for the logo';
        formSubmitting.value = false;
        return;
      }
      
      if (isEditMode.value) {
        // Update existing company
        await companyStore.updateCompany(companyForm.value.id, companyForm.value);
        showNotification('Success', 'Company updated successfully', 'success');
        closeCompanyModal();
      } else {
        // Create new company
        await companyStore.createCompany(companyForm.value);
        showNotification('Success', 'Company created successfully', 'success');
        closeCompanyModal();
      }
    } catch (err) {
      formError.value = err.message || 'Failed to save company. Please try again.';
    } finally {
      formSubmitting.value = false;
    }
  };
  
  onMounted(async () => {
    try {
      // Load required data
      const promises = [
        companyStore.fetchCompanies(),
        articleStore.fetchArticles()
      ];
      
      await Promise.all(promises);
    } catch (err) {
      error.value = err.message || 'Failed to load companies';
      showNotification('Error', error.value, 'error');
    } finally {
      loading.value = false;
    }
  });
  </script>