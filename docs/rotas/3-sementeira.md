## 3. Sementeira (/especies)

### `3.1 POST /especies`

**Caso de Uso:**  
Cadastrar novas espécies botânicas no catálogo do viveiro, suportando o registro em lote de múltiplos itens simultaneamente.

---

**Regras de Negócio:**

- **Validação de Atributos Obrigatórios:**  
  Exigir Nome Científico (ou Nome Popular), Variedade, Categoria e Tipo (Semente ou Muda).

- **Saldo Inicial e Movimentação Automática:**  
  A API aceita a inserção de uma quantidade inicial no ato do cadastro.  
  O sistema registra a espécie com o status "Ativo" e, por baixo dos panos, gera automaticamente uma movimentação de "Entrada" correspondente ao valor informado.  
  Isso garante que todo o saldo nasça rastreado.

---

**Resultado:**  

Espécie(s) registrada(s) com sucesso e saldo inicial devidamente contabilizado no inventário.

---

### `3.2 GET /especies`

**Caso de Uso:**  
Listar as sementes e mudas do catálogo junto com seus saldos físicos atuais para a tabela principal.

---

**Regras de Negócio:**

- **Filtros Específicos:**  
  Permitir filtragem combinada por atributos (Categoria, Tipo, Status) e busca rápida textual pelo nome da planta.

---

**Resultado:**  

Lista de espécies contendo o saldo atualizado em tempo real e os metadados de paginação.

---

### `3.3 GET /especies/:id`

**Caso de Uso:**  
Retornar os detalhes completos de uma única espécie para preencher os pop-ups de "Detalhes da Espécie" e "Editar Espécie".

---

**Regras de Negócio:**

- **Retorno Completo:**  
  Deve trazer todos os campos cadastrais, incluindo o bloco de anotações/observações de manejo e a data original de registro.

---

**Resultado:**  

Objeto JSON detalhado da planta solicitada.

---

### `3.4 PATCH /especies/:id`

**Caso de Uso:**  
Atualizar dados cadastrais de uma espécie (nome, variedade, categoria, anotações) ou alterar seu status (inativação).

---

**Regras de Negócio:**

- **Blindagem de Estoque:**  
  É estritamente proibida a alteração manual dos campos "Quantidade" e "Tipo" através desta rota.  
  Qualquer correção de saldo deve ser obrigatoriamente roteada pelo módulo de /movimentacoes (Ajuste de Estoque), garantindo a integridade da auditoria.

---

**Resultado:**  

Registro atualizado com sucesso e log de edição gerado.

---

### `3.5 GET /especies/:id/historico`

**Caso de Uso:**  
Alimentar a tabela "Histórico da Espécie" presente dentro do modal de detalhes.

---

**Regras de Negócio:**

- **Linha do Tempo Específica:**  
  O sistema deve buscar no log de auditoria e movimentações apenas os eventos atrelados àquele ID  
  (ex: "Semente cadastrada", "Mudança de Variedade", "Ajuste de Estoque"), retornando a data, a ação executada e o usuário responsável.

---

**Resultado:**  

Lista cronológica de ações relacionadas à vida útil daquela espécie específica.