// script.js

// Get all trigger images
const triggerImages = document.querySelectorAll('.trigger-image');

// Attach click event to each image
triggerImages.forEach((image) => {
    image.addEventListener('click', () => {
        const popupId = image.dataset.popup; // Get the corresponding popup ID
        const popup = document.getElementById(popupId);
        popup.style.display = 'flex';
    });
});

// Close buttons and background click functionality
document.querySelectorAll('.popup-overlay').forEach((overlay) => {
    const closeButton = overlay.querySelector('.close-btn');

    // Close popup when clicking the close button
    closeButton.addEventListener('click', () => {
        overlay.style.display = 'none';
    });

    // Close popup when clicking outside the box
    overlay.addEventListener('click', (event) => {
        if (event.target === overlay) {
            overlay.style.display = 'none';
        }
    });
});
