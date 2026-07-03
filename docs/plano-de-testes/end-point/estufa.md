# Documentação de Testes de Integração (End-to-End) - Estufas

## Identificação
- **Módulo testado**: Estufas (Rotas, Controllers e validações de integridade física)
- **Ferramentas utilizadas**: Supertest, Jest, MongoDB In-Memory (via Jest Setup Global)
- **Responsáveis**: Carlos Eduardo da Silva 

---

## Objetivo
Garantir o correto funcionamento e a segurança das operações do ciclo de gerenciamento das estufas de cultivo de ponta a ponta. Isso valida a autenticação por tokens JWT, barramento de payloads incorretos via esquemas do Zod, persistência real de dados no banco e a eficácia das regras de negócio complexas, como o travamento de inativação de estruturas com plantios ativos.

---

## Ambiente de Teste
- **Banco de dados**: MongoDB em memória populado dinamicamente.
- **Estado do Banco**: Inicializado e limpo a cada suíte de testes pelo arquivo `seedViveiroMunicipal.js` executado no ciclo global do Jest.
- **Comando de execução**: `npm run test`
- **Local dos testes**: `src/test/unit/routes/estufaRoute.test.js`

---

## Casos de Teste Planejados

### Autenticação e Barreiras de Segurança
| ID   | Descrição                                           | Rota Testada                        | Resultado Esperado                                  |
|------|-----------------------------------------------------|-------------------------------------|-----------------------------------------------------|
| TC01 | Bloquear acesso a endpoints sem token JWT válido    | `GET /estufas`                      | HTTP 401 ou 498 - Erro de "Token não informado"    |

### Cadastro e Regras de Localização Automática
| ID   | Descrição                                           | Rota Testada                        | Resultado Esperado                                  |
|------|-----------------------------------------------------|-------------------------------------|-----------------------------------------------------|
| TC02 | Registrar nova Estufa vazia com sucesso             | `POST /estufas`                     | HTTP 201 - Estufa criada e código identificador gerado pelo ecossistema. |
| TC06 | Bloquear payload de criação com dados ausentes      | `POST /estufas`                     | HTTP 400 - Rejeição controlada do validador Zod.    |

### Listagens, Filtros e Consultas por ID
| ID   | Descrição                                           | Rota Testada                        | Resultado Esperado                                  |
|------|-----------------------------------------------------|-------------------------------------|-----------------------------------------------------|
| TC03 | Listar todas as estufas com paginação ativa         | `GET /estufas`                      | HTTP 200 - Retorna objeto paginado contendo a lista de docs. |
| TC04 | Visualizar detalhes completos de uma estufa por ID  | `GET /estufas/:id`                  | HTTP 200 - Objeto retornado confere com o ID requisitado. |

### Edição de Estrutura e Inativação Segura (Soft Delete)
| ID   | Descrição                                           | Rota Testada                        | Resultado Esperado                                  |
|------|-----------------------------------------------------|-------------------------------------|-----------------------------------------------------|
| TC05 | Atualizar capacidade física total da estufa         | `PATCH /estufas/:id`                | HTTP 200 - Dados de capacidade modificados com sucesso. |
| TC07 | Inativar estufa sem lotes vinculados (Soft Delete)   | `DELETE /estufas/:id`               | HTTP 200 ou 204 - Inativação bem-sucedida da nova estufa. |

---

## Cobertura de Testes
- **Validação de Payload Estrutural**: Confirma se os campos de localização exigidos (`localizacao_estufa`, `localizacao_barraca`, `localizacao_posicao`) barram dados do tipo incorreto antes de atingir os modelos do Mongoose.
- **Mapeamento de Regras Autogeradas**: Certifica que o sistema intercepta e trata corretamente os códigos identificadores automáticos estruturados pelo backend.
- **Proteção Contra Erros de Negócio Cruzados**: O teste foi blindado para consumir a estufa criada no `TC02` durante o descarte do `TC07`. Isso documenta e protege a regra de negócio que impede que estufas com lotes ativos populados pelo seed sofram deleção acidental.

---

## Conclusão
A execução bem-sucedida e sem mocks desta suíte prova que a camada de controle e roteamento do módulo de estufas está totalmente integrada às regras de persistência de dados. A barreira do Zod e o fluxo de deleção protegida garantem estabilidade nas transições de infraestrutura do viveiro.