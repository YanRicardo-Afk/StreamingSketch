// script-perfil.js

// 1. Função que roda assim que a página carrega
document.addEventListener('DOMContentLoaded', () => {
    
    // Fazemos o pedido para a rota que criamos no Back-end
    // Note que agora usamos apenas '/usuario-atual' (caminho relativo)
    fetch('/usuario-atual')
        .then(response => {
            if (!response.ok) {
                // Se o servidor responder 401 ou outro erro, jogamos para o catch
                throw new Error('Não autorizado');
            }
            return response.json();
        })
        .then(dados => {
            // 2. Se deu tudo certo, procuramos o <span> no HTML e trocamos o texto
            const spanNome = document.getElementById('nome-usuario');
            if (spanNome && dados.nome) {
                spanNome.innerText = dados.nome;
            }
        })
        .catch(erro => {
            console.error('Erro ao buscar dados:', erro);
            // 3. Caso dê erro (usuário não logado), podemos redirecionar para o login
            alert("Você precisa estar logado!");
            window.location.href = '/login.html';
        });
});