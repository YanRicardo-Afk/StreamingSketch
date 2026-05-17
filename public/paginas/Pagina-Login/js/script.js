document.getElementById('formLogin').addEventListener('submit', async (e) => {
        e.preventDefault(); // Impede a página de recarregar ou mudar de tela

        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;
        const msgErro = document.getElementById('msg-erro');
        
        // Limpa erros anteriores antes de tentar novamente
        msgErro.innerText = "";
        document.getElementById('email').classList.remove('input-error');
        document.getElementById('senha').classList.remove('input-error');

        try {
            // Envia os dados para o servidor em segundo plano
            const response = await fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, senha })
            });

            // Lemos o JSON independente de ter dado erro ou acerto no status HTTP
            const dados = await response.json();

            if (response.ok && dados.sucesso) {
                // Se o servidor respondeu status 200 e sucesso true, redireciona para a principal
                window.location.href = dados.redirecionar;
            } else {
                // Se caiu aqui (status 401, 500, etc), mostra a mensagem que veio do servidor
                msgErro.innerText = dados.mensagem || "E-mail ou senha incorretos.";
                document.getElementById('email').classList.add('input-error');
                document.getElementById('senha').classList.add('input-error');
                document.getElementById('senha').value = ""; // Limpa a senha por segurança
            }
        } catch (erro) {
            console.error("Erro detalhado no Fetch:", erro);
            msgErro.innerText = "Erro ao conectar com o servidor. Tente mais tarde.";
        }
    });