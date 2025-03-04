import { defineStore } from 'pinia';
import axios from 'axios';

export const useCompanyStore = defineStore('company', {
  state: () => ({
    companies: [],
    currentCompany: null,
    loading: false,
    error: null
  }),
  
  actions: {
    async fetchCompanies() {
      this.loading = true;
      
      try {
        const response = await axios.get('/api/companies');
        this.companies = response.data.data;
        return this.companies;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch companies';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async fetchCompanyById(id) {
      this.loading = true;
      
      try {
        const response = await axios.get(`/api/companies/${id}`);
        this.currentCompany = response.data.data;
        return this.currentCompany;
      } catch (error) {
        this.error = error.response?.data?.message || `Failed to fetch company with ID: ${id}`;
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async createCompany(companyData) {
      this.loading = true;
      
      try {
        const response = await axios.post('/api/companies', companyData);
        this.companies.push(response.data.data);
        return response.data.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to create company';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async updateCompany(id, companyData) {
      this.loading = true;
      
      try {
        const response = await axios.put(`/api/companies/${id}`, companyData);
        
        // Update company in list
        const index = this.companies.findIndex(company => company.id === id);
        if (index !== -1) {
          this.companies[index] = response.data.data;
        }
        
        this.currentCompany = response.data.data;
        return this.currentCompany;
      } catch (error) {
        this.error = error.response?.data?.message || `Failed to update company with ID: ${id}`;
        throw error;
      } finally {
        this.loading = false;
      }
    }
  }
});