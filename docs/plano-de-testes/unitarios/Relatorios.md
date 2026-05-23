# Documentação de Testes - Relatório

## Identificação
- **Módulo testado**: Relatório (RelatorioService)
- **Ferramentas utilizadas**: Jest, Mocks Genéricos
- **Responsável**: José

---

## Objetivo
Verificar se o serviço `RelatorioService` repassa corretamente os filtros e parâmetros de paginação aos repositórios de Lote e Movimentação, e se a geração do relatório de mortalidade aplica obrigatoriamente o filtro de período e força o tipo `MORTALIDADE` na consulta, impedindo que registros de outros tipos contaminem o consolidado de perdas.

---

## Ambiente de Teste
- Banco de dados: Mocks Genéricos
- Framework de testes: Jest
- Comando de execução: `npm run test`
- Local dos testes: `src/test/unit/services/relatorio.test.js`

---

## Casos de Teste Implementados

| ID   | Descrição                                           | Método testado                      | Resultado Esperado                                  |
|------|-----------------------------------------------------|-------------------------------------|-----------------------------------------------------|
| TC01 | Repassar filtros e paginação ao listar lotes        | `RelatorioService.listarLotes`      | loteRepository.listar chamado com parâmetros corretos |
| TC02 | Usar valores padrão de page e limit em lotes        | `RelatorioService.listarLotes`      | page=1 e limit=20 aplicados automaticamente         |
| TC03 | Repassar filtros e paginação ao listar movimentações| `RelatorioService.listarMovimentacoes` | movimentacaoRepository.listar chamado corretamente |
| TC04 | Usar valores padrão de page e limit em movimentações| `RelatorioService.listarMovimentacoes` | page=1 e limit=20 aplicados automaticamente        |
| TC05 | Lançar erro quando data_inicio não é informada      | `RelatorioService.listarMortalidade`| Lança Error com mensagem de filtro obrigatório      |
| TC06 | Lançar erro quando data_fim não é informada         | `RelatorioService.listarMortalidade`| Lança Error com mensagem de filtro obrigatório      |
| TC07 | Lançar erro quando nenhuma data é informada         | `RelatorioService.listarMortalidade`| Lança Error com mensagem de filtro obrigatório      |
| TC08 | Forçar tipo MORTALIDADE quando datas são informadas | `RelatorioService.listarMortalidade`| movimentacaoRepository chamado com tipo MORTALIDADE |
| TC09 | Incluir filtros extras junto com o tipo MORTALIDADE | `RelatorioService.listarMortalidade`| especie_id e tipo MORTALIDADE presentes no filtro   |

---

## Cobertura de Testes
- Cobertura total das operações lógicas contidas no `RelatorioService`.
- Validação obrigatória de datas no relatório de mortalidade coberta em todos os cenários de falha.
- Garantia de que o tipo `MORTALIDADE` é sempre injetado no filtro, impedindo contaminação por outros tipos de movimentação.

---

## Execução e Resultados

```bash
PASS  src/test/unit/services/relatorio.test.js
  listarLotes
    ✓ deve chamar loteRepository.listar com filtros e paginação corretos
    ✓ deve usar valores padrão quando page e limit não são informados
  listarMovimentacoes
    ✓ deve chamar movimentacaoRepository.listar com filtros e paginação corretos
    ✓ deve usar valores padrão quando page e limit não são informados
  listarMortalidade
    ✓ deve lançar erro quando data_inicio não é informada
    ✓ deve lançar erro quando data_fim não é informada
    ✓ deve lançar erro quando nenhuma data é informada
    ✓ deve chamar movimentacaoRepository com tipo MORTALIDADE quando datas são informadas
    ✓ deve incluir filtros extras como especie_id junto com o tipo MORTALIDADE
```

---

## Conclusão
Os testes unitários garantem que o `RelatorioService` está implementado corretamente, repassando os parâmetros sem transformações indevidas e protegendo o relatório de mortalidade contra consultas sem período definido, assegurando a integridade analítica dos dados gerados para a gestão do viveiro.

---

## Histórico
- Criado em: 10/05/2026
- Última atualização: 11/05/2026