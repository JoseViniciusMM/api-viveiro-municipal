# Documentação de Testes - Movimentação (Estoque)

## Identificação
- **Módulo testado**: Movimentação (MovimentacaoService)
- **Ferramentas utilizadas**: Jest, Mocks de Multi-Repositorios Interligados
- **Responsável**: Gabriel

---

## Objetivo
Validar se o Service transacional processa perfeitamente os 5 tipos de eventos de estoque do sistema (Entrada, Saída, Mortalidade, Ajuste, Expedição), isolando matematicamente o saldo base da sementeira em relação ao saldo vivo da estufa e protegendo o mecanismo de Estorno financeiro/quantitativo.

---

## Ambiente de Teste
- Banco de dados: Mocks baseados no Mongoose
- Framework de testes: Jest
- Comando de execução: `npm run test`
- Local dos testes: `src/test/unit/services/movimentacaoService.test.js`

---

## Casos de Teste Implementados

| ID   | Descrição                                      | Método testado             | Resultado Esperado                         |
|------|------------------------------------------------|----------------------------|--------------------------------------------|
| TC01 | Registrar Entrada e somar na sementeira        | `MovimentacaoService.criar`| Atualiza saldo geral com sucesso           |
| TC02 | Registrar Saída reduzindo da sementeira        | `MovimentacaoService.criar`| Reduz saldo geral com sucesso              |
| TC03 | Erro ao transacionar espécie inexistente       | `MovimentacaoService.criar`| Lança CustomError (Espécie Inexistente)    |
| TC04 | Erro retirar quantidade maior que sementeira   | `MovimentacaoService.criar`| Lança CustomError (Saldo insuficiente)     |
| TC05 | Erro Expedição com destinatário 404 (nulo)     | `MovimentacaoService.criar`| Lança CustomError (Destino inválido)       |
| TC06 | Erro Expedição com destinatário INATIVO        | `MovimentacaoService.criar`| Lança CustomError (Destino inativo)        |
| TC07 | Registrar Mortalidade abatendo só do lote      | `MovimentacaoService.criar`| Saldo do lote cai, Sementeira Intacta      |
| TC08 | Erro Mortalidade ou Expedição sem Lote_id      | `MovimentacaoService.criar`| Lança CustomError (Lote obrigatório)       |
| TC09 | Erro ao abater mudas de lote 404 (inexistente) | `MovimentacaoService.criar`| Lança CustomError (Lote não encontrado)    |
| TC10 | Erro Expedição sem especificar Destinatário    | `MovimentacaoService.criar`| Lança CustomError (Destinatário faltante)  |
| TC11 | Registrar Expedição exclusiva no lote alvo     | `MovimentacaoService.criar`| Atualiza lote sem tocar sementeira         |
| TC12 | Registrar Ajuste transacionando a sementeira   | `MovimentacaoService.criar`| Quantidade ajustada diretamente            |
| TC13 | Erro expedindo quantidade além do limite lote  | `MovimentacaoService.criar`| Lança CustomError (Saldo exc Lote)         |
| TC14 | Retornar detalhes cruzados via ID              | `MovimentacaoService.buscarPorId`| Objeto com dados completo             |
| TC15 | Erro 404 em busca ID não catalogado            | `MovimentacaoService.buscarPorId`| Lança CustomError 404                 |
| TC16 | Listar aplicando filtros recebidos via URL     | `MovimentacaoService.listar`| Repositório ativado com params              |
| TC17 | Padrão page 1, limit 20 se payload query nulo  | `MovimentacaoService.listar`| Defaults de proteção injetados no repo      |
| TC18 | Estornar Entrada reduzindo sementeira e auditando| `MovimentacaoService.estornar`| Gera mov. e atualiza estoque especie    |
| TC19 | Bloquear estorno que zere espécie (-1 negativo)| `MovimentacaoService.estornar`| Lança erro p/ impedir saldo negativo      |
| TC20 | Estornar Expedição devolvendo plantas ao Lote  | `MovimentacaoService.estornar`| Lote é reestabelecido, sementeira intacta |
| TC21 | Estornar Mortalidade restaurando saldo do lote | `MovimentacaoService.estornar`| Saldo das plantas mortas "voltam à vida"  |
| TC22 | Bloquear estorno de Saída Original (Form.Lote) | `MovimentacaoService.estornar`| Erro: Lote inteiro precisa ser cancelado  |
| TC23 | Bloquear devolução para Lote Finalizado/Inativo| `MovimentacaoService.estornar`| Erro: Proteção contra renascimento        |

---

## Cobertura de Testes
- Cobertura total do complexo Switch Case de cálculos de operações do viveiro.
- Interligação com repositórios de Espécie, Destinatário e Lote testada ostensivamente contra saldos negativos.

---

## Execução e Resultados

```bash
PASS  src/test/unit/services/movimentacaoService.test.js
  ✓ deve registrar ENTRADA e incrementar o saldo da sementeira
  ✓ deve lançar erro ao tentar retirar uma quantidade maior que o saldo da sementeira
  ✓ deve registrar MORTALIDADE abatendo o saldo apenas do lote afetado
  ✓ deve bloquear o estorno caso a reversão deixe o saldo da sementeira negativo
  ✓ deve bloquear o estorno direto de uma SAÍDA que foi utilizada na criação de um lote
```

---

## Conclusão
Os testes garantem a impecabilidade da matemática da "Sementeira vs Barraca", protegendo ativamente o software de ficar com "estoque -5" ou falhas graves de estorno em lotes mortos.

---

## Histórico
- Criado em: 10/05/2026
- Última atualização: 10/05/2026