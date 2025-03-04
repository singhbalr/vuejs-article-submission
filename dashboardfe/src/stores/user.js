import { defineStore } from 'pinia';
import axios from 'axios';

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [],
    currentUser: null,
    loading: false,
    error: null
  }),
  
  actions: {
    async fetchUsers() {
      this.loading = true;
      
      try {
        const response = await axios.get('/api/users');
        this.users = response.data.data;
        return this.users;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch users';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async fetchUserById(id) {
      this.loading = true;
      
      try {
        const response = await axios.get(`/api/users/${id}`);
        this.currentUser = response.data.data;
        return this.currentUser;
      } catch (error) {
        this.error = error.response?.data?.message || `Failed to fetch user with ID: ${id}`;
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async createUser(userData) {
      this.loading = true;
      
      try {
        const response = await axios.post('/api/users', userData);
        this.users.push(response.data.data);
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to create user';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async updateUser(id, userData) {
      this.loading = true;
      
      try {
        const response = await axios.put(`/api/users/${id}`, userData);
        
        // Update user in list
        const index = this.users.findIndex(user => user.id === id);
        if (index !== -1) {
          this.users[index] = response.data.data;
        }
        
        this.currentUser = response.data.data;
        return this.currentUser;
      } catch (error) {
        this.error = error.response?.data?.message || `Failed to update user with ID: ${id}`;
        throw error;
      } finally {
        this.loading = false;
      }
    }
  }
});