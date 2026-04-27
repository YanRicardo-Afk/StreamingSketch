document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS DA TELA ---
    const displayNome = document.getElementById('display-nome');
    const displayEmail = document.getElementById('display-email');
    const displayPlano = document.getElementById('display-plano');
    
    const modal = document.getElementById('modal-editar');
    const modalTitulo = document.getElementById('modal-titulo');
    const inputGeral = document.getElementById('input-geral');
    const selectPlano = document.getElementById('select-plano');
    
    // Novos elementos de pagamento no modal
    const divPagamento = document.getElementById('pagamento-perfil');
    const inputCartao = document.getElementById('cartao-perfil');
    const inputCpf = document.getElementById('cpf-perfil');
    
    const btnSalvar = document.getElementById('btn-salvar');
    const btnCancelar = document.getElementById('btn-cancelar');

    let campoSendoEditado = "";

    // --- 1. BUSCAR DADOS INICIAIS ---
    console.log("Iniciando busca de dados...");
    
    fetch('/usuario-atual')
        .then(res => {
            if (!res.ok) throw new Error('Usuário não autenticado');
            return res.json();
        })
        .then(dados => {
            displayNome.innerText = dados.nome;
            displayEmail.innerText = dados.email;
            displayPlano.innerText = dados.plano.toUpperCase();
        })
        .catch(err => {
            console.error("Erro ao carregar perfil:", err);
            // window.location.href = '/Login.html';
        });

    // --- 2. LÓGICA DE EXIBIÇÃO DO MODAL ---
    const prepararModal = (campo) => {
        campoSendoEditado = campo;
        modal.style.display = 'flex';
        modalTitulo.innerText = `Alterar ${campo}`;

        // Resetar visibilidade
        divPagamento.style.display = 'none';

        if (campo === 'plano') {
            inputGeral.style.display = 'none';
            selectPlano.style.display = 'block';
            // Se já abrir no 'pro', mostra o cartão
            divPagamento.style.display = selectPlano.value === 'pro' ? 'block' : 'none';
        } else {
            inputGeral.style.display = 'block';
            selectPlano.style.display = 'none';
            inputGeral.placeholder = `Novo ${campo}`;
            inputGeral.value = "";
        }
    };

    // Monitorar mudança no select de plano para mostrar campos de cartão
    selectPlano.addEventListener('change', () => {
        if (selectPlano.value === 'pro') {
            divPagamento.style.display = 'block';
        } else {
            divPagamento.style.display = 'none';
        }
    });

    // --- 3. EVENTOS DOS BOTÕES DE EDITAR ---
    document.getElementById('btn-edit-nome').addEventListener('click', () => prepararModal('nome'));
    document.getElementById('btn-edit-email').addEventListener('click', () => prepararModal('email'));
    document.getElementById('btn-edit-plano').addEventListener('click', () => prepararModal('plano'));

    // --- 4. FECHAR E SALVAR ---
    btnCancelar.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    btnSalvar.addEventListener('click', () => {
        let novoValor = (campoSendoEditado === 'plano') ? selectPlano.value : inputGeral.value;
        let dadosExtras = {};

        if (!novoValor) return alert("Preencha o campo!");

        // Se for upgrade para Pro, validar campos de cartão
        if (campoSendoEditado === 'plano' && novoValor === 'pro') {
            dadosExtras.numero_cartao = inputCartao.value;
            dadosExtras.cpf = inputCpf.value;

            if (!dadosExtras.numero_cartao || !dadosExtras.cpf) {
                return alert("Para o plano Pro, preencha os dados de pagamento!");
            }
        }

        fetch('/atualizar-perfil', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                campo: campoSendoEditado, 
                valor: novoValor,
                ...dadosExtras 
            })
        })
        .then(res => res.text())
        .then(msg => {
            if (campoSendoEditado === 'plano' && novoValor === 'pro') {
                // Mensagem de sucesso especial com o gato em ASCII
                alert(`✨ VOCÊ AGORA FAZ PARTE DO PLANO PRO! ✨\nAproveite seus benefícios!\n\n   |\\__/,|   (\n   (."..  )   )\n  _/  \\__(_ / \n (_/ \\_)_)\n  Sketch Team 😺`);
            } else {
                alert(msg);
            }
            location.reload();
        })
        .catch(err => console.error("Erro ao salvar:", err));
    });

    // --- 5. LOGOUT ---
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            window.location.href = '/logout';
        });
    }

    // --- 6. EXCLUIR CONTA ---
    const btnExcluir = document.getElementById('btn-excluir');
    if (btnExcluir) {
        btnExcluir.addEventListener('click', () => {
            const certeza = confirm("TEM CERTEZA? Isso apagará todos os seus dados e não pode ser desfeito.");
            
            if (certeza) {
                fetch('/excluir-conta', { method: 'POST' })
                    .then(res => res.text())
                    .then(msg => {
                        alert(msg);
                        window.location.href = '/';
                    });
            }
        });
    }
});