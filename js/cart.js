/**
 * Shopping Cart Implementation
 * This module handles all cart-related functionality including:
 * - Adding/removing items
 * - Managing quantities
 * - Calculating totals
 * - Persisting cart data in session storage
 * - Displaying cart items and totals
 */

const cart = {
    /**
     * Initialize the cart
     * Creates empty cart in session storage if none exists
     * Updates cart count and displays items if on cart page
     */
    init() {
        const savedCart = sessionStorage.getItem('cart');
        if (!savedCart) {
            sessionStorage.setItem('cart', JSON.stringify([]));
        }
        this.updateCartCount();
        
        // If we're on the cart page, display the cart items
        if (document.querySelector('.cart-items-wrapper')) {
            this.displayCartItems();
            this.updateCartTotals();
        }
    },

    /**
     * Add an item to the cart
     * @param {Object} product - The product to add
     * @param {string} product.id - Product identifier
     * @param {string} product.name - Product name
     * @param {number} product.price - Product price
     */
    addItem(product) {
        const cart = JSON.parse(sessionStorage.getItem('cart'));
        const existingItem = cart.find(item => item.id === product.id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1
            });
        }

        sessionStorage.setItem('cart', JSON.stringify(cart));
        this.updateCartCount();
    },

    /**
     * Remove an item from the cart
     * @param {string} productId - ID of the product to remove
     */
    removeItem(productId) {
        const cart = JSON.parse(sessionStorage.getItem('cart'));
        const updatedCart = cart.filter(item => item.id !== productId);
        sessionStorage.setItem('cart', JSON.stringify(updatedCart));
        this.updateCartCount();
        if (document.querySelector('.cart-items-wrapper')) {
            this.displayCartItems();
            this.updateCartTotals();
        }
    },

    /**
     * Update the quantity of an item in the cart
     * @param {string} productId - ID of the product to update
     * @param {number} quantity - New quantity
     */
    updateQuantity(productId, quantity) {
        const cart = JSON.parse(sessionStorage.getItem('cart'));
        const item = cart.find(item => item.id === productId);
        if (item) {
            item.quantity = quantity;
            sessionStorage.setItem('cart', JSON.stringify(cart));
            this.updateCartCount();
            if (document.querySelector('.cart-items-wrapper')) {
                this.updateCartTotals();
            }
        }
    },

    /**
     * Calculate the total price of all items in the cart
     * @returns {number} Total price
     */
    getTotal() {
        const cart = JSON.parse(sessionStorage.getItem('cart'));
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    },

    /**
     * Update the cart count badge in the header
     */
    updateCartCount() {
        const cart = JSON.parse(sessionStorage.getItem('cart'));
        const count = cart.reduce((total, item) => total + item.quantity, 0);
        const cartCountElement = document.querySelector('.cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = count;
            cartCountElement.style.display = count > 0 ? 'block' : 'none';
        }
    },

    /**
     * Show a notification when an item is added to cart
     * @param {string} message - Message to display
     */
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        // Remove notification after 2 seconds
        setTimeout(() => {
            notification.remove();
        }, 2000);
    },

    /**
     * Display all cart items on the cart page
     * Creates HTML for each item including:
     * - Product image
     * - Product details
     * - Quantity controls
     * - Delete button
     */
    displayCartItems() {
        const cartItemsWrapper = document.querySelector('.cart-items-wrapper');
        const cart = JSON.parse(sessionStorage.getItem('cart'));
        
        if (cart.length === 0) {
            cartItemsWrapper.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
            return;
        }

        cartItemsWrapper.innerHTML = cart.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-image-wrapper">
                    <img src="./img/${item.id}.png" alt="image of ${item.name}" />
                </div>
                <div class="cart-item-details-wrapper">
                    <p class="cart-item-number">ITEM # ${item.id}</p>
                    <p class="cart-item-name">${item.name}</p>
                    <p class="cart-item-description">Our famous homemade ${item.name.toLowerCase()}</p>
                    <div class="quantity-selector-wrapper">
                        <div class="quantity-selector">
                            <button class="decrease-quantity">-</button>
                            <span>${item.quantity}</span>
                            <button class="increase-quantity">+</button>
                        </div>
                        <a href="#" class="delete-item">Delete</a>
                    </div>
                </div>
                <div class="cart-item-price-wrapper">
                    <p class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</p>
                </div>
            </div>
        `).join('');

        // Add event listeners for quantity controls and delete buttons
        this.addCartItemEventListeners();
    },

    /**
     * Add event listeners to cart item controls
     * Handles:
     * - Quantity increase/decrease
     * - Item deletion
     */
    addCartItemEventListeners() {
        const cartItems = document.querySelectorAll('.cart-item');
        
        cartItems.forEach(item => {
            const id = item.dataset.id;
            
            // Quantity decrease button
            item.querySelector('.decrease-quantity').addEventListener('click', () => {
                const quantityElement = item.querySelector('.quantity-selector span');
                const currentQuantity = parseInt(quantityElement.textContent);
                if (currentQuantity > 1) {
                    this.updateQuantity(id, currentQuantity - 1);
                    quantityElement.textContent = currentQuantity - 1;
                }
            });

            // Quantity increase button
            item.querySelector('.increase-quantity').addEventListener('click', () => {
                const quantityElement = item.querySelector('.quantity-selector span');
                const currentQuantity = parseInt(quantityElement.textContent);
                this.updateQuantity(id, currentQuantity + 1);
                quantityElement.textContent = currentQuantity + 1;
            });

            // Delete button
            item.querySelector('.delete-item').addEventListener('click', (e) => {
                e.preventDefault();
                this.removeItem(id);
            });
        });
    },

    /**
     * Update all cart totals
     * Calculates and displays:
     * - Subtotal
     * - Shipping ($15.00 if cart has items)
     * - Tax (8% of subtotal)
     * - Total
     */
    updateCartTotals() {
        const subtotal = this.getTotal();
        const shipping = subtotal > 0 ? 15.00 : 0;
        const tax = subtotal * 0.08; // 8% tax rate
        const total = subtotal + shipping + tax;

        document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('shipping').textContent = `$${shipping.toFixed(2)}`;
        document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
        document.getElementById('total').textContent = `$${total.toFixed(2)}`;
    }
};

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    cart.init();
    
    // Add click handlers to all "Add to cart" buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart a');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const pieItem = button.closest('.pie-item');
            const product = {
                id: pieItem.dataset.id,
                name: pieItem.querySelector('h4').textContent,
                price: parseFloat(pieItem.querySelector('.pie-info p').textContent.replace('$', ''))
            };
            cart.addItem(product);
        });
    });

    // Add checkout button handler if on cart page
    const checkoutButton = document.getElementById('submit');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = './shipping.html';
        });
    }
}); 