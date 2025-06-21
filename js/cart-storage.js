// Cart storage management using localStorage
// NEW FILE: Handles persistent storage of cart data across browser sessions
// Uses localStorage for client-side storage with comprehensive error handling

const CART_STORAGE_KEY = 'bethanys-pie-shop-cart'; // Unique key to avoid conflicts with other apps

class CartStorage {
  constructor() {
    this.storageKey = CART_STORAGE_KEY;
  }

  // Save cart to localStorage
  // Converts cart array to JSON string and stores it in browser's localStorage
  saveCart(cart) {
    try {
      // Validate cart data before saving
      if (!Array.isArray(cart)) {
        console.warn('Invalid cart data provided to saveCart');
        return false;
      }
      
      localStorage.setItem(this.storageKey, JSON.stringify(cart));
      return true; // Success indicator for error handling
    } catch (error) {
      // More specific error handling for different scenarios
      if (error.name === 'QuotaExceededError') {
        console.warn('localStorage quota exceeded. Cart data may not be saved.');
        // Could implement fallback to sessionStorage here
      } else if (error.name === 'SecurityError') {
        console.warn('localStorage access denied. Cart data may not be saved.');
      } else {
        console.warn('Error saving cart to localStorage:', error.message);
      }
      return false; // Failure indicator for error handling
    }
  }

  // Load cart from localStorage
  // Retrieves cart data from localStorage and converts it back to JavaScript array
  loadCart() {
    try {
      const cartData = localStorage.getItem(this.storageKey);
      if (!cartData) {
        return []; // Return empty array if no data exists
      }
      
      const parsedCart = JSON.parse(cartData);
      
      // Validate parsed data is an array
      if (!Array.isArray(parsedCart)) {
        console.warn('Invalid cart data found in localStorage, resetting to empty cart');
        this.clearCart(); // Clean up invalid data
        return [];
      }
      
      return parsedCart;
    } catch (error) {
      console.warn('Error loading cart from localStorage:', error.message);
      // Clean up corrupted data
      this.clearCart();
      return []; // Return empty array on error to prevent app crashes
    }
  }

  // Clear cart from localStorage
  // Removes cart data completely from browser storage
  clearCart() {
    try {
      localStorage.removeItem(this.storageKey);
      return true;
    } catch (error) {
      console.warn('Error clearing cart from localStorage:', error.message);
      return false;
    }
  }

  // Check if localStorage is available
  // Tests localStorage functionality to ensure it's supported and working
  // Important for browsers that don't support localStorage or have it disabled
  isStorageAvailable() {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (error) {
      return false;
    }
  }

  // Get storage usage info
  // Provides information about localStorage usage for monitoring and debugging
  getStorageInfo() {
    if (!this.isStorageAvailable()) {
      return { available: false, used: 0, remaining: 0 };
    }

    try {
      const cartData = localStorage.getItem(this.storageKey);
      const used = cartData ? new Blob([cartData]).size : 0; // Calculate actual bytes used
      // Estimate localStorage limit (usually 5-10MB, using conservative 5MB estimate)
      const limit = 5 * 1024 * 1024; // 5MB in bytes
      const remaining = limit - used;

      return {
        available: true,
        used: used,
        remaining: remaining,
        limit: limit
      };
    } catch (error) {
      return { available: false, used: 0, remaining: 0 };
    }
  }
}

// Create singleton instance
// Ensures only one instance of CartStorage exists throughout the application
// Provides consistent access point for cart storage operations
const cartStorage = new CartStorage();

// Export for use in other modules
// Enables this storage system to be used in Node.js environments if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CartStorage, cartStorage };
} 