## 8. Dashboard e Início (/dashboard)

### `8.1 GET /dashboard/geral`

**Caso de Uso:**  
Centralizar indicadores de desempenho (KPIs) e dados gráficos em uma única chamada para a visão gerencial do viveiro.

---

**Regras de Negócio:**

- **Agregação Dinâmica:**  
  Realiza o cruzamento de dados das coleções de Lotes, Movimentações e Estufas no momento da requisição (sem salvar dados duplicados).

- **Indicadores de Resumo (Cards):**  
  Retorna os totais de mudas prontas (fase "Pronto"), lotes ativos, saldo da sementeira e a porcentagem global de mortalidade.

- **Métricas Visuais:**  
  Processa o histórico de saídas por período e a taxa de ocupação por setor (Ocupado vs. Disponível).

- **Sistema de Alertas:**  
  Filtra e retorna automaticamente lotes com alta mortalidade ou estufas que atingiram 100% de ocupação.

---

**Resultado:**

Objeto JSON completo para alimentar todos os componentes da tela de Início (Status 200).