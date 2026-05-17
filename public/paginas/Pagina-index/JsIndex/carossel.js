document.addEventListener("DOMContentLoaded", () => {
    const carouselTrack = document.getElementById("carousel-track");
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");
    
    // Rola a largura exata de um card em pé (160px) + o espaço (20px)
    const scrollAmount = 180; 

    if(carouselTrack && prevBtn && nextBtn) {
        nextBtn.addEventListener("click", () => {
            carouselTrack.scrollLeft += scrollAmount;
        });

        prevBtn.addEventListener("click", () => {
            carouselTrack.scrollLeft -= scrollAmount;
        });
    }
});