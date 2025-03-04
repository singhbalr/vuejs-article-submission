import { defineStore } from 'pinia';
import router from '@/router';
import api from '@/api/axios'; // Import the custom axios instance

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user')) || null,
    loading: false,
    error: null
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.token,
    isEditor: (state) => state.user?.type === 'Editor',
    isWriter: (state) => state.user?.type === 'Writer',
  },
  
  actions: {
    async login(credentials) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await api.post('/api/auth/login', credentials);
        
        const { token, user } = response.data;
        
        // Save to store
        this.token = token;
        this.user = user;
        
        // Save to localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Set default auth header
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Return true but don't redirect yet
        return true;
      } catch (error) {
        console.error('Login error:', error);
        this.error = error.response?.data?.message || 'Failed to login. Please try again.';
        return false;
      } finally {
        this.loading = false;
      }
    },
    
    logout() {
      // Clear store
      this.token = null;
      this.user = null;
      
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Clear axios default header
      delete api.defaults.headers.common['Authorization'];
      
      // Redirect to login
      router.push({ name: 'Login' });
    },
    
    async getCurrentUser() {
      if (!this.token) return null;
      
      try {
        const response = await api.get('/api/auth/me');
        this.user = response.data.data;
        return this.user;
      } catch (error) {
        console.error('Get current user error:', error);
        // If token is invalid, logout
        if (error.response?.status === 401) {
          this.logout();
        }
        return null;
      }
    }
  }
});