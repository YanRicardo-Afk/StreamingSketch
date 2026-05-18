#  StreamingSketch

O **StreamingSketch** é um projeto de simulação de uma plataforma de streaming de vídeo. Ele conta com um ecossistema completo que engloba desde a navegação inicial, fluxos de autenticação otimizados para a experiência do usuário (UX), escolha de planos de assinatura e um painel de gerenciamento de perfil interativo.

---

## Funcionalidades Principais

*   **Página Principal (Landing Page):** Apresentação da plataforma com navegação intuitiva.
*   **Fluxo de Autenticação Inteligente:** 
    *   **Login Fluido:** Validação assíncrona baseada em JSON (Fetch API) que exibe mensagens de erro em tempo real sem recarregar a página.
    *   **Cadastro em Etapas:** Divisão do formulário em passos para evitar sobrecarga cognitiva.
*   **Microinterações de UX:**
    *   Barra de progresso animada no topo do cadastro exibindo o status das etapas.
    *   Alternância infinita de visibilidade de senha (ícone de olho) blindada contra elementos nativos do navegador.
*   **Sistema de Planos Dinâmico:** Escolha entre os planos *Free* e *Pro*, com abertura condicional e reativa da área de pagamento (Cartão e CPF).
*   **Gerenciamento de Perfil:** Painel interno que permite alterar nome, e-mail, senha, fazer upgrade de plano ou excluir a conta.

---

## 🛠️ Tecnologias Utilizadas

*   **Frontend:** HTML, CSS (Custom Properties, Flexbox, Gradients) e JavaScript Assíncrono (Fetch API / ES6+).
*   **Backend:** Node.js com o framework Express.
*   **Banco de Dados:** MySQL (utilizando o driver `mysql2`).
*   **Sessões:** `express-session` para controle de autenticação persistente.
*   **Ícones:** Font Awesome v7.

🎨 **Identidade Visual:** Nova paleta de cores moderna com foco no tom ativo `#c71555`.

---

## 📦 Estrutura do Banco de Dados

O backend conta com automação para criação do banco de dados `Sketch_DB` e da tabela `usuarios`. A estrutura da tabela armazena:

*   `id`: Identificador único (Auto Incremento)
*   `nome`: Nome completo do usuário
*   `email`: E-mail único utilizado para login
*   `senha`: Senha da conta
*   `plano`: Tipo do plano (`gratis` ou `pro`)
*   `cpf`: documento para faturamento (opcional/Pro)
*   `numero_cartao`: Dados de pagamento (opcional/Pro)
*   `senha_cartao`: Código de segurança do cartão (opcional/Pro)

---

## 🔧 Como Executar o Projeto

### Pré-requisitos
Certifique-se de ter instalado em sua máquina:
*   [Node.js](https://nodejs.org/)
*   [MySQL Server](https://dev.mysql.com/downloads/mysql/)

### Passo a Passo

1. **Clone o repositório:**
   ```bash
   git clone [https://github.com/seu-usuario/streaming-sketch.git](https://github.com/seu-usuario/streaming-sketch.git)
   cd streaming-sketch