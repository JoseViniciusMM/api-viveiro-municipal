# Documentação de Testes de Integração (End-to-End) - Movimentação

## Identificação
- **Módulo testado**: Movimentações (Rotas, Controllers, Services e Repositories acoplados)
- **Ferramentas utilizadas**: Supertest, Jest, MongoDB (Banco Real testado via MongoDB Compass)
- **Responsáveis**: Gabriel Ciconello

---

## Objetivo
Garantir que a API de Movimentações processe corretamente as requisições HTTP de ponta a ponta, validando a inserção correta de Entradas, Saídas, Ajustes, Mortalidades e Expedições. Além de assegurar que as regras de negócio intrínsecas (como cálculo automático de saldo na Espécie, estorno compensatório e exigência de vínculos em Lotes/Destinatários) estão perfeitamente interligadas, protegidas via autenticação e refletindo corretamente no banco de dados real.

---

## Ambiente de Teste
- **Banco de dados**: MongoDB Real, em uma base separada para evitar deleção de dados de desenvolvimento `viveiro_dev`.
- **Estado do Banco**: Populado dinamicamente via arquivo `seedViveiroMunicipal.js` no `beforeAll` da rota.
- **Framework de testes**: Jest + Supertest
- **Comando de execução**: `npm run test`
- **Local dos testes**: `src/test/routes/movimentacao.test.js`

---

## Casos de Teste Planejados

### Autenticação e Autorização
| ID   | Descrição                                           | Rota Testada                        | Resultado Esperado                                  |
|------|-----------------------------------------------------|-------------------------------------|-----------------------------------------------------|
| TC01 | Bloquear acesso sem token JWT                       | `GET /movimentacoes`                | HTTP 498/401 - Retorna erro de "Token não informado"|

### Criação de Movimentações e Regras de Saldo
| ID   | Descrição                                           | Rota Testada                        | Resultado Esperado                                  |
|------|-----------------------------------------------------|-------------------------------------|-----------------------------------------------------|
| TC02 | Registrar Entrada manual                            | `POST /movimentacoes`               | HTTP 201 - Saldo da espécie incrementado no banco   |
| TC03 | Registrar Saída manual                              | `POST /movimentacoes`               | HTTP 201 - Saldo da espécie decrementado no banco   |
| TC04 | Bloquear Saída que resulte em saldo negativo        | `POST /movimentacoes`               | HTTP 400 - Mensagem de erro de limite de estoque    |
| TC05 | Registrar Ajuste positivo ou negativo               | `POST /movimentacoes`               | HTTP 201 - Saldo alterado de acordo com o sinal     |
| TC06 | Bloquear payload com dados obrigatórios faltando    | `POST /movimentacoes`               | HTTP 400 - Erro de validação Zod (ex: sem justificativa)|
| TC07 | Registrar Mortalidade/Perda SEM informar `lote_id`  | `POST /movimentacoes`               | HTTP 400 - Exige o ID do Lote para tipo Mortalidade |
| TC08 | Registrar Mortalidade/Perda COM `lote_id` válido    | `POST /movimentacoes`               | HTTP 201 - Saldo do Lote (e espécie) decrementado   |
| TC09 | Registrar Expedição sem `destinatario_id`           | `POST /movimentacoes`               | HTTP 400 - Exige Destinatário para tipo Expedição   |
| TC10 | Registrar Expedição com `destinatario_id` válido    | `POST /movimentacoes`               | HTTP 201 - Movimentação criada vinculando Destinatário|

### Estornos
| ID   | Descrição                                           | Rota Testada                        | Resultado Esperado                                  |
|------|-----------------------------------------------------|-------------------------------------|-----------------------------------------------------|
| TC11 | Estornar uma movimentação de Entrada com sucesso    | `POST /movimentacoes/:id/estorno`   | HTTP 201 - Nova mov. inversa criada, saldo abatido  |
| TC12 | Bloquear estorno que cause saldo negativo na raiz   | `POST /movimentacoes/:id/estorno`   | HTTP 400 - Impede o estorno se o saldo ficar < 0    |
| TC13 | Bloquear estorno de movimentação já estornada       | `POST /movimentacoes/:id/estorno`   | HTTP 400 - Mensagem impedindo estorno duplo         |

### Listagens, Filtros e Paginação
| ID   | Descrição                                           | Rota Testada                        | Resultado Esperado                                  |
|------|-----------------------------------------------------|-------------------------------------|-----------------------------------------------------|
| TC14 | Listar movimentações com paginação padrão           | `GET /movimentacoes`                | HTTP 200 - Array paginado, ordem cronológica reversa|
| TC15 | Listar movimentações utilizando filtro de `tipo`    | `GET /movimentacoes?tipo=Entrada`   | HTTP 200 - Retorna apenas registros de "Entrada"    |
| TC16 | Visualizar os detalhes de uma movimentação por ID   | `GET /movimentacoes/:id`            | HTTP 200 - Objeto preenchido com dados via `populate`|
| TC17 | Retornar 404 ao buscar movimentação inexistente     | `GET /movimentacoes/:id`            | HTTP 404 - Registro não encontrado                  |
| TC18 | Listar histórico vinculado a uma única espécie      | `GET /movimentacoes/especie/:id`    | HTTP 200 - Apenas movimentações daquela semente     |
| TC19 | Listar histórico vinculado a um único lote          | `GET /movimentacoes/lote/:id`       | HTTP 200 - Apenas ações vinculadas à vida daquele lote|

---

## Cobertura de Testes
- **Integração de Middlewares**: Confirma se o token validado no `AuthMiddleware` injeta o usuário responsável nos logs.
- **Zod Validation**: Confirmação das dependências lógicas (Ex: "Se for EXPEDICAO, exige Destinatário").
- **Consistência de Saldo Real**: O saldo verificado diretamente na collection persistida no MongoDB não pode jamais ser menor que 0. Os testes simulam situações de erro e checam o reflexo no banco utilizando queries reais.
- **Encadeamento MongoDB**: O teste confirma que a rota aciona corretamente os modelos, persistindo os relacionamentos (Populates) entre `Movimentacao`, `Lote`, `Usuario`, `Especie` e `Destinatario`.

---

## Conclusão
A execução deste plano garante a segurança do fluxo transacional do Viveiro e a correta manipulação dos dados no banco MongoDB. Como os testes rodam contra uma instância real, eventuais falhas de concorrência ou mapeamento indevido no Mongoose podem ser inspecionadas diretamente via MongoDB Compass assim que o teste abortar ou falhar.