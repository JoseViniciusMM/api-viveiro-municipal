# Documentação de Testes - Dashboard

## Identificação
- **Módulo testado**: Dashboard (DashboardService)
- **Ferramentas utilizadas**: Jest, Mocks Genéricos de Repository
- **Responsável**: Lucas

---

## Objetivo
Verificar se a lógica do serviço do Dashboard consolida corretamente os indicadores do sistema, garantindo que os dados sejam retornados formatados e bloqueando ativamente requisições de usuários não autenticados.

---

## Ambiente de Teste
- Banco de dados: Mocks (Mongoose-like)
- Framework de testes: Jest
- Comando de execução: `npm run test`
- Local dos testes: `src/test/unit/services/dashboardService.test.js`

---

## Casos de Teste Implementados

| ID   | Descrição                                      | Método testado             | Resultado Esperado                         |
|------|------------------------------------------------|----------------------------|--------------------------------------------|
| TC01 | Retornar resumo completo para usuário logado   | `DashboardService.geral`   | Objeto com KPIs, estufas e alertas         |
| TC02 | Lançar erro 403 sem usuário autenticado (null) | `DashboardService.geral`   | Lança CustomError 403 (Acesso Negado)      |
| TC03 | Retornar os KPIs com os campos estruturados    | `DashboardService.geral`   | Retorna métricas de mudas e sementeira     |
| TC04 | Retornar dados com taxa de ocupação calculada  | `DashboardService.geral`   | Retorna totais de estufas livres/ocupadas  |
| TC05 | Retornar a seção de alertas críticos formatada | `DashboardService.geral`   | Array de lotes em risco e estufas lotadas  |

---

## Cobertura de Testes
- Cobertura total das validações de segurança da camada Service do Dashboard.
- Garantia de contrato da estrutura do objeto de resposta gerencial.

---

## Execução e Resultados

```bash
PASS  src/test/unit/services/dashboardService.test.js
  ✓ deve retornar o resumo completo do viveiro para um usuário autenticado
  ✓ deve lançar erro 403 ao tentar acessar o dashboard sem usuário autenticado
  ✓ deve retornar os KPIs com os campos corretos
  ✓ deve retornar os dados de estufas com taxa de ocupação calculada
  ✓ deve retornar a seção de alertas com lotes de alta mortalidade e estufas lotadas
```

---

## Conclusão
Os testes garantem que as informações vitais e o processamento dos indicadores agrários da tela inicial sejam entregues com segurança e confiabilidade, barrando conexões anônimas.