// src/utils/formatters.js
import moment from 'moment';

/**
 * Format a date in a consistent way across the app
 * @param {string|Date} date - The date to format
 * @param {string} format - The format to use (default: 'MMM D, YYYY')
 * @returns {string} Formatted date string
 */
export const formatDate = (date, format = 'MMM D, YYYY') => {
  if (!date) return '';
  return moment(date).format(format);
};

/**
 * Truncate text to a specified length and add ellipsis if needed
 * @param {string} text - The text to truncate
 * @param {number} length - Maximum length (default: 100)
 * @returns {string} Truncated text
 */
export const truncateText = (text, length = 100) => {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};

/**
 * Format a URL to display in a more user-friendly way
 * @param {string} url - The URL to format
 * @returns {string} Formatted URL
 */
export const formatUrl = (url) => {
  if (!url) return '';
  try {
    const urlObj = new URL(url);
    return urlObj.hostname + (urlObj.pathname !== '/' ? urlObj.pathname : '');
  } catch (e) {
    return url;
  }
};

/**
 * Get user initials from first and last name
 * @param {string} firstName - First name
 * @param {string} lastName - Last name
 * @returns {string} User initials
 */
export const getUserInitials = (firstName, lastName) => {
  if (!firstName && !lastName) return '';
  
  const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
  const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
  
  return `${firstInitial}${lastInitial}`;
};

/**
 * Clean HTML content - remove script tags and other potentially dangerous elements
 * @param {string} html - HTML content to clean
 * @returns {string} Cleaned HTML
 */
export const cleanHtml = (html) => {
  if (!html) return '';
  
  // Create a temporary div
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  
  // Remove script tags
  const scripts = tempDiv.querySelectorAll('script');
  scripts.forEach(script => script.remove());
  
  // Remove on* attributes
  const allElements = tempDiv.querySelectorAll('*');
  allElements.forEach(el => {
    Array.from(el.attributes).forEach(attr => {
      if (attr.name.startsWith('on')) {
        el.removeAttribute(attr.name);
      }
    });
  });
  
  return tempDiv.innerHTML;
};