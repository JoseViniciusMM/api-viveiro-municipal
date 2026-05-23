# Documentação de Testes - Destinatários

## Identificação
- **Módulo testado**: Destinatário (DestinatarioService)
- **Ferramentas utilizadas**: Jest, Mocks Genéricos de Repository
- **Responsável**: Carlos

---

## Objetivo
Verificar se a lógica do DestinatarioService controla firmemente o ciclo de vida das entidades de governo ou pessoas que recebem doações de Lotes de mudas. O foco essencial é validar as funções de unicidade de E-mail e CPF/CNPJ.

---

## Ambiente de Teste
- Banco de dados: Mocks (Mongoose-like)
- Framework de testes: Jest
- Comando de execução: `npm run test`
- Local dos testes: `src/test/unit/services/destinatarioService.test.js`

---

## Casos de Teste Implementados

| ID   | Descrição                                      | Método testado             | Resultado Esperado                         |
|------|------------------------------------------------|----------------------------|--------------------------------------------|
| TC01 | Cadastrar entidade pública/privada             | `DestinatarioService.criar`| Salvo com Ativo                            |
| TC02 | Erro de duplicidade no e-mail                  | `DestinatarioService.criar`| Lança CustomError (Email em uso)           |
| TC03 | Erro de duplicidade documental (CPF/CNPJ)      | `DestinatarioService.criar`| Lança CustomError (Documento duplicado)    |
| TC04 | Atualização cadastral normal de contatos       | `DestinatarioService.atualizar`| Salva sem erros                        |
| TC05 | Bloquear roubo de e-mail na edição             | `DestinatarioService.atualizar`| Lança CustomError (Conflito E-mail)    |
| TC06 | Bloquear roubo de CPF/CNPJ na edição           | `DestinatarioService.atualizar`| Lança CustomError (Conflito Documento)|
| TC07 | Inativar para prevenir usos futuros em envios  | `DestinatarioService.inativar` | Setado como Inativo                    |
| TC08 | Busca paginada limpa com parse numérico        | `DestinatarioService.listar`   | Retorna docs array                     |
| TC09 | Consulta de identificação completa             | `DestinatarioService.buscarPorId`| Retorna Objeto formatado             |
| TC10 | Erro 404 em consulta                           | `DestinatarioService.buscarPorId`| Lança CustomError 404                |

---

## Cobertura de Testes
- Cobertura total das operações lógicas contidas no `DestinatarioService`.
- Validação dupla das funções auxiliares de bloqueio cruzado de documentos na criação e na atualização.

---

## Execução e Resultados

```bash
PASS  src/test/unit/services/destinatarioService.test.js
  ✓ deve criar o destinatário com status ATIVO e registrar auditoria
  ✓ deve lançar erro se o e-mail já estiver cadastrado
  ✓ deve lançar erro ao atualizar para um e-mail já existente de outro destinatário
  ✓ deve alterar o status para Inativo
```

---

## Conclusão
Os testes unitários garantem que o service `DestinatarioService` está implementado corretamente, atendendo a necessidade crítica de não poluir relatórios públicos com "CNPJs Fantasmas" duplicados.

---

## Histórico
- Criado em: 10/05/2026
- Última atualização: 10/05/2026