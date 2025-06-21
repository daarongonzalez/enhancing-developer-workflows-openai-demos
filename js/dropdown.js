// Dropdown menu functionality with performance optimizations
document.addEventListener('DOMContentLoaded', function() {
  const menu = document.getElementById('hover-menu');
  const shopMenuDiv = document.querySelector('a.shop-dropdown');
  
  // Check if elements exist
  if (!menu || !shopMenuDiv) {
    console.warn('Dropdown menu elements not found');
    return;
  }

  let isMenuVisible = false;
  let mousemoveTimeout;

  // Throttled mousemove handler for better performance
  const handleMouseMove = (event) => {
    if (!isMenuVisible) return;

    // Clear existing timeout
    if (mousemoveTimeout) {
      clearTimeout(mousemoveTimeout);
    }

    // Throttle the mousemove events
    mousemoveTimeout = setTimeout(() => {
      const menuRect = menu.getBoundingClientRect();
      const menuTopPos = menuRect.top + window.scrollY;
      const menuLeftPos = menuRect.left + window.scrollX;
      const menuWidth = menuRect.width;
      const menuHeight = menuRect.height;

      // Add padding on edges for better UX
      const edgePadding = 10;
      const topSpacer = 80; // Account for the Shop link hover area

      const isMouseInMenuArea = 
        event.pageX > menuLeftPos - edgePadding && 
        event.pageY > menuTopPos - topSpacer - edgePadding && 
        event.pageX < menuLeftPos + menuWidth + edgePadding && 
        event.pageY < menuTopPos + menuHeight + edgePadding;

      if (!isMouseInMenuArea) {
        hideMenu();
      }
    }, 16); // ~60fps throttling
  };

  const showMenu = () => {
    menu.style.display = "block";
    isMenuVisible = true;
    document.addEventListener('mousemove', handleMouseMove);
  };

  const hideMenu = () => {
    menu.style.display = "none";
    isMenuVisible = false;
    document.removeEventListener('mousemove', handleMouseMove);
    if (mousemoveTimeout) {
      clearTimeout(mousemoveTimeout);
    }
  };

  // Show menu on shop link hover
  shopMenuDiv.addEventListener('mouseenter', showMenu);

  // Hide menu when leaving the shop link area
  shopMenuDiv.addEventListener('mouseleave', (event) => {
    // Small delay to allow moving to dropdown menu
    setTimeout(() => {
      if (!menu.matches(':hover')) {
        hideMenu();
      }
    }, 100);
  });

  // Hide menu when leaving the dropdown area
  menu.addEventListener('mouseleave', hideMenu);

  // Hide menu on escape key
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isMenuVisible) {
      hideMenu();
    }
  });

  // Hide menu when clicking outside
  document.addEventListener('click', (event) => {
    if (isMenuVisible && !menu.contains(event.target) && !shopMenuDiv.contains(event.target)) {
      hideMenu();
    }
  });
});