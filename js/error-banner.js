// Error banner functionality
function showProductNotFound() {
    // Create error banner if it doesn't exist
    let errorBanner = document.getElementById('error-banner');
    if (!errorBanner) {
        errorBanner = document.createElement('div');
        errorBanner.id = 'error-banner';
        errorBanner.className = 'error-banner';
        errorBanner.innerHTML = `
            <div class="error-content">
                <span class="error-message">⚠️ Product not available. Please try again later.</span>
                <button class="error-close" onclick="hideErrorBanner()">×</button>
            </div>
        `;
        document.body.appendChild(errorBanner);
    }
    
    // Show the banner
    errorBanner.style.display = 'block';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        hideErrorBanner();
    }, 5000);
}

function hideErrorBanner() {
    const errorBanner = document.getElementById('error-banner');
    if (errorBanner) {
        errorBanner.style.display = 'none';
    }
}

// Add click event listeners to all "Add to Cart" buttons
document.addEventListener('DOMContentLoaded', function() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart a');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            showProductNotFound();
        });
    });
}); 