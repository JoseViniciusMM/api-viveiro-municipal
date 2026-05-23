## 5. Estufas (/estufas)

### `5.1 POST /estufas`

**Caso de Uso:**  
Registrar os espaços físicos do viveiro municipal para armazenamento de lotes.

---

**Regras de Negócio:**

- **Validação de Atributos Obrigatórios:**  
  O sistema deve exigir os campos de endereço interno (Localização da Estufa, Localização da Barraca e Localização da Posição) e a Capacidade Total de mudas.

- **Definição de Status Inicial:**  
  Toda nova estufa deve ser salva obrigatoriamente com o status "Livre".

- **Formatação de Identificador:**  
  O sistema deve gerar um identificador único (ex: `E01-B03-05`) concatenando as três localizações para facilitar a busca e organização na listagem.

---

### `5.2 GET /estufas`

**Caso de Uso:**  
Listar e filtrar estufas para gestão de espaço e preenchimento de formulários de alocação de lotes.

---

**Regras de Negócio:**

- **Cálculo de Ocupação:**  
  A listagem deve retornar a relação Quantidade Atual / Capacidade Total (ex: 500/800).

- **Indicadores de Status:**  
  Disponível para estufas com 0% de ocupação ou espaço disponível; Indisponível para estufas que atingiram 100% da capacidade total.

- **Filtros de Interface:**  
  A API deve suportar filtros por status (?status=Livre) e busca textual pelo código identificador gerado.

---

### `5.3 GET /estufas/:id`

**Caso de Uso:**  
Visualizar o detalhamento técnico de uma posição específica e quais lotes estão ocupando o espaço no momento.

---

**Regras de Negócio:**

- **Visão de Ocupação:**  
  Além dos dados básicos, o sistema deve retornar a lista de todos os lotes que possuem o status "ATIVO" vinculados a este estufa_id.

- **Cálculo de Disponibilidade:**  
  Deve exibir de forma clara o "Espaço Restante" (Capacidade Total - Soma da Quantidade Atual dos Lotes).

- **Populate:**  
  Trazer os dados resumidos dos lotes (Código e Espécie) para evitar que o usuário tenha que sair da tela para saber o que tem lá dentro.

---

**Resultado:**  

Objeto detalhado da estufa e seus ocupantes atuais (Status 200).

---

### `5.4 PATCH /estufas/:id`

**Caso de Uso:**  
Atualizar informações da estufa ou alterar seu estado operacional (ex: colocar em manutenção).

---

**Regras de Negócio:**

- **Bloqueio por Manutenção:**  
  Se o status for alterado para "MANUTENÇÃO", o sistema deve impedir a criação de novos lotes para este ID no Service de Lotes, mesmo que haja capacidade física.

- **Alteração de Capacidade:**  
  Se a capacidade total for reduzida, o sistema deve validar se a nova capacidade ainda comporta os lotes existentes. Se não comportar, a alteração deve ser bloqueada.

- **Atualização de Identificador:**  
  Caso mude a Barraca ou Posição, o sistema deve reconstruir o identificador único (ex: `E01-B03-05`).

---

**Resultado:**  

Dados da estufa atualizados com sucesso (Status 200).

---

### `5.5 DELETE /estufas/:id`

**Caso de Uso:**  
Desativar permanentemente uma posição física do sistema.

---

**Regras de Negócio:**

- **Validação de Esvaziamento:**  
  O sistema proíbe a exclusão de uma estufa que possua lotes ativos. O usuário deve primeiro mover ou finalizar os lotes.

- **Soft Delete:**  
  Para manter o histórico de auditoria (quem passou por ali?), a estufa deve ter seu status alterado para "INATIVO" em vez de ser apagada do banco de dados.

---

**Resultado:**  

Estufa desativada com sucesso (Status 200 ou 204).