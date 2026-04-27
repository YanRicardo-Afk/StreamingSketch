let campoSendoEditado = "";

function abrirModal(campo) {
    campoSendoEditado = campo;
    document.getElementById('modal-editar').style.display = 'flex';
    document.getElementById('modal-titulo').innerText = `Alterar ${campo}`;

    const inputGeral = document.getElementById('input-geral');
    const selectPlano = document.getElementById('select-plano');

    if (campo === 'plano') {
        inputGeral.style.display = 'none';
        selectPlano.style.display = 'block';
    } else {
        inputGeral.style.display = 'block';
        selectPlano.style.display = 'none';
        inputGeral.placeholder = `Novo ${campo}`;
        inputGeral.value = "";
    }
}

function fecharModal() {
    document.getElementById('modal-editar').style.display = 'none';
}

document.getElementById('btn-salvar').addEventListener('click', () => {
    let novoValor;

    if (campoSendoEditado === 'plano') {
        novoValor = document.getElementById('select-plano').value;
    } else {
        novoValor = document.getElementById('input-geral').value;
    }

    if (!novoValor) return alert("Preencha o campo!");

    // Envia para o Back-end (a rota que já criamos)
    fetch('/atualizar-perfil', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campo: campoSendoEditado, valor: novoValor })
    })
    .then(res => res.text())
    .then(msg => {
        alert(msg);
        location.reload();
    });
});