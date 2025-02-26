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

// First create a lightbox/modal for viewing images
function createImageModal() {
  // Create modal container if it doesn't exist
  if (!document.getElementById('image-modal')) {
    const modal = document.createElement('div');
    modal.id = 'image-modal';
    modal.className = 'image-modal';
    
    // Create image element
    const modalImg = document.createElement('img');
    modalImg.id = 'modal-img';
    
    // Create close button
    const closeBtn = document.createElement('span');
    closeBtn.className = 'modal-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.onclick = closeImageModal;
    
    // Create navigation buttons
    const prevBtn = document.createElement('button');
    prevBtn.className = 'modal-nav prev-modal-btn';
    prevBtn.innerHTML = '<span class="mdi mdi-chevron-left"></span>';
    
    const nextBtn = document.createElement('button');
    nextBtn.className = 'modal-nav next-modal-btn';
    nextBtn.innerHTML = '<span class="mdi mdi-chevron-right"></span>';
    
    // Add elements to modal
    modal.appendChild(modalImg);
    modal.appendChild(closeBtn);
    modal.appendChild(prevBtn);
    modal.appendChild(nextBtn);
    
    // Add click event to close when clicking outside the image
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        closeImageModal();
      }
    });
    
    // Add modal to the body
    document.body.appendChild(modal);
    
    // Add keyboard navigation
    document.addEventListener('keydown', handleModalKeyPress);
  }
}

// Close the modal
function closeImageModal() {
  const modal = document.getElementById('image-modal');
  if (modal) {
    modal.style.display = 'none';
  }
}

// Handle keyboard navigation in modal
function handleModalKeyPress(e) {
  const modal = document.getElementById('image-modal');
  if (modal && modal.style.display === 'block') {
    if (e.key === 'Escape') {
      closeImageModal();
    } else if (e.key === 'ArrowLeft') {
      navigateModalImage('prev');
    } else if (e.key === 'ArrowRight') {
      navigateModalImage('next');
    }
  }
}

// Navigate between images in the modal
function navigateModalImage(direction) {
  const modal = document.getElementById('image-modal');
  const modalImg = document.getElementById('modal-img');
  
  if (!modal || !modalImg || !modalImg.dataset.cardIndex) return;
  
  const cardIndex = parseInt(modalImg.dataset.cardIndex);
  const currentCard = document.querySelectorAll('.project-cardB')[cardIndex];
  if (!currentCard) return;
  
  const imageContainer = currentCard.querySelector('.project-image');
  const images = imageContainer.querySelectorAll('img');
  if (images.length <= 1) return;
  
  const currentImgIndex = parseInt(modalImg.dataset.imgIndex);
  let newIndex;
  
  if (direction === 'prev') {
    newIndex = (currentImgIndex - 1 + images.length) % images.length;
  } else {
    newIndex = (currentImgIndex + 1) % images.length;
  }
  
  // Update the modal image
  const newImgSrc = images[newIndex].src;
  modalImg.src = newImgSrc;
  modalImg.dataset.imgIndex = newIndex;
  
  // Also update the carousel to match
  showImage(imageContainer, newIndex);
  const indicators = imageContainer.querySelector('.carousel-indicators');
  if (indicators) {
    updateIndicators(indicators, newIndex);
  }
}

// Open the image modal with the clicked image
function openImageModal(img, cardIndex, imgIndex) {
  createImageModal();
  
  const modal = document.getElementById('image-modal');
  const modalImg = document.getElementById('modal-img');
  const prevBtn = modal.querySelector('.prev-modal-btn');
  const nextBtn = modal.querySelector('.next-modal-btn');
  
  // Set the image source
  modalImg.src = img.src;
  modalImg.dataset.cardIndex = cardIndex;
  modalImg.dataset.imgIndex = imgIndex;
  
  // Show/hide navigation based on number of images
  const currentCard = document.querySelectorAll('.project-cardB')[cardIndex];
  const imageContainer = currentCard.querySelector('.project-image');
  const images = imageContainer.querySelectorAll('img');
  
  if (images.length > 1) {
    prevBtn.style.display = 'flex';
    nextBtn.style.display = 'flex';
    
    // Add navigation event listeners
    prevBtn.onclick = function() {
      navigateModalImage('prev');
    };
    
    nextBtn.onclick = function() {
      navigateModalImage('next');
    };
  } else {
    prevBtn.style.display = 'none';
    nextBtn.style.display = 'none';
  }
  
  // Display the modal
  modal.style.display = 'block';
}

// Modify initializeCarousels function to make images clickable
function initializeCarousels() {
  const projectCards = document.querySelectorAll(".project-cardB");
  
  projectCards.forEach((card, cardIndex) => {
    const imageContainer = card.querySelector(".project-image");
    const images = imageContainer.querySelectorAll("img");
    
    // Make all images clickable
    images.forEach((img, imgIndex) => {
      img.style.cursor = 'pointer';
      img.addEventListener('click', function() {
        openImageModal(img, cardIndex, imgIndex);
      });
      img.dataset.index = imgIndex;
    });
    
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
      });
      
      // Add event listeners to buttons
      prevButton.addEventListener("click", (e) => {
        e.stopPropagation(); // Prevent event from bubbling to the image
        const currentIndex = getCurrentImageIndex(imageContainer, images);
        const newIndex = (currentIndex - 1 + images.length) % images.length;
        showImage(imageContainer, newIndex);
        updateIndicators(indicators, newIndex);
      });
      
      nextButton.addEventListener("click", (e) => {
        e.stopPropagation(); // Prevent event from bubbling to the image
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

// Keep the other helper functions unchanged
// (getCurrentImageIndex, showImage, updateIndicators, startAutoSlide)

// Initialize when DOM is loaded
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
  
  // Create modal container
  createImageModal();
  
  // Initialize the image carousels
  initializeCarousels();
});