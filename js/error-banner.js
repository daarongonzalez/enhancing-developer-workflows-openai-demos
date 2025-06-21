// Error banner functionality
// BUG FIX: Removed problematic event listener that was incorrectly targeting '.add-to-cart a' elements
// This was causing the error banner to show for all "Add to Cart" button clicks, even when products were successfully added

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

// REMOVED: Problematic event listener that was causing the bug
// This code was incorrectly targeting '.add-to-cart a' elements instead of the actual "Add to Cart" buttons
// The error banner was showing for all cart interactions, even successful ones
// 
// document.addEventListener('DOMContentLoaded', function() {
//     const addToCartButtons = document.querySelectorAll('.add-to-cart a');
//     addToCartButtons.forEach(button => {
//         button.addEventListener('click', function(e) {
//             e.preventDefault();
//             showProductNotFound();
//         });
//     });
// });

// NOTE: Error banner functions remain available for future use when explicitly needed
// They can be called from other parts of the application when appropriate 