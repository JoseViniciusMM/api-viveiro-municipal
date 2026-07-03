# Documentação de Testes de Integração (End-to-End) - Relatórios

## Identificação
- **Módulo testado**: Relatórios (Rotas, Controllers, Services)
- **Ferramentas utilizadas**: Supertest, Jest, MongoDB em memória
- **Responsáveis**: Equipe de Desenvolvimento

---

## Objetivo
Garantir que a API de Relatórios retorne dados filtrados e paginados corretamente para diferentes entidades do viveiro (lotes, movimentações, mortalidade, espécies, estufas, usuários, destinatários e auditoria). Validar autenticação, permissões de acesso e comportamento dos filtros obrigatórios.

---

## Ambiente de Teste
- **Banco de dados**: MongoDB em memória populado dinamicamente
- **Estado do Banco**: Inicializado e limpo a cada suíte de testes pelo arquivo `seedViveiroMunicipal.js`
- **Comando de execução**: `npm run test`
- **Local dos testes**: `src/test/unit/routes/relatorioRoute.test.js`

---

## Casos de Teste Planejados

### Autenticação Geral
| ID   | Descrição                                           | Rota Testada                        | Resultado Esperado                                  |
|------|-----------------------------------------------------|-------------------------------------|-----------------------------------------------------|
| TC01 | Bloquear acesso sem token de autenticação           | `GET /relatorios/*`                 | HTTP 498 - Token não informado.                     |

### Listagem de Lotes
| ID   | Descrição                                           | Rota Testada                        | Resultado Esperado                                  |
|------|-----------------------------------------------------|-------------------------------------|-----------------------------------------------------|
| TC02 | Listar lotes com autenticação                       | `GET /relatorios/lotes`             | HTTP 200 - Retorna array paginado com `docs`.       |
| TC03 | Listar lotes com paginação                          | `GET /relatorios/lotes?page=1&limite=5` | HTTP 200 - Retorna `docs` com limite aplicado.    |

### Listagem de Movimentações
| ID   | Descrição                                           | Rota Testada                        | Resultado Esperado                                  |
|------|-----------------------------------------------------|-------------------------------------|-----------------------------------------------------|
| TC04 | Listar movimentações com autenticação               | `GET /relatorios/movimentacoes`     | HTTP 200 - Retorna array paginado com `docs`.       |
| TC05 | Listar movimentações com paginação                  | `GET /relatorios/movimentacoes?page=1&limite=10` | HTTP 200 - Retorna `docs` com limite aplicado. |

### Listagem de Mortalidade
| ID   | Descrição                                           | Rota Testada                        | Resultado Esperado                                  |
|------|-----------------------------------------------------|-------------------------------------|-----------------------------------------------------|
| TC06 | Listar mortalidade com filtro de datas obrigatório  | `GET /relatorios/mortalidade?data_inicio=X&data_fim=Y` | HTTP 200 - Retorna dados de mortalidade filtrados. |
| TC07 | Bloquear mortalidade sem filtro de datas            | `GET /relatorios/mortalidade`       | HTTP 500 - Erro: filtros obrigatórios faltando.     |

### Listagem de Espécies
| ID   | Descrição                                           | Rota Testada                        | Resultado Esperado                                  |
|------|-----------------------------------------------------|-------------------------------------|-----------------------------------------------------|
| TC08 | Listar espécies com autenticação                    | `GET /relatorios/especies`          | HTTP 200 - Retorna array paginado com `docs`.       |
| TC09 | Listar espécies com paginação                       | `GET /relatorios/especies?page=1&limite=10` | HTTP 200 - Retorna `docs` com limite aplicado. |

### Listagem de Estufas
| ID   | Descrição                                           | Rota Testada                        | Resultado Esperado                                  |
|------|-----------------------------------------------------|-------------------------------------|-----------------------------------------------------|
| TC10 | Listar estufas com autenticação                     | `GET /relatorios/estufas`           | HTTP 200 - Retorna array paginado com `docs`.       |
| TC11 | Listar estufas com paginação                        | `GET /relatorios/estufas?page=1&limite=10` | HTTP 200 - Retorna `docs` com limite aplicado. |

### Listagem de Usuários
| ID   | Descrição                                           | Rota Testada                        | Resultado Esperado                                  |
|------|-----------------------------------------------------|-------------------------------------|-----------------------------------------------------|
| TC12 | Listar usuários com autenticação                    | `GET /relatorios/usuarios`          | HTTP 200 - Retorna array paginado com `docs`.       |
| TC13 | Listar usuários com paginação                       | `GET /relatorios/usuarios?page=1&limite=10` | HTTP 200 - Retorna `docs` com limite aplicado. |

### Listagem de Destinatários
| ID   | Descrição                                           | Rota Testada                        | Resultado Esperado                                  |
|------|-----------------------------------------------------|-------------------------------------|-----------------------------------------------------|
| TC14 | Listar destinatários com autenticação               | `GET /relatorios/destinatarios`     | HTTP 200 - Retorna array paginado com `docs`.       |
| TC15 | Listar destinatários com paginação                  | `GET /relatorios/destinatarios?page=1&limite=10` | HTTP 200 - Retorna `docs` com limite aplicado. |

### Listagem de Auditoria
| ID   | Descrição                                           | Rota Testada                        | Resultado Esperado                                  |
|------|-----------------------------------------------------|-------------------------------------|-----------------------------------------------------|
| TC16 | Listar auditoria com autenticação                   | `GET /relatorios/auditoria`         | HTTP 200 - Retorna array paginado com `docs`.       |
| TC17 | Listar auditoria com paginação                      | `GET /relatorios/auditoria?page=1&limite=10` | HTTP 200 - Retorna `docs` com limite aplicado. |

---

## Cobertura de Testes
- **Autenticação**: Verifica bloqueio de acesso sem token JWT válido
- **Paginação**: Confirma que os parâmetros `page` e `limite` funcionam corretamente em todos os endpoints
- **Filtros Obrigatórios**: Valida que o endpoint de mortalidade rejeita requisições sem os filtros de data obrigatórios
- **Integridade dos Dados**: Garante que os dados retornados contêm a estrutura esperada (`docs`, `totalDocs`, `totalPages`)

---

## Conclusão
A execução com êxito destes testes de integração confirma que a API de Relatórios funciona corretamente, retornando dados paginados e filtrados para todos os endpoints, com validação robusta de autenticação e tratamento apropriado de requisições inválidas.
