## 2. Gestão de Usuários (/usuarios)

### `2.1 POST /usuarios`

**Caso de Uso:**  
Registrar novos servidores no sistema PAMINE e disparar o convite por e-mail.

**Regras de Negócio:**

- **Atributos Obrigatórios:**  
  Exigir Nome, CPF, E-mail, Telefone e Cargo (conforme TIPO_USUARIO_ENUM). O campo "Senha" não é preenchido nesta etapa.

- **Unicidade:**  
  Bloquear cadastros com CPF ou E-mail já existentes no banco de dados.

- **Status Inicial:**  
  Novos registros iniciam automaticamente com o status "Pendente".

- **Fluxo de Segurança:**  
  O sistema deve gerar um `token_ativacao` único com data de expiração e disparar o e-mail de ativação.

**Resultado:**  
Usuário criado com status pendente e e-mail de convite enviado.

---

### `2.2 GET /usuarios`

**Caso de Uso:**  
Listar e gerenciar servidores cadastrados para controle administrativo.

---

**Regras de Negócio:**

- **Paginação e Filtros:**  
  Implementar listagem paginada com filtros por Nome, Cargo ou Status (Ativo, Inativo, Pendente).

- **Segurança de Dados:**  
  O campo Senha deve ser omitido do retorno da consulta.

- **Acesso Restrito:**  
  Endpoint disponível apenas para perfis de nível Administrador.

---

**Resultado:**  
Lista de usuários e metadados de paginação.

---

### `2.3 PATCH/PUT /usuarios/:id`

**Caso de Uso:**  
Atualizar informações cadastrais, alterar cargos ou inativar contas pelo Administrador.

---

**Regras de Negócio:**

- **Edição de Campos:**  
  Permite a alteração de dados do perfil, incluindo Nome, Telefone, CPF e E-mail, além de Cargo e Status.

- **Soft Delete:**  
  Inativação de contas via campo Status para preservar o histórico de auditoria.

- **Gestão de Convites:**  
  Permite que o administrador reenvie o e-mail de ativação caso o usuário ainda possua o status "Pendente".

---

**Resultado:**  

Registro atualizado com sucesso no banco de dados.

---

### `2.4 POST /usuarios/confirmar-cadastro`

**Caso de Uso:**  
Permitir que o servidor defina sua senha inicial e ative sua conta através do link de confirmação recebido por e-mail.

---

**Regras de Negócio:**

- **Validação de Token:**  
  O sistema deve validar a integridade e a expiração do token de ativação enviado via e-mail.

- **Criptografia:**  
  A senha fornecida pelo usuário deve ser processada via bcrypt (Hash) antes da persistência.

- **Ativação de Conta:**  
  Após a definição bem-sucedida da senha, o status do usuário deve ser alterado de "Pendente" para "Ativo".

---

**Resultado:**  

Senha definida e conta ativada com sucesso para o primeiro acesso.

---

### `2.5 PATCH /usuarios/perfil`

**Caso de Uso:**  
Permitir que o servidor logado atualize suas próprias informações básicas e altere sua senha de acesso.

---

**Regras de Negócio:**

- **Edição Restrita:**  
  O usuário pode alterar apenas Nome, E-mail e Telefone.  
  Alterações de Cargo ou Status são bloqueadas neste endpoint.

- **Atualização de Segurança:**  
  Se a senha for alterada, o novo valor deve passar obrigatoriamente pelo processo de re-hashing via bcrypt.

- **Identificação:**  
  O sistema deve identificar o usuário através do token de autenticação da sessão ativa.

---

**Resultado:**  

Perfil pessoal atualizado com sucesso.