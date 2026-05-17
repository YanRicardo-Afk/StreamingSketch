// ==========================================================================
// COREOGRAFIA GSAP: INTRO DA TV, MOVIMENTO DA LOGO, ENTRADA DE TEXTO E SCROLL
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
    // Cria a linha do tempo principal. Quando acabar todas as fases, roda a função 'iniciarBatidaLogo'
    const introTimeline = gsap.timeline({ onComplete: iniciarBatidaLogo });
    
    // Verifica se a tela é de celular
    const isMobile = window.innerWidth <= 768;
    
    // Configurações antes do show começar
    if (!isMobile) {
        // Se for PC, joga a logo pro meio da tela (-60% de ajuste) e deixa ela maior para dar impacto
        gsap.set(".anim-logo", { x: "-60%", scale: 1.2 }); 
    }
    // Deixa os textos invisíveis e um pouco abaixo (30px) esperando a vez deles
    gsap.set("#anim-titulo, #anim-subtitulo, #anim-botao", { opacity: 0, y: 30 });

    // --- SEQUÊNCIA REBELDE DA ANIMAÇÃO ---
    introTimeline
        // 1. Acende a linha branca horizontal no meio
        .to(".tv-line", { scaleX: 1, duration: 0.3, ease: "power4.in" })
        
        // 2. Abre a tela na vertical e faz o chuvisco cinza aparecer
        .to(".tv-line", { scaleY: 350, duration: 0.4, ease: "power3.out" })
        .to(".tv-static", { opacity: 0.5, duration: 0.4, repeat: 2, yoyo: true }, "<") // Roda junto com o de cima
        
        // 3. Torna visível o site real que estava escondido por trás
        .set(".main-wrapper", { visibility: "visible", opacity: 1 })
        
        // 4. Apaga o efeito de TV instantaneamente
        .to(".tv-overlay", { autoAlpha: 0, duration: 0.1, ease: "power1.in" })
        
        // 5. A logo brota no centro com um tranco elástico (Efeito cartoon)
        .from(".anim-logo", { scale: 0, duration: 0.5, ease: "back.out(1.5)" })
        
        // 6. A logo desliza suavemente do centro para o seu canto na direita
        .to(".anim-logo", { x: "0%", scale: 1, duration: 0.7, ease: "power4.inOut", delay: 0.2 })
        
        // 7. O blocão de texto e o botão entram escalonados (um atrás do outro usando o "-=0.2")
        .to("#anim-titulo", { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, "-=0.3") // Começa um pouquinho antes da logo parar
        .to("#anim-subtitulo", { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" }, "-=0.2")
        .to("#anim-botao", { opacity: 1, y: 0, duration: 0.4, ease: "back.out(1.7)" }, "-=0.2"); // Botão entra dando um soco elástico

    // --- LOOP DA BATIDA RÍTMICA DA LOGO (SUBWOOFER / TUM-TUM) ---
    function iniciarBatidaLogo() {
        const beatTimeline = gsap.timeline({ repeat: -1 }); // repeat -1 faz rodar para sempre
        beatTimeline
            // Batida 1: Forte (Aumenta bastante o brilho e tamanho bem rápido)
            .to(".anim-logo", { scale: 1.08, filter: "drop-shadow(7px 7px 0px #000) brightness(1.7) contrast(1.2)", duration: 0.05, ease: "power4.out" })
            .to(".anim-logo", { scale: 1, filter: "drop-shadow(5px 5px 0px #000) brightness(1) contrast(1)", duration: 0.2, ease: "sine.out" })
            
            // Batida 2: Eco Rápido (Menor que a primeira, tocando logo em seguida: +=0.15)
            .to(".anim-logo", { scale: 1.05, filter: "drop-shadow(6px 6px 0px #000) brightness(1.5) contrast(1.1)", duration: 0.05, ease: "power4.out" }, "+=0.15")
            .to(".anim-logo", { scale: 1, filter: "drop-shadow(5px 5px 0px #000) brightness(1) contrast(1)", duration: 0.25, ease: "sine.out" })
            
            // Descanso: Espera 2.2 segundos em silêncio antes de repetir o "tum-tum"
            .delay(2.2); 
    }

    // --- ANIMAÇÃO DE REVELAÇÃO AO ROLAR A PÁGINA (SCROLLTRIGGER) ---
    // Ativa os textos do Limbo subindo quando o topo da div chega em 75% da visão do usuário
    gsap.from(".about-text-box > *", {
        scrollTrigger: { trigger: ".limbo-about", start: "top 75%", toggleActions: "play none none none" },
        x: -50, opacity: 0, stagger: 0.15, duration: 0.5, ease: "power2.out"
    });

    // Faz os cards surgirem em efeito dominó elástico quando o carrossel aparece
    gsap.from(".carousel-card", {
        scrollTrigger: { trigger: ".about-carousel-wrapper", start: "top 80%" },
        scale: 0.8, opacity: 0, stagger: 0.1, duration: 0.4, ease: "back.out(1.2)" 
    });
});