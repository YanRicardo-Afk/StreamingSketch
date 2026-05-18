document.addEventListener("DOMContentLoaded", () => {
    const track = document.getElementById("carousel-track");
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");
    const dvdDisk = document.getElementById("dvd-disk");

    if (!track || !prevBtn || !nextBtn || !dvdDisk) return;

    const cardWidth = 170; // Largura do card do CSS
    const cardGap = 25;    // Espaçamento do CSS
    const scrollAmount = cardWidth + cardGap; // 195px por clique
    
    let currentRotation = 0;

    nextBtn.addEventListener("click", () => {
        // Verifica a quantidade máxima que o container consegue scrollar
        const maxScrollLeft = track.scrollWidth - track.clientWidth;
        
        // Se a posição atual do scroll já for igual ou maior que o limite máximo, ignora o clique
        if (track.scrollLeft >= maxScrollLeft - 5) return; 

        // Avança o carrossel e gira o DVD
        track.scrollLeft += scrollAmount;
        currentRotation += 60; // Gira 60 graus por clique
        dvdDisk.style.transform = `rotate(${currentRotation}deg)`;
    });

    prevBtn.addEventListener("click", () => {
        // Se já estiver totalmente na esquerda (posição 0), ignora o clique
        if (track.scrollLeft <= 0) return;

        // Recua o carrossel e gira o DVD no sentido anti-horário
        track.scrollLeft -= scrollAmount;
        currentRotation -= 60;
        dvdDisk.style.transform = `rotate(${currentRotation}deg)`;
    });
});