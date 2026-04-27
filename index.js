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

app.get('/usuario-atual', (req, res) => {
    if (req.session.usuarioNome) {
        res.json({ nome: req.session.usuarioNome });
    } else {
        res.status(401).json({ erro: "Não logado" });
    }
});

// 4. Iniciar Servidor (Sempre por último)
app.listen(port, () => {
    console.log('Servidor rodando em http://localhost:' + port);
});