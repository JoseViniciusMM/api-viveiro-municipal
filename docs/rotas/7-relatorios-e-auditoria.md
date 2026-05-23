## 7. Relatórios e Auditoria (/relatorios e /auditoria)

### `7.1 GET /relatorios/lotes`

**Caso de Uso:**  
Gerar um relatório gerencial com o histórico completo dos ciclos de produção (do plantio à finalização).

---

**Regras de Negócio:**

- **Filtros Flexíveis:**  
  Permitir busca por intervalo de datas, espécie e fase atual.

- **Consolidação:**  
  O retorno deve trazer os dados mastigados (Sementes Iniciais vs. Quantidade Atual vs. Perdas Totais) para facilitar a visualização em tabela.

---

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

---

**Resultado:**  
Histórico físico do inventário em um período determinado.

---

### `7.3 GET /relatorios/mortalidade`

**Caso de Uso:**  
Gerar consolidados analíticos sobre perdas de mudas no cultivo para identificar gargalos de manejo e pragas.

---

**Regras de Negócio:**

- **Filtros Específicos:**  
  Obrigatório o filtro por intervalo de datas, com suporte a filtro por espécie botânica e estufa.

- **Retorno de Relacionamentos:**  
  Trazer as justificativas preenchidas nos registros de mortalidade para análise qualitativa.

---

**Resultado:**  

Estrutura de dados contendo o detalhamento dos óbitos das plantas.

---

### `7.4 GET /relatorios/:tipo/exportar`

**Caso de Uso:**  
Exportar os dados em tela (Lotes, Movimentações, Mortalidade ou Auditoria) para arquivos físicos.

---

**Regras de Negócio:**

- **Parametrização de Formato:**  
  A rota deve aceitar um parâmetro (ex: ?formato=pdf ou ?formato=excel) juntamente com os filtros aplicados em tela.

- **Geração Dinâmica:**  
  O servidor processa os dados e compila o arquivo de forma assíncrona.

---

**Resultado:**  

Retorna um Buffer/Stream do arquivo (binário) permitindo o download direto pelo navegador, sem expor caminhos internos do servidor.

---

### `7.5 GET /auditoria/logs`

**Caso de Uso:**  
Monitorar e rastrear de forma imutável todas as ações executadas no sistema PAMINE.

---

**Regras de Negócio:**

- **Controle de Permissão Rígido:**  
  Assegurar via middleware que apenas usuários com a role "Administrador" possam consumir este endpoint.

- **Retorno de Relacionamentos:**  
  Retornar cronologicamente o "Quem" (Usuário), "O Quê" (Ação: Criar, Editar, Excluir, Movimentar) e o "Onde" (Qual registro/ID sofreu a ação).

---

**Resultado:**  

Lista cronológica, não-editável e rastreável dos eventos do sistema.