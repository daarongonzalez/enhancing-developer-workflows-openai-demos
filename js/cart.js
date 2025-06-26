// Core cart functionality
class Cart {
  constructor() {
    this.items = []; // Cart items array
    this.loadFromStorage(); // Load existing cart data
  }

  // Load cart from localStorage
  loadFromStorage() {
    this.items = cartStorage.loadCart();
  }

  // Save cart to localStorage
  saveToStorage() {
    return cartStorage.saveCart(this.items);
  }

  // Add item to cart
  addItem(productId, quantity = 1) {
    const product = getProductById(productId);
    if (!product) {
      throw new Error(`Product with ID ${productId} not found`);
    }

    const existingItem = this.items.find(item => item.id === productId);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        description: product.description,
        quantity: quantity
      });
    }

    this.saveToStorage();
    this.updateCartUI();
    return true;
  }

  // Remove item from cart
  removeItem(productId) {
    const index = this.items.findIndex(item => item.id === productId);
    if (index !== -1) {
      this.items.splice(index, 1);
      this.saveToStorage();
      this.updateCartUI();
      return true;
    }
    return false;
  }

  // Update item quantity
  updateQuantity(productId, quantity) {
    if (!productId || typeof productId !== 'string') {
      console.error('Invalid productId provided to updateQuantity');
      return false;
    }
    
    const validQuantity = Math.max(0, parseInt(quantity) || 0);
    
    const item = this.items.find(item => item.id === productId);
    if (item) {
      if (validQuantity <= 0) {
        return this.removeItem(productId);
      } else {
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
  getItems() {
    return this.items;
  }

  // Get cart item count
  getItemCount() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  // Calculate subtotal
  getSubtotal() {
    return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  // Calculate shipping cost
  getShippingCost() {
    const subtotal = this.getSubtotal();
    if (subtotal === 0) return 0;
    if (subtotal >= 50) return 0; // Free shipping over $50
    return 15.00;
  }

  // Calculate tax (8.5%)
  getTax() {
    return this.getSubtotal() * 0.085;
  }

  // Calculate total
  getTotal() {
    return this.getSubtotal() + this.getShippingCost() + this.getTax();
  }

  // Clear cart
  clearCart() {
    this.items = [];
    this.saveToStorage();
    this.updateCartUI();
  }

  // Check if cart is empty
  isEmpty() {
    return this.items.length === 0;
  }

  // Get item by ID
  getItem(productId) {
    return this.items.find(item => item.id === productId);
  }

  // Update cart UI across all pages
  updateCartUI() {
    this.updateCartCounter();
    
    if (window.location.pathname === '/cart') {
      this.updateCartPage();
    }
  }

  // Update cart counter in header
  updateCartCounter() {
    const cartIcon = document.querySelector('.header-icons a[href="/cart"]');
    if (cartIcon) {
      const itemCount = this.getItemCount();
      
      const existingCounter = cartIcon.querySelector('.cart-counter');
      if (existingCounter) {
        existingCounter.remove();
      }

      if (itemCount > 0) {
        const counter = document.createElement('span');
        counter.className = 'cart-counter';
        counter.textContent = itemCount;
        cartIcon.appendChild(counter);
      }
    }
  }

  // Update cart page content
  updateCartPage() {
    const cartItemsWrapper = document.querySelector('.cart-items-wrapper');
    const subtotalWrapper = document.querySelector('.subtotal-wrapper');
    
    if (!cartItemsWrapper || !subtotalWrapper) return;

    this.renderCartItems(cartItemsWrapper);
    this.renderCartTotals(subtotalWrapper);
  }

  // Render cart items
  renderCartItems(container) {
    if (this.isEmpty()) {
      container.innerHTML = '<div class="empty-cart"><p>Your cart is empty</p><a href="/" class="continue-shopping">Continue Shopping</a></div>';
      return;
    }

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

    this.addCartItemEventListeners();
  }

  // Render cart totals
  renderCartTotals(container) {
    const subtotal = this.getSubtotal();
    const shipping = this.getShippingCost();
    const tax = this.getTax();
    const total = this.getTotal();

    const subtotalElement = container.querySelector('.row:nth-child(1) p:last-child');
    const shippingElement = container.querySelector('.row:nth-child(2) p:last-child');
    const taxElement = container.querySelector('.row:nth-child(3) p:last-child');
    const totalElement = container.querySelector('.row:nth-child(5) p:last-child');

    if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    if (shippingElement) shippingElement.textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
    if (taxElement) taxElement.textContent = `$${tax.toFixed(2)}`;
    if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;
  }

  // Add event listeners to cart items
  addCartItemEventListeners() {
    // Quantity buttons
    document.querySelectorAll('.quantity-btn').forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const productId = button.dataset.productId;
        const currentItem = this.getItem(productId);
        
        if (currentItem) {
          let newQuantity = currentItem.quantity;
          if (button.classList.contains('plus')) {
            newQuantity += 1;
          } else if (button.classList.contains('minus')) {
            newQuantity -= 1;
          }
          
          this.updateQuantity(productId, newQuantity);
        }
      });
    });

    // Delete buttons
    document.querySelectorAll('.delete-item').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const productId = link.dataset.productId;
        this.removeItem(productId);
      });
    });
  }

  // Show add to cart notification
  showAddToCartNotification(productName) {
    const notification = document.createElement('div');
    notification.className = 'add-to-cart-notification';
    notification.innerHTML = `
      <div class="notification-content">
        <span>✓ ${productName} added to cart</span>
        <button class="notification-close">×</button>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 3000);
    
    // Manual close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
      notification.remove();
    });
  }
}

// Create global cart instance
const cart = new Cart(); 