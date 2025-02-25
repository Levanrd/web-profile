// First, let's modify the HTML structure to support multiple images per project
// This code should be placed in your projects.html file to replace or update the existing project cards

// This function will initialize the carousel functionality for all project cards
function initializeCarousels() {
  const projectCards = document.querySelectorAll(".project-cardB");
  
  projectCards.forEach((card, index) => {
      const imageContainer = card.querySelector(".project-image");
      const images = imageContainer.querySelectorAll("img");
      
      // Only set up carousel if there's more than one image
      if (images.length > 1) {
          // Create navigation buttons
          const prevButton = document.createElement("button");
          prevButton.className = "carousel-nav prev-btn";
          prevButton.innerHTML = '<span class="mdi mdi-chevron-left"></span>';
          
          const nextButton = document.createElement("button");
          nextButton.className = "carousel-nav next-btn";
          nextButton.innerHTML = '<span class="mdi mdi-chevron-right"></span>';
          
          // Create indicators
          const indicators = document.createElement("div");
          indicators.className = "carousel-indicators";
          
          images.forEach((_, imgIndex) => {
              const dot = document.createElement("span");
              dot.className = imgIndex === 0 ? "indicator active" : "indicator";
              dot.dataset.index = imgIndex;
              indicators.appendChild(dot);
              
              // Add click event to indicators
              dot.addEventListener("click", () => {
                  showImage(imageContainer, imgIndex);
                  updateIndicators(indicators, imgIndex);
              });
          });
          
          // Initially hide all images except the first one and set data attributes
          images.forEach((img, imgIndex) => {
              img.style.display = imgIndex === 0 ? "block" : "none";
              img.dataset.index = imgIndex;
          });
          
          // Add event listeners to buttons
          prevButton.addEventListener("click", () => {
              const currentIndex = getCurrentImageIndex(imageContainer, images);
              const newIndex = (currentIndex - 1 + images.length) % images.length;
              showImage(imageContainer, newIndex);
              updateIndicators(indicators, newIndex);
          });
          
          nextButton.addEventListener("click", () => {
              const currentIndex = getCurrentImageIndex(imageContainer, images);
              const newIndex = (currentIndex + 1) % images.length;
              showImage(imageContainer, newIndex);
              updateIndicators(indicators, newIndex);
          });
          
          // Append buttons and indicators to image container
          imageContainer.appendChild(prevButton);
          imageContainer.appendChild(nextButton);
          imageContainer.appendChild(indicators);
      }
  });
}

// Improved function to get current visible image index
function getCurrentImageIndex(container, images) {
  // Loop through all images to find the displayed one
  for (let i = 0; i < images.length; i++) {
    const computedStyle = window.getComputedStyle(images[i]);
    if (computedStyle.display !== 'none') {
      return i;
    }
  }
  return 0; // Default to first image if none found
}

// Helper function to display specific image
function showImage(container, index) {
  const images = container.querySelectorAll("img");
  images.forEach((img, imgIndex) => {
      img.style.display = imgIndex === index ? "block" : "none";
  });
}

// Helper function to update indicator states
function updateIndicators(indicatorsContainer, activeIndex) {
  const indicators = indicatorsContainer.querySelectorAll(".indicator");
  indicators.forEach((indicator, index) => {
      if (index === activeIndex) {
          indicator.classList.add("active");
      } else {
          indicator.classList.remove("active");
      }
  });
}

// Add automatic slide functionality
function startAutoSlide(container, interval = 3000) {
  const images = container.querySelectorAll("img");
  const indicators = container.querySelector(".carousel-indicators");
  
  if (images.length <= 1) return;
  
  return setInterval(() => {
    const currentIndex = getCurrentImageIndex(container, images);
    const newIndex = (currentIndex + 1) % images.length;
    showImage(container, newIndex);
    if (indicators) {
      updateIndicators(indicators, newIndex);
    }
  }, interval);
}

// Initialize carousels when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Keep your existing animation observer code
  const projectCards = document.querySelectorAll(".project-cardB");
  const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
          if (entry.isIntersecting) {
              entry.target.classList.add("show");
          } else {
              entry.target.classList.remove("show");
          }
      });
  }, {
      threshold: 0.5,
  });

  projectCards.forEach((card) => observer.observe(card));
  
  // Initialize the image carousels
  initializeCarousels();
  
  // Optional: Start auto-sliding for each carousel
  // Uncomment the following code if you want automatic sliding
  
  // projectCards.forEach(card => {
  //   const imageContainer = card.querySelector(".project-image");
  //   if (imageContainer.querySelectorAll("img").length > 1) {
  //     startAutoSlide(imageContainer);
  //   }
  // });

});