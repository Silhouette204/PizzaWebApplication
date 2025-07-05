const mobileMenu = document.querySelector(".mobile-menu");
const desktopMenu = document.querySelector(".desktop-menu");

mobileMenu.addEventListener("click", () => {
  desktopMenu.style.display =
    desktopMenu.style.display === "none" ? "block" : "none";
});
