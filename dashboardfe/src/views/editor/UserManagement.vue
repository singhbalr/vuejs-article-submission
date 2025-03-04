<!-- src/views/editor/UserManagement.vue -->
<template>
    <div>
      <header class="flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">User Management</h1>
          <p class="mt-2 text-sm text-gray-700">
            Add and manage writer and editor accounts.
          </p>
        </div>
        <button 
          @click="openCreateUserModal"
          class="btn btn-primary inline-flex items-center"
        >
          <PlusIcon class="h-5 w-5 mr-2" />
          Add User
        </button>
      </header>
  
      <div class="mt-8">
        <!-- Filters -->
        <div class="bg-white shadow overflow-hidden sm:rounded-lg p-4 mb-6">
          <div class="flex flex-col sm:flex-row gap-4">
            <div class="flex-1">
              <label for="type-filter" class="block text-sm font-medium text-gray-700">User Type</label>
              <select
                id="type-filter"
                v-model="filters.type"
                class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              >
                <option value="">All Types</option>
                <option value="Writer">Writers</option>
                <option value="Editor">Editors</option>
              </select>
            </div>
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
                  placeholder="Search by name or email..."
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
        <div v-else-if="filteredUsers.length === 0" class="bg-white shadow rounded-lg p-6 text-center">
          <UserIcon class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900">No users found</h3>
          <p class="mt-1 text-sm text-gray-500">
            {{ filters.search || filters.type || filters.status ? 'Try adjusting your search or filter criteria.' : 'Get started by adding a new user.' }}
          </p>
          <div v-if="!filters.search && !filters.type && !filters.status" class="mt-6">
            <button @click="openCreateUserModal" class="btn btn-primary inline-flex items-center">
              <PlusIcon class="h-5 w-5 mr-2" />
              Add User
            </button>
          </div>
        </div>
        
        <!-- Users Table -->
        <div v-else class="bg-white shadow overflow-hidden sm:rounded-lg">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
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
                <tr v-for="user in filteredUsers" :key="user.id">
                  <!-- Name -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <span class="text-primary-800 font-medium">{{ getUserInitials(user) }}</span>
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">{{ user.firstname }} {{ user.lastname }}</div>
                      </div>
                    </div>
                  </td>
                  
                  <!-- Email -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ user.email }}</div>
                  </td>
                  
                  <!-- Type -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ user.type }}</div>
                  </td>
                  
                  <!-- Status -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span 
                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                      :class="user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                    >
                      {{ user.status }}
                    </span>
                  </td>
                  
                  <!-- Actions -->
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      @click="openEditUserModal(user)"
                      class="text-primary-600 hover:text-primary-900"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <!-- Create/Edit User Modal -->
      <TransitionRoot appear :show="showUserModal" as="template">
        <Dialog as="div" @close="closeUserModal" class="relative z-10">
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
                    {{ isEditMode ? 'Edit User' : 'Create New User' }}
                  </DialogTitle>
                  
                  <form @submit.prevent="submitUserForm" class="mt-4 space-y-4">
                    <!-- First Name -->
                    <div>
                      <label for="firstname" class="block text-sm font-medium text-gray-700">First Name</label>
                      <input
                        id="firstname"
                        v-model="userForm.firstname"
                        type="text"
                        required
                        class="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    
                    <!-- Last Name -->
                    <div>
                      <label for="lastname" class="block text-sm font-medium text-gray-700">Last Name</label>
                      <input
                        id="lastname"
                        v-model="userForm.lastname"
                        type="text"
                        required
                        class="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    
                    <!-- Email -->
                    <div>
                      <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        id="email"
                        v-model="userForm.email"
                        type="email"
                        required
                        :disabled="isEditMode"
                        class="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        :class="{ 'bg-gray-100': isEditMode }"
                      />
                      <p v-if="isEditMode" class="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                    </div>
                    
                    <!-- Type -->
                    <div>
                      <label for="type" class="block text-sm font-medium text-gray-700">User Type</label>
                      <select
                        id="type"
                        v-model="userForm.type"
                        required
                        class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                      >
                        <option value="">Select a type</option>
                        <option value="Writer">Writer</option>
                        <option value="Editor">Editor</option>
                      </select>
                    </div>
                    
                    <!-- Status -->
                    <div>
                      <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
                      <select
                        id="status"
                        v-model="userForm.status"
                        required
                        class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
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
                    
                    <!-- Temporary Password (for new users) -->
                    <div v-if="tempPassword" class="bg-green-50 p-4 rounded-md">
                      <div class="flex">
                        <div class="flex-shrink-0">
                          <CheckCircleIcon class="h-5 w-5 text-green-400" aria-hidden="true" />
                        </div>
                        <div class="ml-3">
                          <h3 class="text-sm font-medium text-green-800">User created successfully!</h3>
                          <p class="mt-1 text-sm text-green-700">
                            Temporary password: <strong>{{ tempPassword }}</strong>
                          </p>
                          <p class="mt-1 text-sm text-green-700">
                            Please share this with the user. They will need it to log in for the first time.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Form Actions -->
                    <div class="mt-6 flex justify-end space-x-3">
                      <button
                        type="button"
                        @click="closeUserModal"
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
  import { useUserStore } from '@/stores/user';
  import { 
    PlusIcon, 
    MagnifyingGlassIcon, 
    ExclamationCircleIcon,
    UserIcon,
    CheckCircleIcon
  } from '@heroicons/vue/24/outline';
  import { 
    Dialog, 
    DialogPanel, 
    DialogTitle, 
    TransitionChild, 
    TransitionRoot 
  } from '@headlessui/vue';
  
  const userStore = useUserStore();
  const showNotification = inject('showNotification');
  
  const loading = ref(true);
  const error = ref(null);
  const filters = ref({
    type: '',
    status: '',
    search: ''
  });
  
  // User Modal
  const showUserModal = ref(false);
  const isEditMode = ref(false);
  const userForm = ref({
    id: null,
    firstname: '',
    lastname: '',
    email: '',
    type: '',
    status: 'Active'
  });
  const formError = ref('');
  const formSubmitting = ref(false);
  const tempPassword = ref('');
  
  // Get users from store
  const users = computed(() => userStore.users);
  
  // Filter users based on criteria
  const filteredUsers = computed(() => {
    return users.value.filter(user => {
      // Type filter
      const typeMatch = !filters.value.type || user.type === filters.value.type;
      
      // Status filter
      const statusMatch = !filters.value.status || user.status === filters.value.status;
      
      // Search filter (case insensitive search in name or email)
      const searchTerm = filters.value.search.toLowerCase();
      const searchMatch = !searchTerm || 
        `${user.firstname} ${user.lastname}`.toLowerCase().includes(searchTerm) || 
        user.email.toLowerCase().includes(searchTerm);
      
      return typeMatch && statusMatch && searchMatch;
    });
  });
  
  // Get user initials for avatar
  const getUserInitials = (user) => {
    return `${user.firstname.charAt(0)}${user.lastname.charAt(0)}`;
  };
  
  // Open modal to create a new user
  const openCreateUserModal = () => {
    isEditMode.value = false;
    userForm.value = {
      id: null,
      firstname: '',
      lastname: '',
      email: '',
      type: '',
      status: 'Active'
    };
    formError.value = '';
    tempPassword.value = '';
    showUserModal.value = true;
  };
  
  // Open modal to edit an existing user
  const openEditUserModal = (user) => {
    isEditMode.value = true;
    userForm.value = { ...user };
    formError.value = '';
    tempPassword.value = '';
    showUserModal.value = true;
  };
  
  // Close user modal
  const closeUserModal = () => {
    showUserModal.value = false;
  };
  
  // Submit user form (create or update)
  const submitUserForm = async () => {
    formSubmitting.value = true;
    formError.value = '';
    
    try {
      if (isEditMode.value) {
        // Update existing user
        await userStore.updateUser(userForm.value.id, userForm.value);
        showNotification('Success', 'User updated successfully', 'success');
        closeUserModal();
      } else {
        // Create new user
        const result = await userStore.createUser(userForm.value);
        tempPassword.value = result.tempPassword;
        showNotification('Success', 'User created successfully', 'success');
        // Don't close modal so the temp password can be seen
      }
    } catch (err) {
      formError.value = err.message || 'Failed to save user. Please try again.';
    } finally {
      formSubmitting.value = false;
    }
  };
  
  onMounted(async () => {
    try {
      await userStore.fetchUsers();
    } catch (err) {
      error.value = err.message || 'Failed to load users';
      showNotification('Error', error.value, 'error');
    } finally {
      loading.value = false;
    }
  });
  </script>