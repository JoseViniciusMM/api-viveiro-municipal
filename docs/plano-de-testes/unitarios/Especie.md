# Documentação de Testes - Espécie (Sementeira)

## Identificação
- **Módulo testado**: Espécie (EspecieService)
- **Ferramentas utilizadas**: Jest, Mocks Genéricos
- **Responsável**: José

---

## Objetivo
Verificar se o modelo de lógica da Sementeira lida de forma estrita com a contabilidade, rejeitando modificações maliciosas na quantidade física das espécies e garantindo que toda criação e atualização de espécie seja devidamente registrada no log de auditoria.

---

## Ambiente de Teste
- Banco de dados: Mocks (Mongoose-like)
- Framework de testes: Jest
- Comando de execução: `npm run test`
- Local dos testes: `src/test/unit/services/especieService.test.js`

---

## Casos de Teste Implementados

| ID   | Descrição                                      | Método testado                 | Resultado Esperado                         |
|------|------------------------------------------------|--------------------------------|--------------------------------------------|
| TC01 | Criar espécie com saldo zerado                 | `EspecieService.criar`         | Espécie criada com status Ativo e qtd 0    |
| TC02 | Registrar auditoria após criar a espécie       | `EspecieService.criar`         | Log auditoria CRIAR_ESPECIE registrado     |
| TC03 | Tratar ausência do nome científico             | `EspecieService.criar`         | Salva o campo explicitamente como null     |
| TC04 | Chamar listar com filtros e paginação          | `EspecieService.listar`        | Passa obj de parâmetros corretos ao repo   |
| TC05 | Listar ignorando filtros que não foram mandados| `EspecieService.listar`        | Manda `{ filtros: {} }` para o banco       |
| TC06 | Retornar espécie existente buscando por ID     | `EspecieService.buscarPorId`   | Retorna os dados exatos do banco           |
| TC07 | Lançar erro 404 ao buscar ID falso             | `EspecieService.buscarPorId`   | Lança CustomError 404                      |
| TC08 | Atualizar espécie validando auditoria          | `EspecieService.atualizar`     | Repositório alterado e log gerado          |
| TC09 | Bloquear alteração direta de quantidade atual  | `EspecieService.atualizar`     | Campo `quantidade_atual` é ignorado        |
| TC10 | Bloquear alteração direta de tipo              | `EspecieService.atualizar`     | Campo `tipo` é ignorado                    |
| TC11 | Erro 404 ao atualizar espécie falsa            | `EspecieService.atualizar`     | Aborta requisição sem salvar banco         |
| TC12 | Obter histórico lendo da collection secundária | `EspecieService.obterHistorico`| Retorna obj de movimentações relacionadas  |
| TC13 | Erro 404 ao pedir histórico de espécie falsa   | `EspecieService.obterHistorico`| Lança CustomError 404                      |

---

## Cobertura de Testes
- Cobertura total das operações lógicas contidas no `EspecieService`.
- Restrições do Payload (`delete dados.quantidade_atual` e `delete dados.tipo`) implementadas e cobertas rigorosamente.

---

## Execução e Resultados

```bash
PASS  src/test/unit/services/especieService.test.js
  criar
    ✓ deve criar espécie com quantidade_atual zerada e status ATIVO
    ✓ deve registrar auditoria após criar espécie
    ✓ deve salvar nome_cientifico como null quando não informado
  listar
    ✓ deve chamar repository.listar com filtros e paginação corretos
    ✓ deve ignorar filtros não enviados
  buscarPorId
    ✓ deve retornar a espécie quando encontrada
    ✓ deve lançar erro 404 quando espécie não existe
  atualizar
    ✓ deve atualizar a espécie e registrar auditoria
    ✓ deve bloquear alteração de quantidade_atual
    ✓ deve bloquear alteração de tipo
    ✓ deve lançar erro 404 quando espécie não existe
  obterHistorico
    ✓ deve retornar movimentações da espécie
    ✓ deve lançar erro 404 quando espécie não existe
```

---

## Conclusão
Os testes unitários garantem que o service `EspecieService` está implementado corretamente, protegendo a integridade do inventário ao bloquear alterações diretas de quantidade e tipo, e assegurando rastreabilidade completa via log de auditoria em todas as operações de escrita.

---

## Histórico
- Criado em: 10/05/2026
- Última atualização: 11/05/2026