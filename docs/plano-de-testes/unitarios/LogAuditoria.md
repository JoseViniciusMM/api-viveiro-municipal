# Documentação de Testes - Log de Auditoria

## Identificação
- **Módulo testado**: Auditoria (LogAuditoriaService)
- **Ferramentas utilizadas**: Jest, Mocks Genéricos de Repository
- **Responsável**: Gabriel

---

## Objetivo
Garantir a blindagem da camada de auditoria do sistema, validando a extração correta de ObjectIds do Mongoose, mitigando falhas do banco que poderiam travar o sistema e assegurando que apenas Administradores possam acessar o histórico global de eventos.

---

## Ambiente de Teste
- Banco de dados: Mocks (Mongoose-like)
- Framework de testes: Jest
- Comando de execução: `npm run test`
- Local dos testes: `src/test/unit/services/logAuditoriaService.test.js`

---

## Casos de Teste Implementados

| ID   | Descrição                                      | Método testado                | Resultado Esperado                         |
|------|------------------------------------------------|-------------------------------|--------------------------------------------|
| TC01 | Registrar auditoria passando ID como string    | `LogAuditoriaService.registrar`| Log salvo via repositório                  |
| TC02 | Logar silenciosamente erros de queda do Mongo  | `LogAuditoriaService.registrar`| `console.error` ativado sem quebrar a API  |
| TC03 | Listar os logs com sucesso para Administrador  | `LogAuditoriaService.listar`   | Listagem liberada pelo Service             |
| TC04 | Bypass de segurança para consultas internas    | `LogAuditoriaService.listar`   | Listagem liberada se `isInternal` = true   |
| TC05 | Erro 403 ao tentar listar como Operador        | `LogAuditoriaService.listar`   | Lança CustomError 403 (Acesso Negado)      |
| TC06 | Erro 403 ao tentar listar como não-autenticado | `LogAuditoriaService.listar`   | Lança CustomError 403 (Acesso Negado)      |

---

## Cobertura de Testes
- Cobertura total das checagens de autorização (*Defense in Depth*) baseada em perfis de ator.
- Tratamento de falhas passivas testado (Catch block sem *throw*).

---

## Execução e Resultados

```bash
PASS  src/test/unit/services/logAuditoriaService.test.js
  ✓ deve registrar auditoria passando o usuario_id como string direta
  ✓ não deve lançar exceção e interromper a aplicação se o repositório falhar
  ✓ deve listar os logs normalmente se o usuário for Administrador
  ✓ deve listar os logs burlando a verificação de segurança (bypass) caso isInternal seja true
  ✓ deve lançar erro 403 se o ator for um Operador (sem permissão) e a consulta não for interna
  ✓ deve lançar erro 403 se o ator for null (não autenticado) e a consulta não for interna
```

---

## Conclusão
Os testes unitários provam a imutabilidade arquitetural da Auditoria, protegendo o acesso indevido à listagem de eventos e garantindo que o sistema não caia caso os logs secundários falhem em ser registrados.
