// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

// Layout
import MainLayout from '@/layouts/MainLayout.vue';

// Auth pages
import Login from '@/views/auth/Login.vue';

// Writer pages
import WriterDashboard from '@/views/writer/Dashboard.vue';
import WriterMedia from '@/views/writer/AllMedia.vue';

// Editor pages
import EditorDashboard from '@/views/editor/Dashboard.vue';
import EditorMedia from '@/views/editor/AllMedia.vue';
import UserManagement from '@/views/editor/UserManagement.vue';
import CompanyManagement from '@/views/editor/CompanyManagement.vue';

// Shared pages
import ArticleForm from '@/views/articles/ArticleForm.vue';
import ArticleView from '@/views/articles/ArticleView.vue';
import NotFound from '@/views/NotFound.vue';
import Unauthorized from '@/views/Unauthorized.vue';

const routes = [
  {
    path: '/',
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      // Redirects based on user type
      {
        path: '',
        name: 'Home',
        redirect: to => {
          const authStore = useAuthStore();
          if (authStore.user) {
            if (authStore.user.type === 'Writer') {
              return { name: 'WriterDashboard' };
            } else if (authStore.user.type === 'Editor') {
              return { name: 'EditorDashboard' };
            }
          }
          return { name: 'Login' };
        }
      },
      
      // Writer routes
      {
        path: 'writer/dashboard',
        name: 'WriterDashboard',
        component: WriterDashboard,
        meta: { requiresWriter: true }
      },
      {
        path: 'writer/media',
        name: 'WriterMedia',
        component: WriterMedia,
        meta: { requiresWriter: true }
      },
      
      // Editor routes
      {
        path: 'editor/dashboard',
        name: 'EditorDashboard',
        component: EditorDashboard,
        meta: { requiresEditor: true }
      },
      {
        path: 'editor/media',
        name: 'EditorMedia',
        component: EditorMedia,
        meta: { requiresEditor: true }
      },
      {
        path: 'editor/users',
        name: 'UserManagement',
        component: UserManagement,
        meta: { requiresEditor: true }
      },
      {
        path: 'editor/companies',
        name: 'CompanyManagement',
        component: CompanyManagement,
        meta: { requiresEditor: true }
      },
      
      // Shared routes
      {
        path: 'articles/create',
        name: 'CreateArticle',
        component: ArticleForm,
        meta: { title: 'Create Article' }
      },
      {
        path: 'articles/:id/edit',
        name: 'EditArticle',
        component: ArticleForm,
        props: true,
        meta: { title: 'Edit Article' }
      },
      {
        path: 'articles/:id',
        name: 'ViewArticle',
        component: ArticleView,
        props: true
      },
      
      // Error pages
      {
        path: 'unauthorized',
        name: 'Unauthorized',
        component: Unauthorized
      }
    ]
  },
  
  // Auth routes
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { guestOnly: true }
  },
  
  // Catch all route (404)
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  }
});

// Navigation guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isLoggedIn = authStore.isAuthenticated;
  const userType = authStore.user?.type;
  
  // Set page title
  document.title = to.meta.title 
    ? `${to.meta.title} | Archintel Dashboard` 
    : 'Archintel Writer/Editor Dashboard';
  
  // Handle auth protected routes
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isLoggedIn) {
      next({ name: 'Login', query: { redirect: to.fullPath } });
      return;
    }
    
    // Role-based access control
    if (to.matched.some(record => record.meta.requiresEditor) && userType !== 'Editor') {
      next({ name: 'Unauthorized' });
      return;
    }
    
    if (to.matched.some(record => record.meta.requiresWriter) && userType !== 'Writer') {
      next({ name: 'Unauthorized' });
      return;
    }
  }
  
  // Prevent authenticated users from accessing guest-only routes
  if (to.matched.some(record => record.meta.guestOnly) && isLoggedIn) {
    next({ name: 'Home' });
    return;
  }
  
  next();
});

export default router;