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
        cards.forEach(c => c.classList.remove('selecionado'));
        card.classList.add('selecionado');
        
        const radio = card.querySelector('input[type="radio"]');
        radio.checked = true;

        // NOVIDADE: Mostra ou esconde o cartão baseado no valor
        const areaPagamento = document.getElementById('area-pagamento');
        if (radio.value === 'pro') {
            areaPagamento.style.display = 'block';
            // Opcional: tornar campos obrigatórios se for PRO
            areaPagamento.querySelectorAll('input').forEach(i => i.required = true);
        } else {
            areaPagamento.style.display = 'none';
            areaPagamento.querySelectorAll('input').forEach(i => i.required = false);
        }
    });
});

// 5. Finalizar (Onde você enviaria para o Banco de Dados no futuro)
// 5. Finalizar (Enviando os dados para o servidor Node.js)
const form = document.getElementById('formCadastro');

form.addEventListener('submit', (e) => {
    const planoSelecionado = document.querySelector('input[name="plano"]:checked');
    const senha = document.getElementById('senha').value;
    const confirma = document.getElementById('confirma-senha').value;

    // Validação extra de segurança: as senhas batem?
    if (senha !== confirma) {
        e.preventDefault(); // Para o envio
        alert("As senhas não coincidem! Verifique e tente novamente.");
        return;
    }

    // O plano foi escolhido?
    if (!planoSelecionado) {
        e.preventDefault(); // Para o envio
        alert("Por favor, escolha um plano antes de finalizar!");
        return;
    }

    // Se chegou aqui, não damos o preventDefault(). 
    // O navegador vai pegar todos os campos com 'name' e enviar para o Back-end.
    console.log("Enviando dados para o servidor...");
});