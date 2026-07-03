## 7. Relatórios e Auditoria (/relatorios e /auditoria)

### `7.1 GET /relatorios/lotes`

**Caso de Uso:**  
Gerar um relatório gerencial com o histórico completo dos ciclos de produção (do plantio à finalização).

---

**Regras de Negócio:**

- **Filtros Flexíveis:**  
  Permitir busca por intervalo de datas, espécie, fase atual e estufa.

- **Consolidação:**  
  O retorno deve trazer os dados mastigados (Sementes Iniciais vs. Quantidade Atual vs. Perdas Totais) para facilitar a visualização em tabela.

---

**Filtros Disponíveis:**
- `especie_id` - ID da espécie
- `estufa_id` - ID da estufa
- `fase` - SEMEADURA, GERMINAÇÃO, PRODUÇÃO, PRONTO, FINALIZADO
- `status` - ATIVO, INATIVO
- `data_inicio` - Data início (formato: YYYY-MM-DD)
- `data_fim` - Data fim (formato: YYYY-MM-DD)
- `page` - Página (padrão: 1)
- `limite` - Itens por página (padrão: 20, máx: 100)

**Resultado:**  

Lista consolidada do histórico de lotes pronta para renderização.

---

### `7.2 GET /relatorios/movimentacoes`

**Caso de Uso:**  
Listar de forma analítica todas as entradas, saídas e ajustes de estoque do viveiro.

---

**Regras de Negócio:**

- **Rastreabilidade de Origem/Destino:**  
  O retorno deve obrigatoriamente trazer as justificativas (ex: "Coleta em campo", "Doação") e o usuário responsável pela ação.

- **Tipos de Movimentação:**  
  ENTRADA, SAIDA, AJUSTE, PERDA, EXPEDICAO, MORTALIDADE.

---

**Filtros Disponíveis:**
- `especie_id` - ID da espécie
- `usuario_id` - ID do usuário que realizou a ação
- `lote_id` - ID do lote
- `tipo` - Tipo de movimentação (ENTRADA, SAIDA, AJUSTE, PERDA, EXPEDICAO, MORTALIDADE)
- `data_inicio` - Data início (formato: YYYY-MM-DD)
- `data_fim` - Data fim (formato: YYYY-MM-DD)
- `page` - Página (padrão: 1)
- `limite` - Itens por página (padrão: 20, máx: 100)

**Resultado:**  
Histórico físico do inventário em um período determinado.

---

### `7.3 GET /relatorios/mortalidade`

**Caso de Uso:**  
Gerar consolidados analíticos sobre perdas de mudas no cultivo para identificar gargalos de manejo e pragas.

---

**Regras de Negócio:**

- **Filtros Obrigatórios:**  
  `data_inicio` e `data_fim` são obrigatórios para este relatório.

- **Retorno de Relacionamentos:**  
  Trazer as justificativas preenchidas nos registros de mortalidade para análise qualitativa.

---

**Filtros Disponíveis:**
- `especie_id` - ID da espécie (opcional)
- `data_inicio` - **Data início (obrigatório)** - formato: YYYY-MM-DD
- `data_fim` - **Data fim (obrigatório)** - formato: YYYY-MM-DD
- `page` - Página (padrão: 1)
- `limite` - Itens por página (padrão: 20, máx: 100)

**Resultado:**  

Estrutura de dados contendo o detalhamento dos óbitos das plantas com justificativas.

---

### `7.4 GET /relatorios/especies`

**Caso de Uso:**  
Gerar relatório de todas as espécies cadastradas no viveiro com informações consolidadas sobre estoque.

---

**Regras de Negócio:**

- **Consolidação de Dados:**  
  Trazer nome popular, nome científico, categoria, tipo (semente ou muda) e quantidade atual em estoque.

- **Filtros Avançados:**  
  Permitir filtros por categoria (arbórea, frutífera, ornamental, nativa, exótica) e tipo de propagação.

---

**Filtros Disponíveis:**
- `nome` - Nome científico (busca parcial)
- `categoria` - ARBOREA, FRUTIFERA, ORNAMENTAL, NATIVA, EXOTICA
- `tipo` - SEMENTE, MUDA
- `status` - ATIVO, INATIVO
- `page` - Página (padrão: 1)
- `limite` - Itens por página (padrão: 20, máx: 100)

**Resultado:**  

Lista de espécies com informações consolidadas de estoque.

