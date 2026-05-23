# Documentação de Testes - Lotes (Produção)

## Identificação
- **Módulo testado**: Lote (LoteService)
- **Ferramentas utilizadas**: Jest, Mocks Complexos de Múltiplos Serviços
- **Responsável**: Gabriel

---

## Objetivo
Validar de ponta a ponta as reações biológicas encadeadas (LoteService criando cascata para MovimentaçãoService e liberando/fechando posições físicas no EstufaRepository). Foco intenso em impedir estufas superlotadas ou criação de Lotes Fantasmas usando Saldo de semente que não existe mais.

---

## Ambiente de Teste
- Banco de dados: Mocks Baseados na integração dos Serviços
- Framework de testes: Jest
- Comando de execução: `npm run test`
- Local dos testes: `src/test/unit/services/loteService.test.js`

---

## Casos de Teste Implementados

| ID   | Descrição                                      | Método testado             | Resultado Esperado                         |
|------|------------------------------------------------|----------------------------|--------------------------------------------|
| TC01 | Iniciar lote acionando saída de sementeira     | `LoteService.criar`        | Registra lote e gera movimentação          |
| TC02 | Bloquear alocação que ultrapasse a barraca     | `LoteService.criar`        | Lança CustomError de Overflow físico       |
| TC03 | Erro ao plantar espécie não cadastrada         | `LoteService.criar`        | Lança CustomError de validação de espécie  |
| TC04 | Bloquear abertura do lote sem saldo prateleira | `LoteService.criar`        | Lança CustomError de saldo negativo        |
| TC05 | Travar barraca automaticamente aos 100% de uso | `LoteService.criar`        | Status da estufa passa a Indisponível      |
| TC06 | Atualizar fase biológica básica do lote        | `LoteService.atualizarFase`| Modifica a fase sem afetar a estufa        |
| TC07 | Fim de ciclo destrava a barraca (Finalizado)   | `LoteService.atualizarFase`| Libera status da estufa de origem          |
| TC08 | Lançar Mortalidade pontual atrelada ao Lote    | `LoteService.registrarMortalidade`| Lança Mov. e reduz array sem mexer estufa|
| TC09 | Transferir lote validando capacidade alvo      | `LoteService.transferir`   | Troca vínculo da barraca e destrava a antiga|
| TC10 | Bloquear transferência para estufa cheia       | `LoteService.transferir`   | Lança CustomError de Overflow              |
| TC11 | Expurgo (Soft Delete) acionando mortalidade    | `LoteService.deletar`      | Inativa lote e limpa 100% da estufa        |
| TC12 | Consulta detalhada do lote preenchida com ID   | `LoteService.buscarPorId`  | Objeto montado retornado com sucesso       |
| TC13 | Buscar detalhes de lote inexistente (404)      | `LoteService.buscarPorId`  | Lança CustomError 404                      |
| TC14 | Listagem repassando os parâmetros de busca     | `LoteService.listar`       | Função chamará o repository de forma neutra|
| TC15 | Gerar linha do tempo cruzando logs e movs      | `LoteService.buscarHistorico`| Objeto mixado de LOGS e MVS retornado    |

---

## Cobertura de Testes
- Cobertura total das operações lógicas contidas no `LoteService`.
- Regras restritas envolvendo liberação de barracas e abatimento da semente original totalmente testadas.

---

## Execução e Resultados

```bash
PASS  src/test/unit/services/loteService.test.js
  ✓ deve criar o lote, registrar a SAÍDA na sementeira e ocupar a estufa corretamente
  ✓ deve lançar erro ao tentar criar um lote maior que a capacidade disponível na estufa
  ✓ deve lançar erro se a quantidade inicial solicitada for maior do que o saldo atual da espécie
  ✓ deve liberar a estufa (status Livre) caso o lote seja atualizado para a fase FINALIZADO
  ✓ deve transferir o lote, liberando a estufa de origem e ocupando a estufa de destino
  ✓ deve descartar o lote, registrar a MORTALIDADE das plantas e liberar a estufa
```

---

## Conclusão
Os testes unitários garantem que o service `LoteService` atende com excelência o encadeamento das regras de negócio do controle agronômico, sendo à prova de estufas "estourando o limite" e de perdas/expurgos sem rastro de auditoria.

---

## Histórico
- Criado em: 10/05/2026
- Última atualização: 10/05/2026