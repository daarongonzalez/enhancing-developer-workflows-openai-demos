// Product database for Bethany's Pie Shop
// NEW FILE: Created to centralize product management and provide consistent product data across the application
// This replaces hardcoded product information scattered throughout the HTML files

const products = {
  // Pies from homepage - Featured products displayed on the main page
  "classic-apple-pie": {
    id: "classic-apple-pie",
    name: "Classic Apple Pie",
    price: 12.95,
    image: "/img/pie-1.png",
    description: "Our famous homemade apple pie with cinnamon spice",
    category: "fruit-pies" // Used for filtering and organization
  },
  "pumpkin-pie": {
    id: "pumpkin-pie", 
    name: "Pumpkin Pie",
    price: 12.95,
    image: "/img/pie-2.png",
    description: "Traditional pumpkin pie with warm spices",
    category: "seasonal-pies"
  },
  "chocolate-pecan-pie": {
    id: "chocolate-pecan-pie",
    name: "Chocolate Pecan Pie", 
    price: 12.95,
    image: "/img/pie-3.png",
    description: "Rich chocolate pecan pie with caramel notes",
    category: "nut-pies"
  },
  
  // Cheesecakes from shop page - Additional products available in the shop section
  "original-cheesecake": {
    id: "original-cheesecake",
    name: "Original Cheesecake",
    price: 18.95, // Higher price point for premium cheesecakes
    image: "/img/cheesecake-1.png", 
    description: "Our famous homemade cheesecake",
    category: "cheesecakes"
  },
  "strawberry-cheesecake": {
    id: "strawberry-cheesecake",
    name: "Strawberry Cheesecake",
    price: 18.95,
    image: "/img/cheesecake-2.png",
    description: "Creamy cheesecake topped with fresh strawberries",
    category: "cheesecakes"
  },
  "chocolate-cheesecake": {
    id: "chocolate-cheesecake", 
    name: "Chocolate Cheesecake",
    price: 18.95,
    image: "/img/cheesecake-3.png",
    description: "Rich chocolate cheesecake with chocolate ganache",
    category: "cheesecakes"
  },
  "birthday-cheesecake": {
    id: "birthday-cheesecake",
    name: "Birthday Cheesecake", 
    price: 18.95,
    image: "/img/cheesecake-4.png",
    description: "Festive birthday cheesecake with sprinkles",
    category: "cheesecakes"
  },
  "caramel-cheesecake": {
    id: "caramel-cheesecake",
    name: "Caramel Cheesecake",
    price: 18.95,
    image: "/img/cheesecake-5.png",
    description: "Smooth caramel cheesecake with caramel drizzle",
    category: "cheesecakes"
  },
  "pistachio-cheesecake": {
    id: "pistachio-cheesecake",
    name: "Pistachio Cheesecake",
    price: 18.95,
    image: "/img/cheesecake-6.png",
    description: "Delicate pistachio cheesecake with nuts",
    category: "cheesecakes"
  }
};

// Helper functions for product retrieval
// These functions provide a clean API for accessing product data throughout the application

function getProductById(id) {
  // Returns a product object by its ID, or null if not found
  // Used extensively by the cart system to validate products before adding to cart
  return products[id] || null;
}

function getAllProducts() {
  // Returns an array of all product objects
  // Useful for displaying product catalogs or generating product lists
  return Object.values(products);
}

function getProductsByCategory(category) {
  // Returns an array of products filtered by category
  // Enables category-based browsing and filtering functionality
  return Object.values(products).filter(product => product.category === category);
}

// Export for use in other modules
// Enables this product database to be used in Node.js environments if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { products, getProductById, getAllProducts, getProductsByCategory };
} 