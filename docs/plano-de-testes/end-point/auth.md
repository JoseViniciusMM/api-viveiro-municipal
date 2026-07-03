# Documentação de Testes de Integração (End-to-End) - Autenticação

## Identificação
- **Módulo testado**: Autenticação (Rotas, Controllers e validação de tokens JWT)
- **Ferramentas utilizadas**: Supertest, Jest, MongoDB In-Memory (via Jest Setup Global)
- **Responsáveis**: Equipe de Desenvolvimento

---

## Objetivo
Garantir o correto funcionamento e a segurança das operações de autenticação da API. Isso inclui a validação de login com credenciais válidas e inválidas, renovação segura de tokens (refresh token), solicitação de recuperação de senha e o encerramento seguro de sessão (logout), assegurando que recursos protegidos exijam o token adequadamente.

---

## Ambiente de Teste
- **Banco de dados**: MongoDB em memória populado dinamicamente.
- **Estado do Banco**: Inicializado e limpo a cada suíte de testes pelo arquivo `seedViveiroMunicipal.js` executado no ciclo global do Jest.
- **Comando de execução**: `npm run test`
- **Local dos testes**: `src/test/unit/routes/authRoute.test.js`

---

## Casos de Teste Planejados

### Login
| ID   | Descrição                                           | Rota Testada                        | Resultado Esperado                                  |
|------|-----------------------------------------------------|-------------------------------------|-----------------------------------------------------|
| TC01 | Realizar login com credenciais válidas              | `POST /auth/login`                  | HTTP 200 - Retorna tokens de acesso e refresh.      |
| TC02 | Bloquear login com credenciais inválidas            | `POST /auth/login`                  | HTTP 400/401 - Falha na autenticação.               |
| TC03 | Bloquear login com payload incompleto               | `POST /auth/login`                  | HTTP 400 - Rejeição por validação de campos.        |

### Logout
| ID   | Descrição                                           | Rota Testada                        | Resultado Esperado                                  |
|------|-----------------------------------------------------|-------------------------------------|-----------------------------------------------------|
| TC04 | Realizar logout com token válido                    | `POST /auth/logout`                 | HTTP 200/204 - Sessão encerrada com sucesso.        |
| TC05 | Bloquear logout sem token de acesso                 | `POST /auth/logout`                 | HTTP 401/498 - Erro de token ausente/inválido.      |

### Refresh Token
| ID   | Descrição                                           | Rota Testada                        | Resultado Esperado                                  |
|------|-----------------------------------------------------|-------------------------------------|-----------------------------------------------------|
| TC06 | Renovar token de acesso usando refresh token válido | `POST /auth/refresh-token`          | HTTP 200 - Novos tokens gerados com sucesso.        |
| TC07 | Bloquear renovação com refresh token inválido       | `POST /auth/refresh-token`          | HTTP 400/401 - Erro de validação ou token inválido. |

### Recuperação de Senha
| ID   | Descrição                                           | Rota Testada                        | Resultado Esperado                                  |
|------|-----------------------------------------------------|-------------------------------------|-----------------------------------------------------|
| TC08 | Solicitar redefinição de senha com email válido     | `POST /auth/esqueceu-senha`         | HTTP 200 - E-mail de recuperação simulado/enviado.  |
| TC09 | Bloquear solicitação sem informar o e-mail          | `POST /auth/esqueceu-senha`         | HTTP 400 - Erro de validação de payload no Zod.     |

---

## Cobertura de Testes
- **Geração e Validação de JWT**: Confirma que os tokens (Access e Refresh) são gerados corretamente no login e validados rigidamente em rotas protegidas (como no momento do logout).
- **Proteção de Sessão**: Verifica se a rota de logout está devidamente blindada pelo `AuthMiddleware`, impedindo que usuários não autenticados ou com tokens expirados manipulem a sessão.
- **Tratamento de Exceções**: Garante que senhas incorretas, tokens inválidos/forjados e corpos de requisição vazios retornem os códigos HTTP corretos de falha (400, 401, 498), sem vazar dados internos da API.

---

## Conclusão
A suíte de testes comprova que a camada de autenticação está robusta, gerenciando corretamente as sessões ativas, a criptografia e protegendo de forma intransigente a porta de entrada principal do sistema Viveiro Municipal.