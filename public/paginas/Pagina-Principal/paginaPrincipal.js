document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS DA TELA ---
    const displayNome = document.getElementById('display-nome');
    const displayEmail = document.getElementById('display-email');
    const displayPlano = document.getElementById('display-plano');
    
    const modal = document.getElementById('modal-editar');
    const modalTitulo = document.getElementById('modal-titulo');
    const inputGeral = document.getElementById('input-geral');
    const selectPlano = document.getElementById('select-plano');
    
    const btnSalvar = document.getElementById('btn-salvar');
    const btnCancelar = document.getElementById('btn-cancelar');

    let campoSendoEditado = "";

    // --- 1. BUSCAR DADOS INICIAIS ---
    console.log("Iniciando busca de dados..."); // Teste de carregamento
    
    fetch('/usuario-atual')
        .then(res => {
            if (!res.ok) throw new Error('Usuário não autenticado');
            return res.json();
        })
        .then(dados => {
            console.log("Dados recebidos:", dados);
            displayNome.innerText = dados.nome;
            displayEmail.innerText = dados.email;
            displayPlano.innerText = dados.plano.toUpperCase();
        })
        .catch(err => {
            console.error("Erro ao carregar perfil:", err);
            // window.location.href = '/Login.html';
        });

    // --- 2. FUNÇÃO PARA ABRIR MODAL (VIA JS) ---
    const prepararModal = (campo) => {
        campoSendoEditado = campo;
        modal.style.display = 'flex';
        modalTitulo.innerText = `Alterar ${campo}`;

        if (campo === 'plano') {
            inputGeral.style.display = 'none';
            selectPlano.style.display = 'block';
        } else {
            inputGeral.style.display = 'block';
            selectPlano.style.display = 'none';
            inputGeral.placeholder = `Novo ${campo}`;
            inputGeral.value = "";
        }
    };

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

        if (!novoValor) return alert("Preencha o campo!");

        fetch('/atualizar-perfil', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ campo: campoSendoEditado, valor: novoValor })
        })
        .then(res => res.text())
        .then(msg => {
            alert(msg);
            location.reload();
        })
        .catch(err => console.error("Erro ao salvar:", err));
    });
});