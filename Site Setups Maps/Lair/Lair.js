// Handle Dropdown Toggle
const dropdownBtn = document.querySelector(".dropdown-btn");
const dropdownContent = document.getElementById("site-container");

dropdownBtn.addEventListener("click", () => {
    // Toggle dropdown visibility
    dropdownContent.style.display = dropdownContent.style.display === "block" ? "none" : "block";
});

// Close dropdown when clicking outside of it
window.addEventListener("click", (event) => {
    if (!event.target.matches(".dropdown-btn") && !event.target.closest(".dropdown-content")) {
        dropdownContent.style.display = "none";
    }
});
