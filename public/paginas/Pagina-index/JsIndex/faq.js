// ==========================================================================
// LÓGICA DE ABRIR/FECHAR PERGUNTAS (ACCORDION REFRESH)
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
    const faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach(item => {
        const questionBtn = item.querySelector(".faq-question");
        const answerBox = item.querySelector(".faq-answer");

        questionBtn.addEventListener("click", () => {
            // Verifica se o item clicado já está aberto
            const isOpen = item.classList.contains("active");

            // FECHA TODOS os outros FAQs abertos (efeito sanfona limpo)
            faqItems.forEach(otherItem => {
                otherItem.classList.remove("active");
                otherItem.querySelector(".faq-answer").style.maxHeight = null;
            });

            // Se ele não estava aberto, abre ele calculando o tamanho interno real (scrollHeight)
            if (!isOpen) {
                item.classList.add("active");
                answerBox.style.maxHeight = answerBox.scrollHeight + "px";
            }
        });
    });
});