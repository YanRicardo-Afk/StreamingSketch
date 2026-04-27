// Busca dados ao carregar
fetch('/usuario-atual')
    .then(res => res.json())
    .then(user => {
        document.getElementById('display-nome').innerText = user.nome;
        document.getElementById('display-email').innerText = user.email;
        document.getElementById('display-plano').innerText = user.plano.toUpperCase();
    });

function editar(campo) {
    let novoValor;
    
    if (campo === 'senha') {
        novoValor = prompt("Digite sua nova senha:");
        if (!novoValor) return;
        enviarAlteracao('/alterar-senha', { senhaNova: novoValor });
    } else {
        novoValor = prompt(`Digite o novo ${campo}:`);
        if (!novoValor) return;
        enviarAlteracao('/atualizar-perfil', { campo: campo, valor: novoValor });
    }
}

function enviarAlteracao(rota, dados) {
    fetch(rota, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
    })
    .then(res => res.text())
    .then(msg => {
        alert(msg);
        window.location.reload(); // Recarrega para mostrar o dado novo
    });
}