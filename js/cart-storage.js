// Cart storage management using localStorage
const CART_STORAGE_KEY = 'bethanys-pie-shop-cart';

class CartStorage {
  constructor() {
    this.storageKey = CART_STORAGE_KEY;
  }

  // Save cart to localStorage
  saveCart(cart) {
    try {
      if (!Array.isArray(cart)) {
        console.warn('Invalid cart data provided to saveCart');
        return false;
      }
      
      localStorage.setItem(this.storageKey, JSON.stringify(cart));
      return true;
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        console.warn('localStorage quota exceeded. Cart data may not be saved.');
      } else if (error.name === 'SecurityError') {
        console.warn('localStorage access denied. Cart data may not be saved.');
      } else {
        console.warn('Error saving cart to localStorage:', error.message);
      }
      return false;
    }
  }

  // Load cart from localStorage
  loadCart() {
    try {
      const cartData = localStorage.getItem(this.storageKey);
      if (!cartData) {
        return [];
      }
      
      const parsedCart = JSON.parse(cartData);
      
      if (!Array.isArray(parsedCart)) {
        console.warn('Invalid cart data found in localStorage, resetting to empty cart');
        this.clearCart();
        return [];
      }
      
      return parsedCart;
    } catch (error) {
      console.warn('Error loading cart from localStorage:', error.message);
      this.clearCart();
      return [];
    }
  }

  // Clear cart from localStorage
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
  getStorageInfo() {
    if (!this.isStorageAvailable()) {
      return { available: false, used: 0, remaining: 0 };
    }

    try {
      const cartData = localStorage.getItem(this.storageKey);
      const used = cartData ? new Blob([cartData]).size : 0;
      const limit = 5 * 1024 * 1024; // 5MB limit
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
const cartStorage = new CartStorage();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CartStorage, cartStorage };
} 