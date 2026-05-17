// 1. Seleção dos elementos estruturais
const etapaDados = document.getElementById('etapa-dados');
const etapaPlanos = document.getElementById('etapa-planos');
const btnProximo = document.querySelector('.btn-proximo');
const btnVoltar = document.querySelector('.btn-voltar');
const cards = document.querySelectorAll('.card-plano');
const barraProgresso = document.getElementById('barra-progresso');
const stepIndicator = document.getElementById('step-indicator');
const form = document.getElementById('formCadastro');

// FUNÇÕES AUXILIARES DE VALIDAÇÃO (UX LIMPA)
function definirErro(idInput, idErro, mensagem) {
    const input = document.getElementById(idInput);
    const erroSpan = document.getElementById(idErro);
    if(input && erroSpan) {
        input.classList.add('input-error-borda');
        erroSpan.innerText = mensagem;
    }
}

function limparErro(idInput, idErro) {
    const input = document.getElementById(idInput);
    const erroSpan = document.getElementById(idErro);
    if(input && erroSpan) {
        input.classList.remove('input-error-borda');
        erroSpan.innerText = "";
    }
}

// Limpeza de erros em tempo real enquanto o usuário digita
const camposPrimeiraEtapa = ['nome', 'email', 'senha', 'confirma-senha'];
camposPrimeiraEtapa.forEach(id => {
    const input = document.getElementById(id);
    if(input) {
        input.addEventListener('input', () => {
            limparErro(id, 'erro-' + (id === 'confirma-senha' ? 'confirma' : id));
        });
    }
});

// 2. CORREÇÃO UX: Alternar Visibilidade da Senha de Forma Infinita
document.querySelectorAll('.toggle-password').forEach(botaoOlho => {
    botaoOlho.addEventListener('click', function() {
        const targetId = this.getAttribute('data-target');
        const inputSenha = document.getElementById(targetId);
        
        if (inputSenha.type === 'password') {
            inputSenha.type = 'text';
            this.classList.remove('fa-eye');
            this.classList.add('fa-eye-slash');
        } else {
            inputSenha.type = 'password';
            this.classList.remove('fa-eye-slash');
            this.classList.add('fa-eye');
        }
    });
});

// 3. Validação Detalhada e Avanço para Etapa 2
btnProximo.addEventListener('click', () => {
    let valido = true;

    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value;
    const confirmaSenha = document.getElementById('confirma-senha').value;

    // Validação: Campo Vazio e Números no Nome
    const regexNumeros = /\d/;
    if (!nome) {
        definirErro('nome', 'erro-nome', 'O campo nome não pode ficar vazio.');
        valido = false;
    } else if (regexNumeros.test(nome)) {
        definirErro('nome', 'erro-nome', 'O nome não deve conter números.');
        valido = false;
    }

    // Validação: E-mail Vazio e Caractere '@'
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
        definirErro('email', 'erro-email', 'O campo e-mail não pode ficar vazio.');
        valido = false;
    } else if (!email.includes('@') || !regexEmail.test(email)) {
        definirErro('email', 'erro-email', 'Insira um e-mail válido (ex: seu@email.com).');
        valido = false;
    }

    // Validação: Senhas vazias e correspondência
    if (!senha) {
        definirErro('senha', 'erro-senha', 'Crie uma senha para sua conta.');
        valido = false;
    }
    if (!confirmaSenha) {
        definirErro('confirma-senha', 'erro-confirma', 'Confirme a sua senha.');
        valido = false;
    } else if (senha !== confirmaSenha) {
        definirErro('confirma-senha', 'erro-confirma', 'As senhas informadas não coincidem.');
        valido = false;
    }

    if (valido) {
        // MICROINTERAÇÃO: Atualiza a barra para 100%
        barraProgresso.style.width = '100%';
        stepIndicator.innerText = "Etapa 2 de 2";
        
        etapaDados.style.display = 'none';
        etapaPlanos.style.display = 'block';
    }
});

// 4. Lógica para Voltar à Etapa 1
btnVoltar.addEventListener('click', () => {
    // MICROINTERAÇÃO: Retorna a barra para 50%
    barraProgresso.style.width = '50%';
    stepIndicator.innerText = "Etapa 1 de 2";

    etapaPlanos.style.display = 'none';
    etapaDados.style.display = 'block';
});

// 5. Seleção Visual dos Cards de Plano
cards.forEach(card => {
    card.addEventListener('click', () => {
        cards.forEach(c => c.classList.remove('selecionado'));
        card.classList.add('selecionado');
        document.getElementById('erro-plano').innerText = ""; // Limpa erro de seleção
        
        const radio = card.querySelector('input[type="radio"]');
        radio.checked = true;

        const areaPagamento = document.getElementById('area-pagamento');
        if (radio.value === 'pro') {
            areaPagamento.style.display = 'block';
        } else {
            areaPagamento.style.display = 'none';
            // Limpa erros ocultados do Pro caso mude para o free
            limparErro('num-cartao', 'erro-cartao');
            limparErro('cpf-input', 'erro-cpf');
            limparErro('senha-cartao', 'erro-senha-cartao');
        }
    });
});

// Limpeza dos erros do cartão sob digitação
['num-cartao', 'cpf-input', 'senha-cartao'].forEach(id => {
    const input = document.getElementById(id);
    if(input){
        input.addEventListener('input', () => {
            let sufixo = id.split('-')[1] || 'senha-cartao';
            if(id === 'senha-cartao') sufixo = 'senha-cartao';
            limparErro(id, 'erro-' + sufixo);
        });
    }
});

// 6. Submissão Final do Formulário com Validação Híbrida Pro/Free
form.addEventListener('submit', (e) => {
    let valido = true;
    const planoSelecionado = document.querySelector('input[name="plano"]:checked');
    
    if (!planoSelecionado) {
        e.preventDefault();
        document.getElementById('erro-plano').innerText = "Por favor, selecione uma das opções de plano acima.";
        valido = false;
        return;
    }

    // Se o plano for Pro, valida os campos financeiros obrigatórios
    if (planoSelecionado.value === 'pro') {
        const numCartao = document.getElementById('num-cartao').value.trim();
        const cpf = document.getElementById('cpf-input').value.trim();
        const senhaCartao = document.getElementById('senha-cartao').value;

        if (!numCartao) {
            definirErro('num-cartao', 'erro-cartao', 'O número do cartão é obrigatório.');
            valido = false;
        }
        if (!cpf) {
            definirErro('cpf-input', 'erro-cpf', 'O CPF é obrigatório para faturamento.');
            valido = false;
        }
        if (!senhaCartao) {
            definirErro('senha-cartao', 'erro-senha-cartao', 'Informe a senha do cartão.');
            valido = false;
        }
    }

    if (!valido) {
        e.preventDefault(); // Impede o envio se houver erros na etapa 2
    }
});