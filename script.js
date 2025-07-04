const mobileMenu = document.querySelector(".mobile-menu");
const desktopMenu = document.querySelector(".desktop-menu");

mobileMenu.addEventListener("click", () => {
  desktopMenu.style.display =
    desktopMenu.style.display === "none" ? "block" : "none";
});

const btns = [
  {
    id: 1,
    name: "Pizza",
  },
  {
    id: 2,
    name: "Burger",
  },
  {
    id: 3,
    name: "Drinks",
  },
  {
    id: 4,
    name: "Pastries",
  },
];

// No need for a separate 'filters' array from 'btns' unless you had duplicates
// const filters = [...new Set(btns.map((btn) => btn))]; // This is redundant for unique buttons

const product = [
  {
    id: 1,
    image: "assets/img/ham&cheese.png",
    title: "Ham Cheese Pizza",
    price: 100,
    category: "Pizza",
  },
  {
    id: 2,
    image: "assets/img/pepperoni.png",
    title: "Pepperoni Pizza",
    price: 120,
    category: "Pizza",
  },
  {
    id: 3,
    image: "assets/img/cheeseburger.png",
    title: "Classic Cheese Burger",
    price: 85,
    category: "Burger",
  },
  {
    id: 4,
    image: "assets/img/cocacola.png",
    title: "Coca-Cola",
    price: 30,
    category: "Drinks",
  },
  {
    id: 5,
    image: "assets/img/croissant.png",
    title: "Chocolate Croissant",
    price: 60,
    category: "Pastries",
  },
  {
    id: 6,
    image: "assets/img/hawaiian.png",
    title: "Hawaiian Pizza",
    price: 110,
    category: "Pizza",
  },
  {
    id: 7,
    image: "assets/img/veggie.png",
    title: "Veggie Delight Pizza",
    price: 105,
    category: "Pizza",
  },
  {
    id: 8,
    image: "assets/img/italian.png",
    title: "Italian Pizza",
    price: 130,
    category: "Pizza",
  },
];

// This `categories` array is not strictly needed if you directly filter `product`
// const categories = [
//   ...new Set(
//     product.map((item) => {
//       return item;
//     })
//   ),
// ];

const displayItem = (items) => {
  document.getElementById("root").innerHTML = items
    .map((item) => {
      var { image, title, price } = item;
      return `<div class='box'>
>
          <div class='img-box'>
            <img class = 'images' src=${image}></img>
               <h3>${title}</h3>
          </div>
          <div class='bottom'>
            <h2>$ ${price}.00</h2>
          </div>

          <div class='product-button'>
          <button>Buy Now!</button>
        </div>
        </div>`;
    })
    .join("");
};

// Initial display of all products
displayItem(product);

// Function to filter items based on category name
const filterItems = (categoryName) => {
  // If "All" or a similar button is clicked, display all products
  if (categoryName === "All") {
    displayItem(product);
    return;
  }
  const filteredProducts = product.filter(
    (item) => item.category === categoryName
  );
  displayItem(filteredProducts);
};

document.getElementById("btns").innerHTML = btns
  .map((btn) => {
    var { name } = btn; // We need the name for filtering by category
    return (
      "<button class ='fil-p' onclick='filterItems(\"" + // Corrected onclick syntax and passed name
      name +
      "\")'>" +
      name +
      "</button>"
    );
  })
  .join("");

// Add an "All" button for showing all products
document.getElementById("btns").innerHTML =
  "<button class ='fil-p' onclick='filterItems(\"All\")'>All</button>" +
  document.getElementById("btns").innerHTML;

new Swiper(".person-wrapper", {
  // <--- Change this line
  loop: true,
  spaceBetween: 5,

  // If we need pagination
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
    dynamicBullets: true,
  },

  // Navigation arrows
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },

  breakpoints: {
    0: {
      slidesPerView: 2,
    },
    620: {
      slidesPerView: 2,
    },
    960: {
      slidesPerView: 3,
    },
    1200: {
      slidesPerView: 3,
    },
  },
});

document.addEventListener("DOMContentLoaded", () => {
  // Get references to the slideshow container and all individual slides within the REVIEWS section
  const slideshowContainer = document.querySelector(
    ".reviews .slideshow-container"
  );
  const slides = document.querySelectorAll(".reviews .slide"); // Select slides within the reviews section
  const numSlides = slides.length; // Total number of slides
  let currentSlideIndex = 0; // Index of the currently visible slide
  const slideDuration = 3000; // Time in milliseconds for each slide (3 seconds)
  let slideshowInterval; // Variable to hold the interval ID

  // Function to move to the next slide
  function showNextSlide() {
    // Calculate the next slide index, looping back to 0 if at the end
    currentSlideIndex = (currentSlideIndex + 1) % numSlides;
    updateSlidesPosition(); // Update the position of all slides
  }

  // Function to update the transform property of slides
  function updateSlidesPosition() {
    slides.forEach((slide, index) => {
      // Calculate the vertical position for each slide.
      // The current slide will be at translateY(0).
      // Slides before it will be pushed up (negative translateY).
      // Slides after it will be pushed down (positive translateY).
      const translateYValue = (index - currentSlideIndex) * 100; // 100% for full height
      slide.style.transform = `translateY(${translateYValue}%)`;
    });
  }

  // Function to start the automatic slideshow
  function startSlideshow() {
    // Clear any existing interval to prevent multiple intervals running
    if (slideshowInterval) {
      clearInterval(slideshowInterval);
    }
    slideshowInterval = setInterval(showNextSlide, slideDuration);
  }

  // Initialize slide positions and start the slideshow
  updateSlidesPosition();
  startSlideshow();
});
