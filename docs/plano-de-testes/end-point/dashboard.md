# Documentação de Testes de Integração (End-to-End) - Dashboard

## Identificação
- **Módulo testado**: Dashboard (Rotas, Controllers, Services, Repository)
- **Ferramentas utilizadas**: Supertest, Jest, MongoDB em memória
- **Responsável**: Lucas

---

## Objetivo
Garantir que a API de Dashboard retorne corretamente os dados consolidados do viveiro, incluindo KPIs, estatísticas de estufas, lotes por fase, saídas dos últimos 7 dias e alertas, validando o controle de acesso por cargo.

---

## Ambiente de Teste
- **Banco de dados**: MongoDB em memória (`mongodb-memory-server`)
- **Estado do Banco**: Populado dinamicamente via `seedViveiroMunicipal.js` no `beforeAll`
- **Comando de execução**: `npm test dashboard.test`
- **Local dos testes**: `src/test/unit/routes/dashboard.test.js`

---

## Casos de Teste Planejados

### Autorização
| ID | Descrição | Rota Testada | Resultado Esperado |
|----|-----------|-------------|-------------------|
| TC01 | Bloquear acesso sem token JWT | `GET /dashboard/geral` | HTTP 498 - Retorna erro de token não informado |

### Acesso por Cargo
| ID | Descrição | Rota Testada | Resultado Esperado |
|----|-----------|-------------|-------------------|
| TC02 | Acessar dashboard como Administrador | `GET /dashboard/geral` | HTTP 200 - Retorna dados consolidados do viveiro |
| TC03 | Acessar dashboard como Operador | `GET /dashboard/geral` | HTTP 200 - Retorna dados consolidados do viveiro |

---

## Cobertura de Testes
- **Autenticação JWT**: Confirma bloqueio da rota sem token válido
- **Controle de Acesso por Cargo**: Valida que tanto Administrador quanto Operador têm acesso ao dashboard
- **Dados Consolidados**: Confirma que a resposta contém os dados do viveiro para tomada de decisão

---

## Conclusão
A execução com êxito destes testes de integração confirma que a API de Dashboard assegura o retorno correto dos dados consolidados do viveiro, garantindo que apenas usuários autenticados com os cargos adequados consigam acessar as informações estratégicas do sistema.
