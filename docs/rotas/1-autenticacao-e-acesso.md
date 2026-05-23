## 1. Autenticação e Acesso

### `1.1 POST /auth/login`

**Caso de Uso:**  
Permitir que servidores e administradores entrem no sistema utilizando credenciais seguras para acessar as ferramentas de manejo do viveiro.

---

**Regras de Negócio**

- **Verificação de Credenciais:** Validar CPF/E-mail e Senha. A senha enviada deve ser comparada com o hash salvo no banco (bcrypt).

- **Bloqueio por Status:** - Impedir login de contas **"Inativo"** (Erro: Usuário desativado).
  - Impedir login de contas **"Pendente"** (Erro: Conta aguardando ativação via e-mail).

- **Gestão de Sessão (Refresh Token):** Gerar um `accessToken` (curta duração) e um `refreshToken` (longa duração). O `refreshToken` deve ser armazenado para permitir a renovação da sessão sem novo login.

- **Auditoria:** Registrar o evento de "Login com Sucesso" no Log de Auditoria do sistema.

---

**Resultado:** Retorno do Token de Acesso, Refresh Token, Nome do Usuário e Cargo.

---

### `1.2 POST /auth/logout`

**Caso de Uso:**  
Encerrar a sessão do usuário logado.

---

**Regras de Negócio**

- **Autenticação Obrigatória:** Requer token de acesso válido.
- **Encerramento de Sessão:** Invalidar a sessão ativa do usuário.
- **Auditoria:** Registrar o evento de "Logout" no Log de Auditoria.

---

**Resultado:** Confirmação de logout.

---

### `1.3 POST /auth/refresh-token`

**Caso de Uso:**  
Renovar o token de acesso usando o refresh token.

---

**Regras de Negócio**

- **Validação do Refresh Token:** Verificar se o refresh token é válido e não expirou.
- **Geração de Novo Access Token:** Criar um novo access token para o usuário.
- **Status do Usuário:** Garantir que o usuário esteja ativo.

---

**Resultado:** Novo token de acesso.

---

### `1.4 POST /auth/esqueceu-senha`

**Caso de Uso:**  
Iniciar o processo de recuperação de senha enviando um e-mail com instruções.

---

**Regras de Negócio**

- **Validação de E-mail:** Verificar se o e-mail existe no sistema.
- **Envio de E-mail:** Enviar e-mail com link para redefinição de senha.
- **Auditoria:** Registrar o evento de "Reset de Senha" no Log de Auditoria.

---

**Resultado:** Confirmação de envio de e-mail (sem revelar se o e-mail existe).