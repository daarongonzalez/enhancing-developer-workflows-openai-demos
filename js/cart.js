// Core cart functionality
// NEW FILE: Main cart class that handles all shopping cart operations
// Integrates with product database and storage system to provide complete cart functionality

class Cart {
  constructor() {
    this.items = []; // Array to store cart items in memory
    this.loadFromStorage(); // Load existing cart data from localStorage on initialization
  }

  // Load cart from localStorage
  // Retrieves saved cart data when the cart is first created
  loadFromStorage() {
    this.items = cartStorage.loadCart();
  }

  // Save cart to localStorage
  // Persists cart data to browser storage for session persistence
  saveToStorage() {
    return cartStorage.saveCart(this.items);
  }

  // Add item to cart
  // Validates product exists, handles quantity updates, and saves to storage
  addItem(productId, quantity = 1) {
    const product = getProductById(productId); // Get product data from database
    if (!product) {
      throw new Error(`Product with ID ${productId} not found`); // Validate product exists
    }

    // Check if item already exists in cart to handle quantity updates
    const existingItem = this.items.find(item => item.id === productId);
    
    if (existingItem) {
      existingItem.quantity += quantity; // Increment existing item quantity
    } else {
      // Add new item to cart with complete product information
      this.items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        description: product.description,
        quantity: quantity
      });
    }

    this.saveToStorage(); // Persist changes to localStorage
    this.updateCartUI(); // Update UI across all pages
    return true;
  }

  // Remove item from cart
  // Completely removes an item from the cart
  removeItem(productId) {
    const index = this.items.findIndex(item => item.id === productId);
    if (index !== -1) {
      this.items.splice(index, 1); // Remove item from array
      this.saveToStorage();
      this.updateCartUI();
      return true;
    }
    return false;
  }

  // Update item quantity
  // Changes quantity of existing item, removes if quantity <= 0
  updateQuantity(productId, quantity) {
    // Validate input parameters
    if (!productId || typeof productId !== 'string') {
      console.error('Invalid productId provided to updateQuantity');
      return false;
    }
    
    // Ensure quantity is a valid number and not negative
    const validQuantity = Math.max(0, parseInt(quantity) || 0);
    
    const item = this.items.find(item => item.id === productId);
    if (item) {
      if (validQuantity <= 0) {
        return this.removeItem(productId); // Remove item if quantity is 0 or negative
      } else {
        // Limit maximum quantity to prevent abuse (e.g., 99 items max)
        const maxQuantity = 99;
        item.quantity = Math.min(validQuantity, maxQuantity);
        this.saveToStorage();
        this.updateCartUI();
        return true;
      }
    }
    return false;
  }

  // Get cart items
  // Returns array of all items currently in cart
  getItems() {
    return this.items;
  }

  // Get cart item count
  // Returns total number of items (sum of all quantities)
  getItemCount() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  // Calculate subtotal
  // Returns sum of all item prices multiplied by their quantities
  getSubtotal() {
    return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  // Calculate shipping cost
  // Free shipping over $50, otherwise $15 standard shipping
  getShippingCost() {
    const subtotal = this.getSubtotal();
    if (subtotal === 0) return 0; // No shipping cost for empty cart
    if (subtotal >= 50) return 0; // Free shipping over $50
    return 15.00; // Standard shipping cost
  }

  // Calculate tax (8.5% example rate)
  // Applies sales tax to subtotal only (not shipping)
  getTax() {
    return this.getSubtotal() * 0.085;
  }

  // Calculate total
  // Sum of subtotal, shipping, and tax
  getTotal() {
    return this.getSubtotal() + this.getShippingCost() + this.getTax();
  }

  // Clear cart
  // Removes all items from cart
  clearCart() {
    this.items = [];
    this.saveToStorage();
    this.updateCartUI();
  }

  // Check if cart is empty
  // Returns true if no items in cart
  isEmpty() {
    return this.items.length === 0;
  }

  // Get item by ID
  // Returns specific item object if found in cart
  getItem(productId) {
    return this.items.find(item => item.id === productId);
  }

  // Update cart UI across all pages
  // Central method to refresh cart display throughout the application
  updateCartUI() {
    // Update cart counter in header (shows on all pages)
    this.updateCartCounter();
    
    // Update cart page if we're currently on it
    if (window.location.pathname === '/cart') {
      this.updateCartPage();
    }
  }

  // Update cart counter in header
  // Shows item count badge on cart icon in navigation
  updateCartCounter() {
    const cartIcon = document.querySelector('.header-icons a[href="/cart"]');
    if (cartIcon) {
      const itemCount = this.getItemCount();
      
      // Remove existing counter if any (prevents duplicate badges)
      const existingCounter = cartIcon.querySelector('.cart-counter');
      if (existingCounter) {
        existingCounter.remove();
      }

      // Add counter if items exist in cart
      if (itemCount > 0) {
        const counter = document.createElement('span');
        counter.className = 'cart-counter';
        counter.textContent = itemCount;
        cartIcon.appendChild(counter);
      }
    }
  }

  // Update cart page content
  // Refreshes the cart page display with current cart data
  updateCartPage() {
    const cartItemsWrapper = document.querySelector('.cart-items-wrapper');
    const subtotalWrapper = document.querySelector('.subtotal-wrapper');
    
    if (!cartItemsWrapper || !subtotalWrapper) return; // Exit if elements don't exist

    // Update cart items display
    this.renderCartItems(cartItemsWrapper);
    
    // Update totals and pricing
    this.renderCartTotals(subtotalWrapper);
  }

  // Render cart items
  // Creates HTML for all items in cart or shows empty cart message
  renderCartItems(container) {
    if (this.isEmpty()) {
      // Show empty cart state with link to continue shopping
      container.innerHTML = '<div class="empty-cart"><p>Your cart is empty</p><a href="/" class="continue-shopping">Continue Shopping</a></div>';
      return;
    }

    // Generate HTML for each cart item with all necessary controls
    container.innerHTML = this.items.map((item, index) => `
      <div class="cart-item" data-product-id="${item.id}">
        <div class="cart-item-image-wrapper">
          <img src="${item.image}" alt="image of ${item.name}" />
        </div>
        <div class="cart-item-details-wrapper">
          <p class="cart-item-number">ITEM # ${String(index + 1).padStart(8, '0')}</p>
          <p class="cart-item-name">${item.name}</p>
          <p class="cart-item-description">${item.description}</p>
          <div class="quantity-selector-wrapper">
            <div class="quantity-selector">
              <button class="quantity-btn minus" data-product-id="${item.id}">-</button>
              <span class="quantity-display">${item.quantity}</span>
              <button class="quantity-btn plus" data-product-id="${item.id}">+</button>
            </div>
            <a href="#" class="delete-item" data-product-id="${item.id}">Delete</a>
          </div>
        </div>
        <div class="cart-item-price-wrapper">
          <p class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</p>
        </div>
      </div>
    `).join('');

    // Add event listeners
    this.addCartItemEventListeners();
  }

  // Render cart totals
  // Updates the pricing breakdown section with current cart calculations
  renderCartTotals(container) {
    const subtotal = this.getSubtotal();
    const shipping = this.getShippingCost();
    const tax = this.getTax();
    const total = this.getTotal();

    const form = container.querySelector('form');
    if (form) {
      const rows = form.querySelectorAll('.row');
      
      // Update subtotal row
      if (rows[0]) {
        rows[0].innerHTML = `<p>Subtotal</p><p>$${subtotal.toFixed(2)}</p>`;
      }
      
      // Update shipping row (shows "FREE" if shipping cost is 0)
      if (rows[1]) {
        rows[1].innerHTML = `<p>Shipping</p><p>${shipping === 0 ? 'FREE' : '$' + shipping.toFixed(2)}</p>`;
      }
      
      // Update tax row
      if (rows[2]) {
        rows[2].innerHTML = `<p>Sales Tax</p><p>$${tax.toFixed(2)}</p>`;
      }
      
      // Update total row (row 4, skipping the divider row)
      if (rows[4]) {
        rows[4].innerHTML = `<p>Estimated Total</p><p>$${total.toFixed(2)}</p>`;
      }
    }
  }

  // Add event listeners to cart items
  // Sets up interactive functionality for quantity controls and delete buttons
  addCartItemEventListeners() {
    // Quantity adjustment buttons (+ and -)
    document.querySelectorAll('.quantity-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const productId = btn.dataset.productId;
        const currentQuantity = this.getItem(productId).quantity;
        
        if (btn.classList.contains('plus')) {
          this.updateQuantity(productId, currentQuantity + 1); // Increase quantity
        } else if (btn.classList.contains('minus')) {
          this.updateQuantity(productId, currentQuantity - 1); // Decrease quantity
        }
      });
    });

    // Delete item buttons
    document.querySelectorAll('.delete-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const productId = btn.dataset.productId;
        this.removeItem(productId); // Remove item completely from cart
      });
    });
  }

  // Show success notification
  // Displays a temporary success message when items are added to cart
  showAddToCartNotification(productName) {
    // Create notification element with success styling
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
      <div class="notification-content">
        <span>✓ ${productName} added to cart!</span>
        <button class="notification-close">&times;</button>
      </div>
    `;

    // Add notification to page
    document.body.appendChild(notification);

    // Auto-remove notification after 3 seconds for better UX
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 3000);

    // Allow manual close with the X button
    notification.querySelector('.notification-close').addEventListener('click', () => {
      notification.remove();
    });
  }
}

// Create global cart instance
// Singleton pattern ensures consistent cart state across the entire application
const cart = new Cart();

// Initialize cart UI when DOM is loaded
// Ensures cart counter and other UI elements are properly displayed on page load
document.addEventListener('DOMContentLoaded', () => {
  cart.updateCartUI();
});

// Export for use in other modules
// Enables cart functionality to be used in Node.js environments if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Cart, cart };
} 