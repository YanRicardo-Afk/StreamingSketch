// 1. Seleção dos elementos
const etapaDados = document.getElementById('etapa-dados');
const etapaPlanos = document.getElementById('etapa-planos');
const btnProximo = document.querySelector('.btn-proximo');
const btnVoltar = document.querySelector('.btn-voltar');
const cards = document.querySelectorAll('.card-plano');

// 2. Lógica para mudar de aba (Próximo)
btnProximo.addEventListener('click', () => {
    // Validação simples: verifica se os campos da primeira parte estão preenchidos
    const inputs = etapaDados.querySelectorAll('input');
    let todosPreenchidos = true;

    inputs.forEach(input => {
        if (!input.value) {
            todosPreenchidos = false;
            input.style.borderColor = "red"; // Avisa qual está vazio
        } else {
            input.style.borderColor = "#333";
        }
    });

    if (todosPreenchidos) {
        etapaDados.style.display = 'none';
        etapaPlanos.style.display = 'block';
    } else {
        alert("Por favor, preencha todos os campos antes de continuar.");
    }
});

// 3. Lógica para Voltar
btnVoltar.addEventListener('click', () => {
    etapaPlanos.style.display = 'none';
    etapaDados.style.display = 'block';
});

// 4. Seleção visual dos Cards de Plano
cards.forEach(card => {
    card.addEventListener('click', () => {
        // Remove a classe 'selecionado' de todos os cards
        cards.forEach(c => c.classList.remove('selecionado'));
        
        // Adiciona a classe ao card clicado
        card.classList.add('selecionado');
        
        // Marca o input radio que está escondido dentro do card
        const radio = card.querySelector('input[type="radio"]');
        radio.checked = true;
        
        console.log("Plano selecionado:", radio.value); // Apenas para teste
    });
});

// 5. Finalizar (Onde você enviaria para o Banco de Dados no futuro)
const form = document.getElementById('formCadastro');
form.addEventListener('submit', (e) => {
    const planoSelecionado = document.querySelector('input[name="plano"]:checked');

    if (!planoSelecionado) {
        e.preventDefault(); // Impede o envio do formulário
        alert("Por favor, escolha um plano antes de finalizar!");
    } else {
        alert("Cadastro realizado com sucesso! (Simulação)");
        // Aqui você faria a integração com o Banco de Dados
    }
});