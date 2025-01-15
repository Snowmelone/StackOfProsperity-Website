// JavaScript to make the navbar appear when scrolling down
document.addEventListener("scroll", function () {
    const navbar = document.querySelector(".navbar");
    const scrollY = window.scrollY;
  
    if (scrollY > 150) { // Show the navbar after scrolling 150px
      navbar.style.top = "0";
    } else {
      navbar.style.top = "-100px"; // Hide the navbar
    }
  });
  