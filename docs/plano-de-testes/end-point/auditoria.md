# Documentação de Testes de Integração (End-to-End) - Auditoria

## Identificação
- **Módulo testado**: Auditoria (Rotas, Controllers, Logs de auditoria)
- **Ferramentas utilizadas**: Supertest, Jest, MongoDB em memória
- **Responsáveis**: Equipe de Desenvolvimento

---

## Objetivo
Garantir que a API de Auditoria registre corretamente todas as ações executadas no sistema e retorne logs filtrados e paginados com segurança. Validar autenticação, permissões de acesso exclusivo a administradores, filtros de data, usuário e ação, além de garantir a integridade das informações auditadas.

---

## Ambiente de Teste
- **Banco de dados**: MongoDB em memória populado dinamicamente
- **Estado do Banco**: Inicializado e limpo a cada suíte de testes pelo arquivo `seedViveiroMunicipal.js`
- **Comando de execução**: `npm run test`
- **Local dos testes**: `src/test/unit/routes/auditoriaRoute.test.js`

---

## Casos de Teste Planejados

### Autenticação e Autorização
| ID   | Descrição                                           | Rota Testada                        | Resultado Esperado                                  |
|------|-----------------------------------------------------|-------------------------------------|-----------------------------------------------------|
| TC01 | Bloquear acesso sem token de autenticação           | `GET /auditoria/logs`               | HTTP 498 - Token não informado.                     |
| TC02 | Bloquear acesso com usuário Operador (sem permissão) | `GET /auditoria/logs`              | HTTP 403 - Acesso negado: permissão insuficiente.   |
| TC03 | Permitir acesso com usuário Administrador           | `GET /auditoria/logs`               | HTTP 200 - Retorna array paginado com `docs`.       |

### Paginação
| ID   | Descrição                                           | Rota Testada                        | Resultado Esperado                                  |
|------|-----------------------------------------------------|-------------------------------------|-----------------------------------------------------|
| TC04 | Listar com paginação padrão                         | `GET /auditoria/logs`               | HTTP 200 - Retorna `page=1` e `limit` padrão.       |
| TC05 | Listar com página específica                        | `GET /auditoria/logs?page=1&limit=5` | HTTP 200 - Retorna page 1 com até 5 documentos.    |
| TC06 | Limitar quantidade de itens por página              | `GET /auditoria/logs?limit=10`      | HTTP 200 - Retorna até 10 documentos.              |

### Filtros
| ID   | Descrição                                           | Rota Testada                        | Resultado Esperado                                  |
|------|-----------------------------------------------------|-------------------------------------|-----------------------------------------------------|
| TC07 | Filtrar por ação específica                         | `GET /auditoria/logs?acao=LOGIN`    | HTTP 200 - Retorna apenas logs com ação LOGIN.      |
| TC08 | Filtrar por intervalo de datas                      | `GET /auditoria/logs?dataInicio=X&dataFim=Y` | HTTP 200 - Retorna logs no intervalo de datas. |
| TC09 | Filtrar por usuário específico                      | `GET /auditoria/logs?usuarioId=X`   | HTTP 200 - Retorna apenas logs do usuário.          |
| TC10 | Combinar múltiplos filtros                          | `GET /auditoria/logs?acao=X&dataInicio=Y&page=1&limit=20` | HTTP 200 - Retorna logs com todos os filtros aplicados. |

### Estrutura de Resposta
| ID   | Descrição                                           | Rota Testada                        | Resultado Esperado                                  |
|------|-----------------------------------------------------|-------------------------------------|-----------------------------------------------------|
| TC11 | Validar estrutura dos logs retornados              | `GET /auditoria/logs?limit=1`       | HTTP 200 - Logs contêm `_id`, `usuario_id`, `acao`, `data_registro` |
| TC12 | Validar estrutura de paginação                      | `GET /auditoria/logs`               | HTTP 200 - Resposta contém `docs`, `totalDocs`, `limit`, `page`, `totalPages`, `hasNextPage`, `hasPrevPage` |

### Casos Extremos
| ID   | Descrição                                           | Rota Testada                        | Resultado Esperado                                  |
|------|-----------------------------------------------------|-------------------------------------|-----------------------------------------------------|
| TC13 | Listar com página fora do intervalo                 | `GET /auditoria/logs?page=9999`     | HTTP 200 ou 400 - Retorna resposta válida ou erro.  |
| TC14 | Listar com limite máximo                            | `GET /auditoria/logs?limit=100`     | HTTP 200 - Retorna até 100 documentos.              |
| TC15 | Validar que logs estão em ordem cronológica descendente | `GET /auditoria/logs?limit=10`  | HTTP 200 - Logs ordenados por data (mais recente primeiro). |

---

## Cobertura de Testes
- **Autenticação JWT**: Verifica bloqueio de acesso sem token JWT válido
- **Autorização por Cargo**: Confirma que apenas administradores acessam os logs de auditoria
- **Paginação Robusta**: Valida que os parâmetros `page` e `limit` funcionam corretamente
- **Filtros Avançados**: Garante que filtros por ação, data e usuário são aplicados adequadamente
- **Integridade dos Dados**: Confirma que os logs contêm todas as informações necessárias para rastreabilidade
- **Ordem Cronológica**: Valida que os logs são apresentados em ordem decrescente de data

---

## Conclusão
A execução com êxito destes testes de integração confirma que a API de Auditoria funciona corretamente, registrando e retornando logs com filtros avançados, paginação robusta e controle de acesso adequado. Garante rastreabilidade completa das ações do sistema e conformidade com requisitos de segurança e conformidade.
