## 6. Lotes (/lotes)

### `6.1 POST /lotes`

**Caso de Uso:**  
Iniciar o ciclo de produção, alocando sementes em uma estufa disponível.

---

**Regras de Negócio:**

- **Validação de Espaço:**  
  Verificar se a capacidade_maxima da estufa suporta o novo lote somado aos lotes ativos já presentes.

- **Reserva de Espaço:**  
  Alterar o status da estufa para "INDISPONÍVEL" apenas se a ocupação atingir 100%.

- **Abatimento de Estoque:**  
  Gerar automaticamente uma movimentação de "Saída" na sementeira para a espécie utilizada.

---

**Resultado:**

- Lote gerado com sucesso (Status 201) e ocupação física registrada.

---

### `6.2 PATCH /lotes/:id/fase`

**Caso de Uso:**  
Evoluir o lote entre as fases biológicas (Semeadura, Germinação, Produção, Pronto).

---

**Regras de Negócio:**

- **Evolução de Manejo:**  
  Atualiza a fase para controle da equipe de campo.

- **Sinalização de Prontidão:**  
  Quando o lote atinge a fase "PRONTO", ele fica habilitado para ser selecionado na rota de Expedição (Movimentações).

---

**Resultado:**

- Status biológico atualizado no sistema.

---

### `6.3 POST /lotes/:id/mortalidade`

**Caso de Uso:**  
Registrar perdas técnicas de mudas durante o cultivo.

---

**Regras de Negócio:**

- **Ajuste de Saldo Vivo:**  
  Subtrair a quantidade perdida do saldo do lote e da espécie.

- **Rastro de Perda:**  
  Gerar automaticamente uma movimentação do tipo MORTALIDADE com justificativa obrigatória e `usuario_id`.

---

**Resultado:**

- Saldo do lote reduzido e histórico de perda documentado.

---

### `6.4 GET /lotes/:id/historico`

**Caso de Uso:**  
Visualizar a rastreabilidade completa do lote, desde a semente até a saída definitiva.

---

**Regras de Negócio:**

- **Consolidação de Dados:**  
  O sistema deve reunir a espécie de origem, data de plantio, todas as trocas de fase e registros de mortalidade.

- **Linha do Tempo:**  
  Apresentar os eventos em ordem cronológica com a identificação dos usuários que realizaram cada ação.

---

**Resultado:**

- Relatório detalhado da vida útil do lote gerado para o usuário.

---

### `6.5 GET /lotes`

**Caso de Uso:**  
Listagem dinâmica de lotes com filtros avançados para controle de produção e manejo.

---

**Regras de Negócio:**

- **Busca Global (Campo Search):**  
  Deve permitir a filtragem por texto parcial que coincida com qualquer um dos campos presentes na tela de Lotes.

- **Filtros de Coluna (Botão Filtro):**  
  A API deve suportar filtros específicos para cada coluna da tabela: `especie_id`, `estufa_id`, `data_inicio` (intervalo de datas), `fase` (estágio biológico) e `status` (Ativo/Inativo).

---

**Resultado:**

- Lista de lotes filtrada conforme a seleção do usuário (Status 200).

---

### `6.6 GET /lotes/:id`

**Caso de Uso:**  
Abrir o card detalhado de um lote específico para realizar manejos ou consultas.

---

**Regras de Negócio:**

- **Visão Detalhada:**  
  Retorna todos os dados do lote, incluindo o array completo de itens_especies com as quantidades iniciais e atuais.

---

**Resultado:**

- Objeto detalhado do lote retornado (Status 200).

---

### `6.7 PATCH /lotes/:id/transferir`

**Caso de Uso:**  
Mover um lote de uma posição física para outra (ex: da Germinação para uma Estufa de Crescimento).

---

**Regras de Negócio:**

- **Validação de Destino:**  
  Assim como no cadastro, o Service deve verificar se a nova estufa possui capacidade disponível para receber a quantidade atual do lote.

- **Troca de Vagas:**  
  1. O sistema libera o espaço na estufa de origem (Recálculo de status "Disponível").  
  2. O sistema ocupa o espaço na estufa de destino (Recálculo de status "Indisponível" se atingir 100%).

- **Registro de Auditoria:**  
  Gravar no log que o lote mudou de localização física.

---

**Resultado:**

- Lote atualizado com a nova localização e capacidades das estufas recalculadas.

---

### `6.8 DELETE /lotes/:id`

**Caso de Uso:**  
Descartar um lote inteiro por erro de entrada ou perda total.

---

**Regras de Negócio:**

- **Movimentação de Ajuste:**  
  O sistema deve gerar automaticamente uma movimentação de "PERDA_TOTAL" na sementeira para zerar o saldo técnico daquela produção.

- **Liberação Imediata:**  
  A estufa vinculada tem seu espaço liberado imediatamente.

- **Justificativa:**  
  Exigir um motivo para o cancelamento, que será registrado como uma movimentação de "PERDA TOTAL".

---

**Resultado:**

- Lote desativado e espaço físico liberado no viveiro.