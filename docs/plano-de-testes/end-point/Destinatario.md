# Documentação de Testes de Integração (End-to-End) - Destinatários

## Identificação
- **Módulo testado**: Destinatários (Rotas, Controladores e Validações de Esquema)
- **Ferramentas utilizadas**: Supertest, Jest, MongoDB In-Memory
- **Responsáveis**: Carlos Eduardo da Silva 

---

## Objetivo
Validar de ponta a ponta as operações do ciclo de gestão de destinatários (entidades físicas ou jurídicas associadas às expedições e saídas do viveiro). O objetivo é garantir a integridade dos dados através do validador Zod, o isolamento dos estados físicos no banco de dados e a segurança das barreiras de acesso via tokens JWT e permissões por nível de utilizador (`Administrador` e `Operador`).

---

## Ambiente de Teste
- **Base de dados**: MongoDB em memória, isolado por suíte de testes.
- **Carga de dados**: Dados base injetados pelo ficheiro de sementeira (`seedViveiroMunicipal.js`).
- **Comando de execução**: `npm run test`
- **Caminho do ficheiro**: `src/test/unit/routes/destinatarioRoute.test.js`

---

## Casos de Teste Executados

### Camada de Segurança e Autenticação
| ID   | Descrição                                           | Rota Analisada                      | Comportamento Esperado                              |
|------|-----------------------------------------------------|-------------------------------------|-----------------------------------------------------|
| TC01 | Bloquear requisições sem token de acesso JWT        | `GET /destinatarios`                | Resposta HTTP 401 ou 498 (Token não informado).     |

### Criação e Consistência de Dados (Zod Schema)
| ID   | Descrição                                           | Rota Analisada                      | Comportamento Esperado                              |
|------|-----------------------------------------------------|-------------------------------------|-----------------------------------------------------|
| TC02 | Registar um novo destinatário válido com sucesso    | `POST /destinatarios`               | Resposta HTTP 201 com os dados persistidos no banco. |
| TC06 | Bloquear payloads com propriedades em falta         | `POST /destinatarios`               | Resposta HTTP 400 mapeando os erros obrigatórios.   |

*Nota de consistência no TC02: O esquema exige rigorosamente os enums de tipo (`FISICA` ou `JURIDICA`) e categoria (`PUBLICA`, `PRIVADA` ou `SOCIAL`), além da string obrigatória de endereço.*

### Consultas, Filtros e Leitura de Histórico
| ID   | Descrição                                           | Rota Analisada                      | Comportamento Esperado                              |
|------|-----------------------------------------------------|-------------------------------------|-----------------------------------------------------|
| TC03 | Listar destinatários registados com paginação       | `GET /destinatarios`                | Resposta HTTP 200 contendo a estrutura de `docs`.   |
| TC04 | Obter dados detalhados de um destinatário por ID     | `GET /destinatarios/:id`            | Resposta HTTP 200 confirmando a igualdade do ID.     |

### Edição e Remoção Lógica (Soft Delete)
| ID   | Descrição                                           | Rota Analisada                      | Comportamento Esperado                              |
|------|-----------------------------------------------------|-------------------------------------|-----------------------------------------------------|
| TC05 | Atualizar campos de contacto (ex: telefone)         | `PATCH /destinatarios/:id`          | Resposta HTTP 200 com o campo modificado.           |
| TC07 | Inativar com sucesso um destinatário (Soft Delete)  | `DELETE /destinatarios/:id`         | Resposta HTTP 200 ou 204.                           |

---

## Estratégia de Isolamento de Efeitos Secundários
Para prevenir erros de chaves estrangeiras ou restrições de integridade cruzadas (como tentar apagar um destinatário do *seed* que já possui registos históricos imutáveis na tabela de movimentações), a suíte foi desenhada de forma dinâmica: 
O **TC07 (Inativação)** utiliza prioritariamente o ID do destinatário recém-criado no **TC02**, assegurando que a remoção lógica ocorra sem bloqueios ou falhas de integridade na base de dados.

---

## Conclusão
A validação bem-sucedida e a passagem em todos os cenários confirmam que a rota está em total conformidade com as regras de negócio desenhadas. O validador Zod assegura que dados incompletos não entram no sistema, enquanto os middlewares protegem e limitam as ações de inativação exclusivamente aos perfis autorizados.