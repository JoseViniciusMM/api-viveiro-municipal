# Documentação de Testes de Integração (End-to-End) - Lotes

## Identificação
- **Módulo testado**: Lotes (Rotas, Controllers, Services e interações com Estufa/Movimentação/Especie)
- **Ferramentas utilizadas**: Supertest, Jest, MongoDB (Banco Real testado via MongoDB Compass)
- **Responsáveis**: Gabriel Ciconello

---

## Objetivo
Garantir que a API de Lotes gerencie corretamente o ciclo de vida da produção botânica de ponta a ponta. Isso inclui a criação do lote (abatendo o estoque de sementes e ocupando estufas), transições de fases biológicas, registro de perdas (mortalidade), transferências físicas entre estufas e o cancelamento/descarte, validando os limites matemáticos de capacidade a cada requisição.

---

## Ambiente de Teste
- **Banco de dados**: MongoDB Real local `viveiro_dev`.
- **Estado do Banco**: Populado dinamicamente via arquivo `seedViveiroMunicipal.js` no `beforeAll` da rota.
- **Comando de execução**: `npm run test`
- **Local dos testes**: `src/test/routes/lote.test.js`

---

## Casos de Teste Planejados

### Autenticação e Autorização
| ID   | Descrição                                           | Rota Testada                        | Resultado Esperado                                  |
|------|-----------------------------------------------------|-------------------------------------|-----------------------------------------------------|
| TC01 | Bloquear acesso sem token JWT                       | `GET /lotes`                        | HTTP 498/401 - Retorna erro de "Token não informado"|

### Abertura de Lotes e Controle de Espaço Físico/Estoque
| ID   | Descrição                                           | Rota Testada                        | Resultado Esperado                                  |
|------|-----------------------------------------------------|-------------------------------------|-----------------------------------------------------|
| TC02 | Registrar novo Lote com sucesso                     | `POST /lotes`                       | HTTP 201 - Lote criado, Estufa ocupada, Sementeira sofre Saída |
| TC03 | Bloquear Lote se quantidade for maior que a Sementeira | `POST /lotes`                    | HTTP 400 - Impede saldo negativo na Espécie base    |
| TC04 | Bloquear Lote se exceder capacidade da Estufa       | `POST /lotes`                       | HTTP 400 - Lança erro de Overflow (Estufa lotada)   |
| TC05 | Bloquear Lote em Estufa em Manutenção/Indisponível  | `POST /lotes`                       | HTTP 400 - Erro ao tentar usar Estufa não Livre     |
| TC06 | Bloquear payload de criação com dados faltando      | `POST /lotes`                       | HTTP 400 - Erro de validação Zod (ex: sem estufa_id)|

### Manejo, Evolução Biológica e Transferência
| ID   | Descrição                                           | Rota Testada                        | Resultado Esperado                                  |
|------|-----------------------------------------------------|-------------------------------------|-----------------------------------------------------|
| TC07 | Atualizar fase biológica do lote (ex: Produção)     | `PATCH /lotes/:id/fase`             | HTTP 200 - Fase atualizada no banco                 |
| TC08 | Alterar lote para "Finalizado" libera a Estufa      | `PATCH /lotes/:id/fase`             | HTTP 200 - Fase = FINALIZADO, Estufa passa a LIVRE  |
| TC09 | Registrar Mortalidade no Lote                       | `POST /lotes/:id/mortalidade`       | HTTP 201 - Saldo reduz, gera mov. de MORTALIDADE    |
| TC10 | Bloquear Mortalidade superior ao saldo do lote      | `POST /lotes/:id/mortalidade`       | HTTP 400 - Impede saldo do lote ficar negativo      |
| TC11 | Transferir Lote para nova Estufa com espaço         | `PATCH /lotes/:id/transferir`       | HTTP 200 - Origem liberada, Destino Ocupada         |
| TC12 | Bloquear transferência para Estufa sem espaço       | `PATCH /lotes/:id/transferir`       | HTTP 400 - Erro de limite de capacidade física      |

### Cancelamento e Descarte
| ID   | Descrição                                           | Rota Testada                        | Resultado Esperado                                  |
|------|-----------------------------------------------------|-------------------------------------|-----------------------------------------------------|
| TC13 | Deletar/Descartar lote gerando Perda Total          | `DELETE /lotes/:id`                 | HTTP 200 - Soft delete, Mov. de PERDA TOTAL criada, Estufa Livre |

### Listagens, Detalhes e Rastreabilidade
| ID   | Descrição                                           | Rota Testada                        | Resultado Esperado                                  |
|------|-----------------------------------------------------|-------------------------------------|-----------------------------------------------------|
| TC14 | Listar lotes com paginação padrão                   | `GET /lotes`                        | HTTP 200 - Array paginado com dados básicos         |
| TC15 | Listar lotes utilizando filtro de `fase`            | `GET /lotes?fase=PRONTO`            | HTTP 200 - Retorna apenas lotes na fase "PRONTO"    |
| TC16 | Visualizar detalhes completos do lote por ID        | `GET /lotes/:id`                    | HTTP 200 - Objeto detalhado preenchido via `populate`|
| TC17 | Retornar 404 ao buscar Lote inexistente             | `GET /lotes/:id`                    | HTTP 404 - Registro não encontrado                  |
| TC18 | Buscar histórico/linha do tempo biológica do lote   | `GET /lotes/:id/historico`          | HTTP 200 - Logs e Movimentações unificadas          |

---

## Cobertura de Testes
- **Integração de Múltiplos Services**: Confirma se a chamada na rota de `/lotes` de fato atinge e altera os modelos de `Estufa`, `Especie` e `Movimentacao`.
- **Zod Validation**: Confirma as dependências lógicas nos payloads de manejo biológico e alocação física.
- **Trava de Espaço e Saldo**: Validação restrita simulando superlotação intencional nas estufas e o consumo indevido das sementes, garantindo que a resposta devolvida seja sempre `400 Bad Request` com a mensagem técnica clara (sem crash do sistema).
- **Integridade de Fases Biológicas**: Validação das automações de status físicos. O lote precisa liberar a estufa alvo sem qualquer intervenção humana extra ao ser Finalizado, Transferido ou Deletado.

---

## Conclusão
A execução com êxito destes testes de integração end-to-end prova que a API assegura perfeitamente o ciclo de cultivo de viveiros florestais. Ele atesta não somente o registro das ações, mas os impactos estruturais transversais garantindo a impossibilidade de estufas "fantasmas" ou duplicadas.