---

### `7.5 GET /relatorios/estufas`

**Caso de Uso:**  
Gerar relatório de ocupação e capacidade das estufas para otimização de uso do espaço físico.

---

**Regras de Negócio:**

- **Informações de Ocupação:**  
  Trazer localização, capacidade total e status (Livre, Ocupada, Manutenção, Inativa).

- **Filtros Geográficos:**  
  Permitir busca por localização (estufa, barraca, posição) para relatórios setorizados.

---

**Filtros Disponíveis:**
- `busca` - Busca em código, localização, barraca ou posição
- `localizacao_estufa` - Localização da estufa
- `localizacao_barraca` - Localização da barraca
- `localizacao_posicao` - Posição/fileira
- `status` - Livre, Ocupada, Indisponível, Manutenção, Inativo
- `capacidade_minima` - Capacidade mínima
- `capacidade_maxima` - Capacidade máxima
- `page` - Página (padrão: 1)
- `limite` - Itens por página (padrão: 20, máx: 100)

**Resultado:**  

Lista de estufas com informações de localização e ocupação.

---

### `7.6 GET /relatorios/usuarios`

**Caso de Uso:**  
Gerar relatório de todos os usuários do sistema para fins administrativos (apenas Administrador).

---

**Regras de Negócio:**

- **Restrição de Acesso:**  
  Apenas usuários com role **Administrador** podem acessar este relatório.

- **Dados de Usuário:**  
  Trazer nome, CPF, e-mail, cargo, status e data de registro.

---

**Filtros Disponíveis:**
- `nome` - Nome (busca parcial)
- `cpf` - CPF (busca parcial)
- `cargo` - ADMINISTRADOR, OPERADOR
- `status` - ATIVO, INATIVO, PENDENTE
- `page` - Página (padrão: 1)
- `limite` - Itens por página (padrão: 20, máx: 100)

**Resultado:**  

Lista de usuários do sistema com informações administrativas.

---

### `7.7 GET /relatorios/destinatarios`

**Caso de Uso:**  
Gerar relatório de destinatários (recebedores de mudas) para rastreamento de expedições.

---

**Regras de Negócio:**

- **Tipos de Destinatário:**  
  Pessoa Física (CPF) ou Pessoa Jurídica (CNPJ) em categorias Pública, Privada ou Social.

- **Rastreamento de Expedições:**  
  Trazer contato, localização e histórico de recebimentos associados.

---

**Filtros Disponíveis:**
- `nome` - Nome ou razão social (busca parcial)
- `email` - E-mail (busca parcial)
- `documento` - CPF/CNPJ (busca parcial)
- `tipo` - FISICA, JURIDICA
- `categoria` - PUBLICA, PRIVADA, SOCIAL
- `status` - ATIVO, INATIVO
- `page` - Página (padrão: 1)
- `limite` - Itens por página (padrão: 20, máx: 100)

**Resultado:**  

Lista de destinatários com informações de contato e status.

---

### `7.8 GET /relatorios/auditoria`

**Caso de Uso:**  
Monitorar e rastrear de forma imutável todas as ações executadas no sistema (apenas Administrador).

---

**Regras de Negócio:**

- **Controle de Permissão Rígido:**  
  Assegurar via middleware que apenas usuários com a role "Administrador" possam consumir este endpoint.

- **Ações Rastreadas:**  
  CRIAR, ATUALIZAR, INATIVAR, EDITAR de todas as entidades (Espécie, Movimentação, Lote, Estufa, Usuário, Destinatário, Login/Logout).

- **Retorno de Relacionamentos:**  
  Retornar cronologicamente o "Quem" (Usuário), "O Quê" (Ação) e o "Quando" (Data e hora da ação).

---

**Filtros Disponíveis:**
- `usuario_id` - ID do usuário que realizou a ação
- `acao` - Ação específica (CRIAR_ESPECIE, ATUALIZAR_ESPECIE, INATIVAR_ESPECIE, CRIAR_MOVIMENTACAO, etc)
- `data_inicio` - Data e hora início (ISO 8601)
- `data_fim` - Data e hora fim (ISO 8601)
- `page` - Página (padrão: 1)
- `limite` - Itens por página (padrão: 20, máx: 100)

**Resultado:**  

Lista cronológica, não-editável e rastreável dos eventos do sistema com identificação de responsável e tipo de ação.

---