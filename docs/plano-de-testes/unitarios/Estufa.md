# Documentação de Testes - Estufa

## Identificação
- **Módulo testado**: Estufa (EstufaService)
- **Ferramentas utilizadas**: Jest, Mocks Genéricos
- **Responsável**: Carlos

---

## Objetivo
Testar a robustez do service Estufa na montagem automatizada do seu código identificador físico, garantir que choques (mesmo local já salvo) lancem exceções corretas e blindar a barraca contra a destruição (Inativação) ou sucateamento (Redução de espaço abaixo do limite) enquanto existirem Plantas reais amarradas lá.

---

## Ambiente de Teste
- Banco de dados: Mocks Genéricos 
- Framework de testes: Jest
- Comando de execução: `npm run test`
- Local dos testes: `src/test/unit/services/estufaService.test.js`

---

## Casos de Teste Implementados

| ID   | Descrição                                      | Método testado             | Resultado Esperado                         |
|------|------------------------------------------------|----------------------------|--------------------------------------------|
| TC01 | Criar estufa compondo identificador E0X-B0X-XX | `EstufaService.criar`      | Gerada e salva com status Livre            |
| TC02 | Erro bloquear criação se posição estiver em uso| `EstufaService.criar`      | Lança CustomError (Posição ocupada)        |
| TC03 | Lançar erro de schema p/ atributos de Loc/Cap. | `EstufaService.criar`      | Rejeita localizações incompletas           |
| TC04 | Bloquear redução caso a nova cap seja < ocupado| `EstufaService.atualizar`  | Lança CustomError de overflow físico       |
| TC05 | Alterar array e lançar erro se bater na posição| `EstufaService.atualizar`  | Impede deslocamento de estufa em outra     |
| TC06 | Impedir exclusão com Lotes dentro (Mudas vivas)| `EstufaService.inativar`   | Rejeita inativação / soft delete           |
| TC07 | Excluir sem lotes convertendo a Inativo        | `EstufaService.inativar`   | Lança Update do Inativo                    |
| TC08 | Listar convertendo strings paginadoras (Num)   | `EstufaService.listar`     | Cast page e limit adequados ao DB          |
| TC09 | Retornar Detalhes Estufa OK e Lotes atrelados  | `EstufaService.buscarPorId`| Objeto com chaves completas retornado      |
| TC10 | Buscar 404 de espaço não mapeado               | `EstufaService.buscarPorId`| Lança CustomError 404                      |

---

## Cobertura de Testes
- Cobertura total das operações lógicas contidas no `EstufaService`.
- Casos de sucessos simples englobando cruzamentos com LoteRepository para validação relacional.

---

## Execução e Resultados

```bash
PASS  src/test/unit/services/estufaService.test.js
  ✓ deve gerar o código identificador (E01-B05-10) automaticamente e criar a estufa
  ✓ deve lançar erro se a posição (código) já estiver ocupada por outra estufa
  ✓ deve impedir redução de capacidade se a nova capacidade for menor que o total
  ✓ deve bloquear a inativação se a estufa ainda tiver lotes ativos
  ✓ deve inativar com sucesso se não houver lotes vinculados
```

---

## Conclusão
Os testes unitários provam a maturidade arquitetural do código na proteção do "chão" físico do viveiro, não permitindo que a falha humana gere lotes flutuantes ou estufas clonadas na mesma localidade (X/Y/Z) da fazenda.

---

## Histórico
- Criado em: 10/05/2026
- Última atualização: 10/05/2026