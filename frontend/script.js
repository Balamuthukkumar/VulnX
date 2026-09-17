document.addEventListener("DOMContentLoaded", () => {

    const heroContent = document.querySelector(".hero-content");
    const heroVisual = document.querySelector(".hero-visual");

    heroContent.style.opacity = "0";
    heroVisual.style.opacity = "0";

    heroContent.style.transform = "translateY(25px)";
    heroVisual.style.transform = "translateY(25px)";

    setTimeout(() => {
        heroContent.style.transition = "all 0.8s ease";
        heroContent.style.opacity = "1";
        heroContent.style.transform = "translateY(0)";
    }, 150);

    setTimeout(() => {
        heroVisual.style.transition = "all 1s ease";
        heroVisual.style.opacity = "1";
        heroVisual.style.transform = "translateY(0)";
    }, 350);

});