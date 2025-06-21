// Carousel functionality with error handling
document.addEventListener('DOMContentLoaded', function() {
  const carousel_images = document.querySelectorAll('.carousel-image');
  const carousel_buttons = document.querySelectorAll('.carousel button');
  
  // Check if carousel elements exist
  if (carousel_images.length === 0 || carousel_buttons.length === 0) {
    console.warn('Carousel elements not found');
    return;
  }

  // Initialize carousel positions
  carousel_images.forEach((image, idx) => {
    image.style.transform = `translateX(${idx * 100}%)`;
  });

  const carousel_image_1 = carousel_images[0];
  const carousel_image_2 = carousel_images[1];
  const carousel_image_3 = carousel_images[2];

  // Carousel button event listeners with error handling
  const button1 = document.querySelector('.carousel-button-1');
  const button2 = document.querySelector('.carousel-button-2');
  const button3 = document.querySelector('.carousel-button-3');

  if (button1) {
    button1.addEventListener('click', (event) => {
      if (carousel_image_1 && carousel_image_2 && carousel_image_3) {
        carousel_image_1.style.transform = `translateX(0)`;
        carousel_image_2.style.transform = `translateX(100%)`;
        carousel_image_3.style.transform = `translateX(200%)`;

        carousel_buttons.forEach((button) => {
          button.classList.remove('active-carousel-item');
        });
        event.target.classList.add('active-carousel-item');
      }
    }, false);
  }

  if (button2) {
    button2.addEventListener('click', (event) => {
      if (carousel_image_1 && carousel_image_2 && carousel_image_3) {
        carousel_image_1.style.transform = `translateX(-100%)`;
        carousel_image_2.style.transform = `translateX(0%)`;
        carousel_image_3.style.transform = `translateX(100%)`;

        carousel_buttons.forEach((button) => {
          button.classList.remove('active-carousel-item');
        });
        event.target.classList.add('active-carousel-item');
      }
    }, false);
  }

  if (button3) {
    button3.addEventListener('click', (event) => {
      if (carousel_image_1 && carousel_image_2 && carousel_image_3) {
        carousel_image_1.style.transform = `translateX(-200%)`;
        carousel_image_2.style.transform = `translateX(-100%)`;
        carousel_image_3.style.transform = `translateX(0%)`;

        carousel_buttons.forEach((button) => {
          button.classList.remove('active-carousel-item');
        });
        event.target.classList.add('active-carousel-item');
      }
    }, false);
  }
});
