# Plano de Teste ENDPOINT - Espécie 

## Identificação
- **Módulo testado**: Espécies (Rotas, Controllers, Services e Repositories acoplados)
- **Ferramentas utilizadas**: Supertest, Jest, MongoDB (Banco Real testado via MongoDB Compass)
- **Responsável**: José Martines

---

## Objetivo
Garantir que a API de Espécies processe corretamente as requisições HTTP de ponta a ponta, validando o cadastro, listagem, atualização e consulta de histórico das espécies botânicas do viveiro. Além de assegurar que as regras de negócio intrínsecas (como blindagem de estoque, geração automática de movimentação de entrada no saldo inicial e registro de auditoria) estão perfeitamente interligadas, protegidas via autenticação e refletindo corretamente no banco de dados real.

---

## Ambiente de Teste
- **Banco de dados**: MongoDB Real, em uma base separada para evitar deleção de dados de desenvolvimento `viveiro_dev`.
- **Estado do Banco**: Populado dinamicamente via arquivo `seedViveiroMunicipal.js` no `beforeAll` da rota.
- **Framework de testes**: Jest + Supertest
- **Comando de execução**: `npm run test`
- **Local dos testes**: `src/test/routes/especie.test.js`

---

## Casos de Teste Planejados


## POST /especies

| ID   | Funcionalidade               | Pré-condições                           | Comportamento Esperado                                    | Passos                                         | Verificações                                                                             | Critérios de Aceite                                 |
| ---- | ---------------------------- | --------------------------------------- | --------------------------------------------------------- | ---------------------------------------------- | ---------------------------------------------------------------------------------------- | --------------------------------------------------- |
| TC01 | Cadastro de espécie válido   | Usuário autenticado (Admin ou Operador) | Espécie com dados válidos deve ser salva com saldo zerado | Enviar POST /especies com body válido          | Status 201; body: { _id, nome_popular, variedade, categoria, tipo, quantidade_atual: 0 } | Espécie salva com quantidade_atual=0 e status ATIVO |
| TC02 | Campos obrigatórios ausentes | Usuário autenticado (Admin ou Operador) | Cadastro deve falhar se faltar campo obrigatório          | Enviar POST /especies sem nome_popular         | Status 400; body com mensagem de erro de validação                                       | A operação falha com erro de validação (required)   |
| TC03 | Sem autenticação             | Nenhuma                                 | Requisição sem token deve ser bloqueada                   | Enviar POST /especies sem header Authorization | Status 401 Unauthorized                                                                  | Acesso negado sem token válido                      |



## GET /especies

| ID   | Funcionalidade             | Pré-condições                              | Comportamento Esperado                                          | Passos                                          | Verificações                                                                 | Critérios de Aceite                                                  |
|------|----------------------------|--------------------------------------------|-----------------------------------------------------------------|-------------------------------------------------|------------------------------------------------------------------------------|----------------------------------------------------------------------|
| TC04 | Listagem de espécies       | Usuário autenticado (Admin ou Operador)    | Deve retornar todas as espécies cadastradas com paginação       | Enviar GET /especies                            | Status 200; body: array paginado com campos: _id, nome_popular, variedade, quantidade_atual | Resposta contém array com espécies e metadados de paginação    |
| TC05 | Filtro por categoria       | Usuário autenticado (Admin ou Operador)    | Deve retornar apenas espécies da categoria informada            | Enviar GET /especies?categoria=ARBOREA          | Status 200; todos os itens do body com categoria=ARBOREA                     | Lista filtrada retorna somente espécies da categoria solicitada      |
| TC06 | Filtro por tipo            | Usuário autenticado (Admin ou Operador)    | Deve retornar apenas espécies do tipo informado                 | Enviar GET /especies?tipo=SEMENTE               | Status 200; todos os itens do body com tipo=SEMENTE                          | Lista filtrada retorna somente espécies do tipo solicitado           |
| TC07 | Sem autenticação           | Nenhuma                                    | Requisição sem token deve ser bloqueada                         | Enviar GET /especies sem header Authorization   | Status 401 Unauthorized                                                      | Acesso negado sem token válido                                       |



## GET /especies/:id

| ID   | Funcionalidade             | Pré-condições                              | Comportamento Esperado                                          | Passos                                          | Verificações                                                                 | Critérios de Aceite                                                  |
|------|----------------------------|--------------------------------------------|-----------------------------------------------------------------|-------------------------------------------------|------------------------------------------------------------------------------|----------------------------------------------------------------------|
| TC08 | Busca por ID válido        | Usuário autenticado (Admin ou Operador)    | Deve retornar os dados completos da espécie solicitada          | Enviar GET /especies/:id com ID existente       | Status 200; body: { _id, nome_popular, nome_cientifico, variedade, categoria, tipo, quantidade_atual } | Retorna objeto completo da espécie                            |
| TC09 | ID inexistente             | Usuário autenticado (Admin ou Operador)    | Deve retornar erro quando espécie não for encontrada            | Enviar GET /especies/:id com ID inexistente     | Status 404; body com mensagem de erro                                        | Operação falha com erro 404 Not Found                                |
| TC10 | ID em formato inválido     | Usuário autenticado (Admin ou Operador)    | Deve retornar erro quando o ID não for um ObjectId válido       | Enviar GET /especies/id-invalido                | Status 400; body com mensagem de validação                                   | Operação falha com erro 400 Bad Request                              |
| TC11 | Sem autenticação           | Nenhuma                                    | Requisição sem token deve ser bloqueada                         | Enviar GET /especies/:id sem header Authorization | Status 401 Unauthorized                                                    | Acesso negado sem token válido                                       |



