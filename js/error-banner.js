// Error banner functionality
function showProductNotFound() {
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
    
    errorBanner.style.display = 'block';
    
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