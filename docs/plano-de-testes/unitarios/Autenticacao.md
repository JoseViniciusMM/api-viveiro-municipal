# Documentação de Testes - Autenticação e Sessão

## Identificação
- **Módulo testado**: Autenticação (AuthService, TokenService, SessionService)
- **Ferramentas utilizadas**: Jest, Mocks Genéricos (Repository/Bcrypt)
- **Responsável**: Gabriel

---

## Objetivo
Verificar se as rotinas de autenticação, geração/validação de tokens JWT e gestão de sessões operam corretamente com as credenciais, além de lidar adequadamente com erros (usuário inativo, senhas erradas e tokens expirados).

---

## Ambiente de Teste
- Banco de dados: Mocks baseados no comportamento do Mongoose
- Framework de testes: Jest
- Comando de execução: `npm run test`
- Local dos testes: `src/test/unit/services/authService.test.js`

---

## Casos de Teste Implementados

| ID   | Descrição                                      | Método testado             | Resultado Esperado                         |
|------|------------------------------------------------|----------------------------|--------------------------------------------|
| TC01 | Gerar e verificar um Access Token payload OK   | `TokenService.generate...` | Retorna string token com expiração válida  |
| TC02 | Gerar e verificar um Refresh Token             | `TokenService.generate...` | Retorna string token decodificável         |
| TC03 | Decodificar um token sem verificar assinatura  | `TokenService.decodeToken` | Retorna objeto descriptografado            |
| TC04 | Introspecção retornando metadados de token     | `TokenService.introspect`  | Retorna { active: true, client_id... }     |
| TC05 | Revogar o token de um usuário via repository   | `SessionService.revoke`    | Retorna true (sucesso)                     |
| TC06 | Validar sessão ativa (refresh armazenado)      | `SessionService.verificar` | Retorna true (usuário possui sessão)       |
| TC07 | Recusar sessão ativa com refresh ausente       | `SessionService.verificar` | Retorna false                              |
| TC08 | Erro se senha não informada no payload         | `AuthService.login`        | Lança CustomError                          |
| TC09 | Erro se CPF/Email não informados               | `AuthService.login`        | Lança CustomError                          |
| TC10 | Erro de credenciais (usuário não encontrado)   | `AuthService.login`        | Lança CustomError                          |
| TC11 | Bloquear acesso de usuário status Inativo      | `AuthService.login`        | Lança CustomError (Soft-deleted)           |
| TC12 | Bloquear acesso de usuário status Pendente     | `AuthService.login`        | Lança CustomError (Aguardando ativação)    |
| TC13 | Erro de credenciais (senha errada)             | `AuthService.login`        | Lança CustomError                          |
| TC14 | Sucesso no login retornando tokens (via CPF)   | `AuthService.login`        | Payload com acess/refresh/usuario logado   |
| TC15 | Sucesso no login retornando tokens (via EMAIL) | `AuthService.login`        | Payload com acess/refresh/usuario logado   |
| TC16 | Logout revogando sessão e logando auditoria    | `AuthService.logout`       | Repositório limpo e log registrado         |
| TC17 | Erro em refresh token que não bate com banco   | `AuthService.refreshToken` | Lança CustomError (Deslogamento forçado)   |
| TC18 | Erro se tentar dar refresh em usuário Inativo  | `AuthService.refreshToken` | Lança CustomError                          |
| TC19 | Sucesso na geração do novo access token        | `AuthService.refreshToken` | Retorna novo `accessToken`                 |
| TC20 | Esqueceu senha falha mudo (E-mail não existe)  | `AuthService.esqueceuSenha`| Não lança erro para não vazar info         |
| TC21 | Esqueceu senha envia e-mail com sucesso        | `AuthService.esqueceuSenha`| Chama mockMailService e auditoria          |
| TC22 | Capturar erro do SMTP sem parar a aplicação    | `AuthService.esqueceuSenha`| Log no warn console e continua fluxo       |

---

## Cobertura de Testes
- Cobertura total das operações lógicas contidas no `AuthService`, `SessionService` e `TokenService`.
- Casos de sucesso e falhas/bloqueios mapeados e implementados.

---

## Execução e Resultados

```bash
PASS  src/test/unit/services/authService.test.js
  ✓ deve realizar login com sucesso e retornar tokens via CPF
  ✓ deve realizar login com sucesso e retornar tokens via EMAIL
  ✓ deve lançar erro de credenciais inválidas se a senha estiver errada
  ✓ deve lançar erro bloqueando o acesso de usuário com status Inativo
  ✓ deve revogar a sessão do usuário via sessionService e registrar a auditoria
  ✓ não deve fazer nada se o e-mail solicitado não existir no sistema
```

---

## Conclusão
Os testes unitários garantem que o service `AuthService` está implementado corretamente, atende as regras de negócio de segregação de inativos/pendentes, gera chaves confiáveis e lida com falhas no provedor de e-mail de forma segura.

---

## Histórico
- Criado em: 10/05/2026
- Última atualização: 10/05/2026