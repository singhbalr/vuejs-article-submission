import { defineStore } from 'pinia';
import axios from 'axios';

export const useArticleStore = defineStore('article', {
  state: () => ({
    articles: [],
    currentArticle: null,
    forEditArticles: [],
    publishedArticles: [],
    loading: false,
    error: null
  }),
  
  actions: {
    async fetchArticles(params = {}) {
      this.loading = true;
      
      try {
        const response = await axios.get('/api/articles', { params });
        this.articles = response.data.data;
        
        // Separate articles by status
        this.forEditArticles = this.articles.filter(article => article.status === 'For Edit');
        this.publishedArticles = this.articles.filter(article => article.status === 'Published');
        
        return this.articles;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch articles';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async fetchArticleById(id) {
      this.loading = true;
      
      try {
        const response = await axios.get(`/api/articles/${id}`);
        this.currentArticle = response.data.data;
        return this.currentArticle;
      } catch (error) {
        this.error = error.response?.data?.message || `Failed to fetch article with ID: ${id}`;
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async createArticle(articleData) {
      this.loading = true;
      
      try {
        console.log('Creating article with FormData');
        // Log the formData entries to verify content
        for (const pair of articleData.entries()) {
          console.log(`${pair[0]}: ${typeof pair[1] === 'object' ? 'File object' : pair[1]}`);
        }
        
        const response = await axios.post('/api/articles', articleData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        // Add the new article to the list
        this.articles.unshift(response.data.data);
        this.forEditArticles.unshift(response.data.data);
        
        return response.data.data;
      } catch (error) {
        console.error('Create article error:', error);
        this.error = error.response?.data?.message || 'Failed to create article';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async updateArticle(id, articleData, publish = false) {
      this.loading = true;
      
      try {
        // Use FormData for file upload
        const formData = new FormData();
        
        // Append all article data to FormData
        Object.keys(articleData).forEach(key => {
          // Only append if value is defined and not null
          if (articleData[key] !== null && articleData[key] !== undefined) {
            formData.append(key, articleData[key]);
          }
        });
        
        // Add publish status if editor is publishing
        if (publish) {
          formData.append('status', 'Published');
        }
        
        const response = await axios.put(`/api/articles/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        // Update article in lists
        const updatedArticle = response.data.data;
        
        // Find and update in main articles list
        const index = this.articles.findIndex(article => article.id === updatedArticle.id);
        if (index !== -1) {
          this.articles[index] = updatedArticle;
        }
        
        // Update in status-specific lists
        if (updatedArticle.status === 'Published') {
          // Remove from forEdit if it was there
          this.forEditArticles = this.forEditArticles.filter(article => article.id !== updatedArticle.id);
          
          // Add to published if not already there
          const publishedIndex = this.publishedArticles.findIndex(article => article.id === updatedArticle.id);
          if (publishedIndex === -1) {
            this.publishedArticles.unshift(updatedArticle);
          } else {
            this.publishedArticles[publishedIndex] = updatedArticle;
          }
        } else {
          // Update in forEdit list
          const forEditIndex = this.forEditArticles.findIndex(article => article.id === updatedArticle.id);
          if (forEditIndex !== -1) {
            this.forEditArticles[forEditIndex] = updatedArticle;
          }
        }
        
        this.currentArticle = updatedArticle;
        return updatedArticle;
      } catch (error) {
        this.error = error.response?.data?.message || `Failed to update article with ID: ${id}`;
        throw error;
      } finally {
        this.loading = false;
      }
    }
  }
});