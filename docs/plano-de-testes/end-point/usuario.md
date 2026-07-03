# Documentação de Testes de Integração (End-to-End) - Usuário

## Identificação
- **Módulo testado**: Usuários (Rotas, Controllers, Services)
- **Ferramentas utilizadas**: Supertest, Jest, MongoDB em memória
- **Responsável**: Lucas

---

## Objetivo
Garantir que a API de Usuários gerencie corretamente o ciclo de vida dos servidores do viveiro, incluindo autenticação, criação, listagem, atualização de dados administrativos, atualização do próprio perfil e inativação.

---

## Ambiente de Teste
- **Banco de dados**: MongoDB em memória (`mongodb-memory-server`)
- **Estado do Banco**: Populado dinamicamente via `seedViveiroMunicipal.js` no `beforeAll`
- **Comando de execução**: `npm test usuario.test`
- **Local dos testes**: `src/test/unit/routes/usuario.test.js`

---

## Casos de Teste Planejados

### Autenticação
| ID | Descrição | Rota Testada | Resultado Esperado |
|----|-----------|-------------|-------------------|
| TC01 | Realizar login e obter token | `POST /auth/login` | HTTP 200 - Retorna `accessToken` |

### Autorização
| ID | Descrição | Rota Testada | Resultado Esperado |
|----|-----------|-------------|-------------------|
| TC02 | Bloquear acesso sem token JWT | `GET /usuarios` | HTTP 498 - Retorna erro de token não informado |

### Listagem
| ID | Descrição | Rota Testada | Resultado Esperado |
|----|-----------|-------------|-------------------|
| TC03 | Listar usuários como administrador | `GET /usuarios` | HTTP 200 - Retorna array paginado com `docs` |

### Criação
| ID | Descrição | Rota Testada | Resultado Esperado |
|----|-----------|-------------|-------------------|
| TC04 | Criar novo usuário com dados válidos | `POST /usuarios` | HTTP 201 - Retorna objeto com `_id` |

### Busca
| ID | Descrição | Rota Testada | Resultado Esperado |
|----|-----------|-------------|-------------------|
| TC05 | Buscar usuário por ID | `GET /usuarios/:id` | HTTP 200 - Retorna objeto com `_id` correspondente |

### Atualização
| ID | Descrição | Rota Testada | Resultado Esperado |
|----|-----------|-------------|-------------------|
| TC06 | Atualizar dados de um usuário como administrador | `PATCH /usuarios/:id` | HTTP 200 - Retorna objeto com dados atualizados |
| TC07 | Atualizar próprio perfil sem alterar cargo | `PATCH /usuarios/perfil` | HTTP 200 - Campo `cargo` não é alterado mesmo sendo enviado |

### Inativação
| ID | Descrição | Rota Testada | Resultado Esperado |
|----|-----------|-------------|-------------------|
| TC08 | Inativar usuário (soft delete) | `DELETE /usuarios/:id` | HTTP 204 - Sem conteúdo na resposta |

---

## Cobertura de Testes
- **Autenticação JWT**: Confirma bloqueio de rotas protegidas sem token válido
- **Controle de Acesso por Cargo**: Valida que apenas administradores acessam rotas restritas
- **Proteção de Perfil**: Confirma que `cargo` e `status` não podem ser alterados pelo próprio usuário via `/perfil`
- **Soft Delete**: Valida que o usuário é inativado sem remoção física do banco

---

## Conclusão
A execução com êxito destes testes de integração confirma que a API de Usuários assegura o gerenciamento correto dos servidores do viveiro, garantindo controle de acesso adequado e integridade dos dados em todas as operações do ciclo de vida do usuário.
