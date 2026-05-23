## 9. Destinatários (/destinatarios)

### `9.1 POST /destinatarios`

**Caso de Uso:**  
Registrar no sistema as entidades, órgãos públicos ou cidadãos que estão aptos a receber mudas e sementes do viveiro municipal.

---

**Regras de Negócio:**

- **Atributos Obrigatórios:**  
  Exigir Nome/Razão Social, Tipo (Físico ou Jurídico), Categoria (Público, Social ou Privado), Telefone e Setor/Bairro.

- **Validação de Documento:**  
  O campo `documento` (CPF ou CNPJ) deve ser validado conforme o formato e deve ser único na base de dados para evitar duplicidade de beneficiários.

- **Categorização Técnica:**  
  O campo `categoria` deve seguir um ENUM para permitir relatórios consolidados (ex: identificar quanto foi entregue para "Escolas" vs "ONGs").

- **Status Inicial:**  
  Todo novo destinatário é criado automaticamente com o status "Ativo".

- **Auditoria:**  
  A criação deve registrar o `usuario_id` responsável pelo cadastro no log de auditoria.

---

**Resultado:**  
Destinatário cadastrado com sucesso e habilitado para seleções em processos de expedição.

---

### `9.2 GET /destinatarios`

**Caso de Uso:**  
Listar os destinatários para gestão administrativa ou para alimentar componentes de busca (Select) na tela de expedição de lotes.

---

**Regras de Negócio:**

- **Paginação e Busca Dinâmica:**  
  Suportar listagem paginada com busca textual por Nome ou Documento.

- **Filtros de Segmentação:**  
  Permitir filtrar a lista por Categoria (ex: listar apenas "Secretarias") e Status (Ativo/Inativo).

- **Ordenação:**  
  Exibição por ordem alfabética de Nome/Razão Social por padrão.

---

**Resultado:**  
Lista paginada de destinatários e metadados para controle da interface.

---

### `9.3 GET /destinatarios/:id`

**Caso de Uso:**  
Consultar o perfil detalhado de um destinatário, incluindo informações de contato e localização geográfica para logística de entrega.

---

**Regras de Negócio:**

- **Retorno Completo:**  
  Deve exibir todos os campos, incluindo Finalidade Padrão, Vínculo Legal e observações de histórico.

- **Vínculo de Expedições:**  
  Opcionalmente, pode retornar um resumo das últimas expedições vinculadas a este ID (Rastreio de Beneficiário).

---

**Resultado:**  
Objeto JSON detalhado com os dados da entidade ou cidadão.

---

### `9.4 PATCH /destinatarios/:id`

**Caso de Uso:**  
Atualizar dados de contato, endereço ou categoria do destinatário conforme mudanças administrativas ou cadastrais.

---

**Regras de Negócio:**

- **Propagação de Dados:** 
    Alterações no nome ou razão social do destinatário devem ser refletidas em consultas futuras de relatórios, mas o ID interno permanece o mesmo para garantir que o vínculo com lotes antigos não seja perdido.

- **Gestão de Status:**  
  Permite reativar um destinatário que foi anteriormente inativado.

---

**Resultado:**  
Dados atualizados no banco de dados e log de alteração registrado na auditoria.

---

### `9.5 DELETE /destinatarios/:id`

**Caso de Uso:**  
Desativar um destinatário que não deve mais receber mudas (ex: órgão extinto ou cidadão com restrições).

---

**Regras de Negócio:**

- **Soft Delete:**  
  O registro nunca é apagado fisicamente. O sistema altera o status para "Inativo".

- **Integridade Referencial:**  
  O sistema impede o vínculo de novos registros a este ID, mas preserva o nome do destinatário em todos os relatórios de expedições já realizadas.

- **Bloqueio de Inativação (Opcional):**  
  O sistema pode impedir a inativação se houver uma expedição com status "Em Trânsito" ou pendente de assinatura.

---

**Resultado:**  
Destinatário inativado com sucesso e removido das listas de seleção ativa.