## PATCH /especies/:id

| ID   | Funcionalidade             | Pré-condições                              | Comportamento Esperado                                          | Passos                                                           | Verificações                                                                 | Critérios de Aceite                                                        |
|------|----------------------------|--------------------------------------------|-----------------------------------------------------------------|------------------------------------------------------------------|------------------------------------------------------------------------------|----------------------------------------------------------------------------|
| TC12 | Atualização válida         | Usuário autenticado (Admin ou Operador)    | Deve atualizar os campos permitidos e registrar auditoria       | Enviar PATCH /especies/:id com body válido                       | Status 200; body com campos atualizados; data_att preenchida                 | Espécie atualizada reflete os novos dados                                  |
| TC13 | Blindagem de quantidade    | Usuário autenticado (Admin ou Operador)    | Campo quantidade_atual deve ser ignorado mesmo se enviado       | Enviar PATCH /especies/:id com { quantidade_atual: 999 }         | Status 200; body.quantidade_atual diferente de 999                           | Campo quantidade_atual não é alterado via PATCH                            |
| TC14 | Blindagem de tipo          | Usuário autenticado (Admin ou Operador)    | Campo tipo deve ser ignorado mesmo se enviado                   | Enviar PATCH /especies/:id com { tipo: "MUDA" }                  | Status 200; body.tipo sem alteração                                          | Campo tipo não é alterado via PATCH                                        |
| TC15 | ID inexistente             | Usuário autenticado (Admin ou Operador)    | Deve retornar erro quando espécie não for encontrada            | Enviar PATCH /especies/:id com ID inexistente                    | Status 404; body com mensagem de erro                                        | Operação falha com erro 404 Not Found sem salvar no banco                  |
| TC16 | Sem autenticação           | Nenhuma                                    | Requisição sem token deve ser bloqueada                         | Enviar PATCH /especies/:id sem header Authorization              | Status 401 Unauthorized                                                      | Acesso negado sem token válido                                             |



## GET /especies/:id/historico

| ID   | Funcionalidade             | Pré-condições                              | Comportamento Esperado                                          | Passos                                                        | Verificações                                                                          | Critérios de Aceite                                               |
|------|----------------------------|--------------------------------------------|-----------------------------------------------------------------|---------------------------------------------------------------|---------------------------------------------------------------------------------------|-------------------------------------------------------------------|
| TC17 | Histórico de espécie válida | Usuário autenticado (Admin ou Operador)   | Deve retornar lista cronológica de movimentações da espécie     | Enviar GET /especies/:id/historico com ID existente           | Status 200; body: array com campos: data, acao, quantidade, justificativa, usuario    | Retorna histórico completo de movimentações da espécie            |
| TC18 | Espécie inexistente        | Usuário autenticado (Admin ou Operador)    | Deve retornar erro quando espécie não for encontrada            | Enviar GET /especies/:id/historico com ID inexistente         | Status 404; body com mensagem de erro                                                 | Operação falha com erro 404 Not Found                             |
| TC19 | Sem autenticação           | Nenhuma                                    | Requisição sem token deve ser bloqueada                         | Enviar GET /especies/:id/historico sem header Authorization   | Status 401 Unauthorized                                                               | Acesso negado sem token válido                                    |

--- 

## Cobertura de Testes
- **Integração de Middlewares**: Confirma se o token validado no `AuthMiddleware` injeta o usuário responsável nos logs de auditoria.
- **Zod Validation**: Confirmação das dependências lógicas (ex: campos obrigatórios ausentes retornam 400 antes de chegar no Service).
- **Blindagem de Estoque Real**: Os campos `quantidade_atual` e `tipo` são verificados diretamente na collection persistida no MongoDB após tentativa de alteração via PATCH, confirmando que permanecem inalterados.
- **Encadeamento MongoDB**: O teste confirma que a rota aciona corretamente os models, persistindo os relacionamentos (Populates) entre `Especie`, `Movimentacao` e `Usuario`.
- **Auditoria**: Confirma que toda operação de escrita gera um registro na collection `logs_auditoria` com o usuário responsável.

---

## Conclusão
A execução deste plano garante a segurança do fluxo de cadastro e controle de estoque da Sementeira, e a correta manipulação dos dados no banco MongoDB. Como os testes rodam contra uma instância real, eventuais falhas de blindagem ou mapeamento indevido no Mongoose podem ser inspecionadas diretamente via MongoDB Compass assim que o teste abortar ou falhar.