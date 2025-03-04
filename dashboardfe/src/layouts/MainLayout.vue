<template>
    <div class="min-h-screen bg-gray-50">
      <!-- Navigation Bar -->
      <Disclosure as="nav" class="bg-white shadow-sm" v-slot="{ open }">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="flex h-16 justify-between">
            <div class="flex">
              <!-- Logo -->
              <div class="flex flex-shrink-0 items-center">
                <router-link to="/" class="text-xl font-bold text-primary-600">
                  Archintel
                </router-link>
              </div>
              
              <!-- Navigation Links -->
              <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
                <!-- Writer Navigation -->
                <template v-if="authStore.isWriter">
                  <router-link 
                    to="/writer/dashboard" 
                    class="inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium" 
                    :class="[isActive('WriterDashboard') ? 'border-primary-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700']"
                  >
                    Dashboard
                  </router-link>
                  
                  <router-link 
                    to="/writer/media" 
                    class="inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium" 
                    :class="[isActive('WriterMedia') ? 'border-primary-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700']"
                  >
                    All Media
                  </router-link>
                  
                  <router-link 
                    to="/articles/create" 
                    class="inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium" 
                    :class="[isActive('CreateArticle') ? 'border-primary-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700']"
                  >
                    Create Article
                  </router-link>
                </template>
                
                <!-- Editor Navigation -->
                <template v-else-if="authStore.isEditor">
                  <router-link 
                    to="/editor/dashboard" 
                    class="inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium" 
                    :class="[isActive('EditorDashboard') ? 'border-primary-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700']"
                  >
                    Dashboard
                  </router-link>
                  
                  <router-link 
                    to="/editor/media" 
                    class="inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium" 
                    :class="[isActive('EditorMedia') ? 'border-primary-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700']"
                  >
                    All Media
                  </router-link>
                  
                  <router-link 
                    to="/editor/users" 
                    class="inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium" 
                    :class="[isActive('UserManagement') ? 'border-primary-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700']"
                  >
                    Users
                  </router-link>
                  
                  <router-link 
                    to="/editor/companies" 
                    class="inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium" 
                    :class="[isActive('CompanyManagement') ? 'border-primary-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700']"
                  >
                    Companies
                  </router-link>
                </template>
              </div>
            </div>
            
            <!-- User Profile Dropdown -->
            <div class="hidden sm:ml-6 sm:flex sm:items-center">
              <Menu as="div" class="relative ml-3">
                <div>
                  <MenuButton class="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                    <span class="sr-only">Open user menu</span>
                    <div class="flex items-center">
                      <div class="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-white">
                        {{ userInitials }}
                      </div>
                      <span class="ml-2 text-sm text-gray-700">{{ authStore.user?.firstname }}</span>
                      <ChevronDownIcon class="ml-1 h-4 w-4 text-gray-500" aria-hidden="true" />
                    </div>
                  </MenuButton>
                </div>
                <transition
                  enter-active-class="transition ease-out duration-100"
                  enter-from-class="transform opacity-0 scale-95"
                  enter-to-class="transform opacity-100 scale-100"
                  leave-active-class="transition ease-in duration-75"
                  leave-from-class="transform opacity-100 scale-100"
                  leave-to-class="transform opacity-0 scale-95"
                >
                  <MenuItems class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <MenuItem v-slot="{ active }">
                      <div class="px-4 py-2 text-sm text-gray-700 border-b">
                        <div class="font-medium">{{ authStore.user?.firstname }} {{ authStore.user?.lastname }}</div>
                        <div class="text-xs text-gray-500">{{ authStore.user?.type }}</div>
                      </div>
                    </MenuItem>
                    <MenuItem v-slot="{ active }">
                      <a
                        href="#"
                        @click.prevent="authStore.logout"
                        :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700']"
                      >
                        Sign out
                      </a>
                    </MenuItem>
                  </MenuItems>
                </transition>
              </Menu>
            </div>
            
            <!-- Mobile menu button -->
            <div class="-mr-2 flex items-center sm:hidden">
              <DisclosureButton class="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500">
                <span class="sr-only">Open main menu</span>
                <Bars3Icon v-if="!open" class="block h-6 w-6" aria-hidden="true" />
                <XMarkIcon v-else class="block h-6 w-6" aria-hidden="true" />
              </DisclosureButton>
            </div>
          </div>
        </div>
  
        <!-- Mobile menu -->
        <DisclosurePanel class="sm:hidden">
          <div class="space-y-1 pt-2 pb-3">
            <!-- Writer Navigation - Mobile -->
            <template v-if="authStore.isWriter">
              <DisclosureButton
                as="div"
                @click="$router.push('/writer/dashboard')"
                :class="[
                  isActive('WriterDashboard')
                    ? 'bg-primary-50 border-primary-500 text-primary-700'
                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800',
                  'block pl-3 pr-4 py-2 border-l-4 text-base font-medium cursor-pointer'
                ]"
              >
                Dashboard
              </DisclosureButton>
              
              <DisclosureButton
                as="div"
                @click="$router.push('/writer/media')"
                :class="[
                  isActive('WriterMedia')
                    ? 'bg-primary-50 border-primary-500 text-primary-700'
                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800',
                  'block pl-3 pr-4 py-2 border-l-4 text-base font-medium cursor-pointer'
                ]"
              >
                All Media
              </DisclosureButton>
              
              <DisclosureButton
                as="div"
                @click="$router.push('/articles/create')"
                :class="[
                  isActive('CreateArticle')
                    ? 'bg-primary-50 border-primary-500 text-primary-700'
                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800',
                  'block pl-3 pr-4 py-2 border-l-4 text-base font-medium cursor-pointer'
                ]"
              >
                Create Article
              </DisclosureButton>
            </template>
            
            <!-- Editor Navigation - Mobile -->
            <template v-else-if="authStore.isEditor">
              <DisclosureButton
                as="div"
                @click="$router.push('/editor/dashboard')"
                :class="[
                  isActive('EditorDashboard')
                    ? 'bg-primary-50 border-primary-500 text-primary-700'
                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800',
                  'block pl-3 pr-4 py-2 border-l-4 text-base font-medium cursor-pointer'
                ]"
              >
                Dashboard
              </DisclosureButton>
              
              <DisclosureButton
                as="div"
                @click="$router.push('/editor/media')"
                :class="[
                  isActive('EditorMedia')
                    ? 'bg-primary-50 border-primary-500 text-primary-700'
                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800',
                  'block pl-3 pr-4 py-2 border-l-4 text-base font-medium cursor-pointer'
                ]"
              >
                All Media
              </DisclosureButton>
              
              <DisclosureButton
                as="div"
                @click="$router.push('/editor/users')"
                :class="[
                  isActive('UserManagement')
                    ? 'bg-primary-50 border-primary-500 text-primary-700'
                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800',
                  'block pl-3 pr-4 py-2 border-l-4 text-base font-medium cursor-pointer'
                ]"
              >
                Users
              </DisclosureButton>
              
              <DisclosureButton
                as="div"
                @click="$router.push('/editor/companies')"
                :class="[
                  isActive('CompanyManagement')
                    ? 'bg-primary-50 border-primary-500 text-primary-700'
                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800',
                  'block pl-3 pr-4 py-2 border-l-4 text-base font-medium cursor-pointer'
                ]"
              >
                Companies
              </DisclosureButton>
            </template>
          </div>
          
          <!-- Mobile profile section -->
          <div class="border-t border-gray-200 pt-4 pb-3">
            <div class="flex items-center px-4">
              <div class="h-10 w-10 rounded-full bg-primary-500 flex items-center justify-center text-white">
                {{ userInitials }}
              </div>
              <div class="ml-3">
                <div class="text-base font-medium text-gray-800">{{ authStore.user?.firstname }} {{ authStore.user?.lastname }}</div>
                <div class="text-sm font-medium text-gray-500">{{ authStore.user?.type }}</div>
              </div>
            </div>
            <div class="mt-3 space-y-1">
              <DisclosureButton
                as="a"
                href="#"
                @click.prevent="authStore.logout"
                class="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
              >
                Sign out
              </DisclosureButton>
            </div>
          </div>
        </DisclosurePanel>
      </Disclosure>
  
      <!-- Page Content -->
      <main class="py-8">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <router-view />
        </div>
      </main>
      
      <!-- Toast notifications -->
      <div class="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start z-50">
        <div class="w-full flex flex-col items-center space-y-4 sm:items-end">
          <transition
            enter-active-class="transform ease-out duration-300 transition"
            enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
            enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
            leave-active-class="transition ease-in duration-100"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
          >
            <div
              v-if="showToast"
              class="max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden"
            >
              <div class="p-4">
                <div class="flex items-start">
                  <div class="flex-shrink-0">
                    <CheckCircleIcon v-if="toastType === 'success'" class="h-6 w-6 text-green-400" aria-hidden="true" />
                    <ExclamationCircleIcon v-else-if="toastType === 'error'" class="h-6 w-6 text-red-400" aria-hidden="true" />
                    <InformationCircleIcon v-else class="h-6 w-6 text-blue-400" aria-hidden="true" />
                  </div>
                  <div class="ml-3 w-0 flex-1 pt-0.5">
                    <p class="text-sm font-medium text-gray-900">{{ toastTitle }}</p>
                    <p class="mt-1 text-sm text-gray-500">{{ toastMessage }}</p>
                  </div>
                  <div class="ml-4 flex-shrink-0 flex">
                    <button
                      type="button"
                      @click="hideToast"
                      class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      <span class="sr-only">Close</span>
                      <XMarkIcon class="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, provide } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAuthStore } from '@/stores/auth';
  import { 
    Disclosure, 
    DisclosureButton, 
    DisclosurePanel, 
    Menu, 
    MenuButton, 
    MenuItem, 
    MenuItems 
  } from '@headlessui/vue';
  import { 
    Bars3Icon, 
    XMarkIcon, 
    ChevronDownIcon,
    CheckCircleIcon,
    ExclamationCircleIcon,
    InformationCircleIcon
  } from '@heroicons/vue/24/outline';
  
  const router = useRouter();
  const authStore = useAuthStore();
  
  // Toast notification system
  const showToast = ref(false);
  const toastTitle = ref('');
  const toastMessage = ref('');
  const toastType = ref('info'); // 'info', 'success', 'error'
  const toastTimeout = ref(null);
  
  const showNotification = (title, message, type = 'info', duration = 5000) => {
    // Clear any existing timeout
    if (toastTimeout.value) {
      clearTimeout(toastTimeout.value);
    }
    
    // Set toast content
    toastTitle.value = title;
    toastMessage.value = message;
    toastType.value = type;
    showToast.value = true;
    
    // Auto-hide after duration
    toastTimeout.value = setTimeout(() => {
      hideToast();
    }, duration);
  };
  
  const hideToast = () => {
    showToast.value = false;
    if (toastTimeout.value) {
      clearTimeout(toastTimeout.value);
      toastTimeout.value = null;
    }
  };
  
  // Provide toast notification functions to child components
  provide('showNotification', showNotification);
  
  // Helper to check active route
  const isActive = (routeName) => {
    return router.currentRoute.value.name === routeName;
  };
  
  // Compute user initials for avatar
  const userInitials = computed(() => {
    if (!authStore.user) return '';
    return `${authStore.user.firstname.charAt(0)}${authStore.user.lastname.charAt(0)}`;
  });
  </script>