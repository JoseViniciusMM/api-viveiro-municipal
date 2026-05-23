## 4. Movimentações (/movimentacoes)

### `4.1 POST /movimentacoes`

**Caso de Uso:**  
Registrar entradas, saídas manuais, expedição de lote ou ajustes de inventário para manter o saldo digital idêntico ao físico.

---

**Regras de Negócio:**

- **Validação de Atributos:**  
  É obrigatório o envio de especie_id, tipo (Entrada, Saída, Ajuste, Perda, Expedição), quantidade, justificativa e usuario_id.

- **Ações Imediatas (Cálculo de Saldo):**  
  Se tipo for ENTRADA ou AJUSTE (positivo), o sistema deve somar a quantidade ao campo quantidade_atual da Espécie.  
  Se tipo for SAIDA, PERDA, EXPEDICAO ou AJUSTE (negativo), o sistema deve subtrair a quantidade do saldo da Espécie.

- **Vínculo de Lote:**  
  Se o tipo for PERDA ou EXPEDICAO, o lote_id deve ser validado para garantir que a baixa ocorra no lote correto.

- **Expedição:**  
  Se o tipo for EXPEDICAO, o campo `destinatario_id` torna-se obrigatório.

- **Registro de Auditoria:**  
  Toda operação deve gerar automaticamente um log contendo o ID do usuário autenticado.

- **Validação de Destino:**  
  O sistema deve validar se o destinatário selecionado existe e está com status "Ativo".

---

**Resultado:**

- Movimentação registrada com sucesso (Status 201).  
- Saldo da espécie atualizado em tempo real na sementeira.

---

### `4.2 POST /movimentacoes/:id/estorno`

**Caso de Uso:**  
Estornar uma movimentação inserida por engano, corrigindo o saldo sem apagar o histórico original.

---

**Regras de Negócio:**

- **Ação Inversa Automática:**  
  O sistema deve localizar a movimentação original pelo ID e gerar uma nova movimentação com o valor inverso.

- **Rastreabilidade de Erro:**  
  A nova movimentação de estorno deve conter uma referência (campo justificativa ou metadado) ao ID da movimentação incorreta.

- **Recálculo de Saldo:**  
  O saldo da Espécie vinculada deve ser atualizado automaticamente após a criação do registro compensatório.

---

**Resultado:**

- Nova movimentação criada com sucesso (Status 201).  
- Saldo da sementeira recalculado e registro de auditoria atualizado com o responsável pelo estorno.

---

### `4.3 GET /movimentacoes`

**Caso de Uso:**  
Listagem geral de todo o histórico do viveiro para auditoria e controle de fluxo.

---

**Regras de Negócio:**

- **Filtros Avançados:**  
  Deve permitir filtrar por tipo (ex: só ver Estornos), data_inicio/data_fim, e usuario_id.

- **Paginação:**  
  Obrigatória para suportar grandes volumes de dados (ex: 20 registros por página).

- **Populate (Vínculos):**  
  O retorno deve incluir os nomes (não apenas IDs) da Espécie, do Usuário e do Lote (se houver).

- **Ordenação:**  
  Exibição cronológica inversa (da mais recente para a mais antiga).

---

**Resultado:**  

Lista paginada de movimentações (Status 200).

---

### `4.4 GET /movimentacoes/especie/:especie_id`

**Caso de Uso:**  
Analisar o histórico de estoque de uma semente ou muda específica (Rastreio de Consumo).

---

**Regras de Negócio:**

- **Isolamento:**  
  Retorna apenas as movimentações vinculadas à espécie informada no parâmetro.

- **Visão de Saldo:**  
  Útil para entender por que o saldo de uma espécie está baixo  
  (ex: verificar se houve muita "Perda" ou muita "Saída para Lote").

---

**Resultado:**  

Histórico filtrado por espécie (Status 200).

---

### `4.5 GET /movimentacoes/lote/:lote_id`

**Caso de Uso:**  
Consultar todas as ações que afetaram um lote específico (Mortalidade e Expedição).

---

**Regras de Negócio:**

- **Rastreabilidade do Lote:**  
  Esta é a rota que alimenta a "Linha do Tempo" do lote.

- **Eventos Críticos:**  
  Deve listar desde a saída da sementeira para a criação do lote até a expedição final ou registros de mortalidade intermediários.

---

**Resultado:**  

Histórico completo de vida do lote (Status 200).

---

### `4.6 GET /movimentacoes/:id`

**Caso de Uso:**  
Ver os detalhes completos de uma única movimentação (Justificativa técnica).

---

**Regras de Negócio:**

- **Detalhamento:**  
  Exibe o texto completo da justificativa, nome do usuário, tipo da movimentação etc.

- **Vínculo de Estorno:**  
  Se a movimentação for um estorno, deve exibir o ID da movimentação original que ela corrigiu.

- **Populate de Destinatário:**  
  Se for uma expedição, o retorno deve incluir os dados do destinatário vinculado.

---

**Resultado:**  

Objeto detalhado da movimentação (Status 200).