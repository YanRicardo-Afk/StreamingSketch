const session = require('express-session');
const express = require('express');
const mysql = require('mysql2');

const app = express();
const port = 3000;

// 1. Configurações e Middlewares
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Correção: extended

app.use(session({
  secret: 'chave-secreta-segura',
  resave: false,
  saveUninitialized: true
}));

// 2. Conexão com MySQL e Criação do Banco/Tabela
const db = mysql.createConnection({
    host: 'localHost',
    user: 'root',
    password: 'mysqllinux',
});

db.connect((err) => {
    if (err) throw err;
    console.log('Conectado ao Mysql!');

    db.query("CREATE DATABASE IF NOT EXISTS Sketch_DB", (err, result) => {
        if (err) throw err;
        console.log("Banco Sketch_DB verificado!");

        db.query("USE Sketch_DB", (err, result) => {
            if (err) throw err;
            const sql = `
                CREATE TABLE IF NOT EXISTS usuarios (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nome VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL UNIQUE,
                senha VARCHAR(255) NOT NULL,
                plano VARCHAR(20) DEFAULT 'gratis',
                cpf VARCHAR(14),
                numero_cartao VARCHAR(20),
                senha_cartao VARCHAR(100)
            )`;
            db.query(sql, (err, result) => {
                if (err) throw err;
                console.log("Tabela usuarios pronta!");
            });
        });
    });
});

// 3. Rotas da API



app.post('/cadastrar', (req, res) => {
    const { nome, email, senha, plano, cpf, numero_cartao, senha_cartao } = req.body;
    const sql = "INSERT INTO usuarios (nome, email, senha, plano, cpf, numero_cartao, senha_cartao) VALUES (?, ?, ?, ?, ?, ?, ?)";
    
    db.query(sql, [nome, email, senha, plano, cpf, numero_cartao, senha_cartao], (err, result) => {
        if (err) {
            console.error("Erro no Banco:", err);
            return res.status(500).send("Erro ao cadastrar.");
        }
        res.redirect('/Login.html');
    });
});

app.post('/login', (req, res) => {
    const { email, senha } = req.body;
    const sql = "SELECT * FROM usuarios WHERE email = ? AND senha = ?";
    
    db.query(sql, [email, senha], (err, results) => {
        if (err) return res.status(500).send("Erro no servidor");

        if (results.length > 0) {
            req.session.usuarioId = results[0].id;
            req.session.usuarioNome = results[0].nome;
            res.redirect('/paginaPrincipal.html');
        } else {
            res.send("E-mail ou senha incorretos.");
        }
    });
});

app.post('/alterar-nome', (req, res) => {
    const novoNome = req.body.novoNome;
    const usuarioId = req.session.usuarioId;

    if (!usuarioId) return res.send("Você precisa estar logado!");

    const sql = "UPDATE usuarios SET nome = ? WHERE id = ?";
    db.query(sql, [novoNome, usuarioId], (err, result) => {
        if (err) return res.status(500).send("Erro ao atualizar");
        req.session.usuarioNome = novoNome;
        res.send("Nome atualizado com sucesso!");
    });
});


// parte para pegar os dados e depois dar para alterar


// Rota para pegar todos os dados do usuário logado
app.get('/usuario-atual', (req, res) => {
    if (!req.session.usuarioId) return res.status(401).json({ erro: "Não logado" });

    const sql = "SELECT nome, email, plano FROM usuarios WHERE id = ?";
    db.query(sql, [req.session.usuarioId], (err, results) => {
        if (err) return res.status(500).json({ erro: "Erro no banco" });
        res.json(results[0]);
    });
});

// Rota genérica para atualizar dados (Nome, Email ou Plano)
app.post('/atualizar-perfil', (req, res) => {
    const { campo, valor } = req.body; // 'campo' seria 'nome', 'email' ou 'plano'
    const usuarioId = req.session.usuarioId;

    if (!usuarioId) return res.status(401).send("Sessão expirada");

    // Por segurança, validamos quais campos podem ser alterados
    const camposPermitidos = ['nome', 'email', 'plano'];
    if (!camposPermitidos.includes(campo)) return res.status(400).send("Campo inválido");

    const sql = `UPDATE usuarios SET ${campo} = ? WHERE id = ?`;
    db.query(sql, [valor, usuarioId], (err, result) => {
        if (err) return res.status(500).send("Erro ao atualizar");
        
        // Se mudou o nome, atualiza a sessão também
        if (campo === 'nome') req.session.usuarioNome = valor;
        
        res.send(`${campo} atualizado com sucesso!`);
    });
});

// Rota específica para Senha (exige mais cuidado)
app.post('/alterar-senha', (req, res) => {
    const { senhaNova } = req.body;
    const sql = "UPDATE usuarios SET senha = ? WHERE id = ?";
    db.query(sql, [senhaNova, req.session.usuarioId], (err, result) => {
        if (err) return res.status(500).send("Erro ao mudar senha");
        res.send("Senha alterada com sucesso!");
    });
});

// ROTA PARA DESLOGAR (LOGOUT)
app.get('/logout', (req, res) => {
    req.session.destroy(); // Apaga o "crachá" da sessão
    res.redirect('/'); // Volta para a home do site
});

// ROTA PARA EXCLUIR CONTA
app.post('/excluir-conta', (req, res) => {
    const usuarioId = req.session.usuarioId;

    if (!usuarioId) return res.status(401).send("Não autorizado");

    const sql = "DELETE FROM usuarios WHERE id = ?";
    db.query(sql, [usuarioId], (err, result) => {
        if (err) return res.status(500).send("Erro ao excluir conta");
        
        req.session.destroy(); // Limpa a sessão após deletar
        res.send("Conta excluída com sucesso.");
    });
});

app.post('/atualizar-perfil', (req, res) => {
    const { campo, valor, numero_cartao, cpf } = req.body;
    const usuarioId = req.session.usuarioId;

    if (!usuarioId) return res.status(401).send("Sessão expirada");

    // Se for alteração de plano para PRO, atualizamos também cartão e CPF
    if (campo === 'plano' && valor === 'pro') {
        const sql = "UPDATE usuarios SET plano = ?, numero_cartao = ?, cpf = ? WHERE id = ?";
        db.query(sql, [valor, numero_cartao, cpf, usuarioId], (err, result) => {
            if (err) return res.status(500).send("Erro ao processar upgrade");
            res.send("Upgrade realizado!");
        });
    } else {
        // Fluxo normal para Nome ou Email
        const sql = `UPDATE usuarios SET ${campo} = ? WHERE id = ?`;
        db.query(sql, [valor, usuarioId], (err, result) => {
            if (err) return res.status(500).send("Erro ao atualizar");
            res.send(`${campo} atualizado com sucesso!`);
        });
    }
});


// 4. Iniciar Servidor (Sempre por último)
app.listen(port, () => {
    console.log('Servidor rodando em http://localhost:' + port);
});


