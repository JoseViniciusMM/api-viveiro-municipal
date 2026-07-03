# Plano de Teste Geral

**Sistema de Gestão de Viveiro Municipal (PAMINE)**

*versão 1.0*

## 1 - Introdução

O presente sistema tem como objetivo informatizar a gestão do Viveiro Municipal, oferecendo funcionalidades que abrangem o controle de Sementeira (espécies e inventário), gestão de espaços físicos (Estufas e Barracas), acompanhamento agronômico do ciclo de vida das plantas (Lotes), auditoria de Movimentações (entradas, perdas, expedições e estornos) e gerenciamento de Destinatários e Usuários.

Este plano de teste descreve os cenários, critérios de aceitação e verificações que serão aplicados sobre as principais funcionalidades do sistema, visando garantir a correta aplicação das lógicas transacionais do viveiro, a integridade dos saldos e estoques, a segurança do acesso e a experiência da equipe de manejo.


## 2 - Arquitetura da API

A aplicação adota uma arquitetura modular em camadas, implementada com as tecnologias Node.js, Express, MongoDB (via Mongoose), Zod para validação de dados, JWT para autenticação e Swagger para documentação interativa da API. O objetivo é garantir uma estrutura clara, escalável e de fácil manutenção, capaz de suportar as regras complexas de relacionamento entre lotes, estufas e sementeira.

### Camadas:

**Routes**: Responsável por definir os endpoints da aplicação e encaminhar as requisições HTTP para os controllers correspondentes. 

**Controllers**: Gerenciam a entrada das requisições, realizam a validação estrutural de dados (com Zod) e invocam os serviços. Formatam a resposta de sucesso ou erro.

**Services**: Centraliza as regras de negócio do viveiro. Abstrai a lógica de domínio (como abater saldo da sementeira ao criar um lote, ou travar uma estufa cheia) e orquestra operações antes de interagir com o repositório.

**Repositories**: Encapsulam o acesso aos dados por meio dos modelos do Mongoose, isolando as consultas complexas e paginações da lógica de negócio.

**Models**: Definem os esquemas (Schemas) das coleções do MongoDB, com o uso de Mongoose, mapeando entidades como Lotes, Estufas, Movimentações e Usuários.

**Middlewares**: Implementam funcionalidades transversais, como autenticação de usuários (AuthMiddleware), logging das rotas, controle de perfis (Administrador/Operador) e captura global de erros.


## 3 - Categorização dos Requisitos (Funcionais e Não Funcionais)

### Requisitos Funcionais e Regras de Negócio

| Código | Requisito Funcional                                                                                   | Regra de Negócio Associada                                                                                  |
| ------ | ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| RF001  | O sistema deve permitir o login via CPF ou E-mail.                                                    | O acesso deve ser bloqueado para usuários com status "Inativo" ou "Pendente".                               |
| RF002  | O sistema deve gerenciar o cadastro centralizado de usuários via convite.                             | O usuário nasce "Pendente" e ativa a conta cadastrando a senha por meio de um token recebido por e-mail.    |
| RF003  | O sistema deve realizar a gestão e inativação de contas (Soft Delete).                                | Exclusões físicas são proibidas para preservar a auditoria; o usuário apenas tem o status alterado.         |
| RF004  | O sistema deve permitir o cadastro técnico de espécies botânicas.                                     | Obrigatório Nome Popular, Categoria e Tipo. Se houver quantidade inicial, gerar movimentação automática.    |
| RF006  | O sistema deve registrar movimentações manuais de inventário (Entrada/Saída/Ajuste).                  | O saldo da espécie na Sementeira deve refletir instantaneamente a operação. Não é permitido saldo negativo. |
| RF007  | O sistema deve gerenciar o cadastro das estufas do viveiro.                                           | O identificador (ex: E01-B01-01) deve ser único. É proibido reduzir capacidade abaixo do ocupado.           |
| RF008  | O sistema deve permitir a abertura de Lotes e alocação.                                               | Um lote só pode ser aberto se houver saldo da semente correspondente e espaço na estufa escolhida.          |
| RF010  | O sistema deve permitir a evolução da fase biológica do Lote.                                         | Ao atingir a fase "Finalizado", a estufa de origem deve retornar automaticamente ao status "Livre".         |
| RF011  | O sistema deve registrar a mortalidade pontual de mudas.                                              | A mortalidade deve abater o saldo do lote sem alterar o saldo da sementeira raiz.                           |
| RF013  | O sistema deve gerar a rastreabilidade completa e histórico dos lotes.                                | Deve ser possível visualizar a linha do tempo desde a semente até a expedição, incluindo usuários responsáveis. |
| RF015  | O sistema deve proteger os registros com Logs de Auditoria e permitir o Estorno.                      | Estornos geram movimentações inversas sem apagar as originais. Ações críticas geram log em collection à parte. |
| RF016  | O sistema deve permitir a expedição de mudas prontas.                                                 | Lotes expedidos parcialmente continuam ativos; expedições totais finalizam o lote. Destinatário é obrigatório. |
| RF017  | O sistema deve exibir um Dashboard gerencial em tempo real.                                           | Exibir estufas com 100% de ocupação, lotes com risco (alta mortalidade) e KPIs de inventário.               |
| RF018  | O sistema deve gerenciar os destinatários das doações.                                                | CPF/CNPJ e e-mails devem ser únicos, e a exclusão deve ser lógica (Soft Delete) para manter histórico.      |

## 4 - Casos de Teste

Os casos de teste detalhados por módulo (Autenticação, Movimentação, Lote, Estufa, Destinatário, Relatórios e Auditoria) estão documentados em arquivos *Markdown* individuais no diretório `/docs/plano-de-testes/unitarios` e `/docs/plano-de-testes/end-point`. 
De forma geral, os cenários cobrem as rotas de sucesso, fluxos de falha (saldos negativos, duplicação de chaves únicas) e encadeamento de serviços (ex: Lote atualizando Estufa e Movimentação).


## 5 - Estratégia de Teste

A estratégia de teste adotada busca garantir a qualidade matemática da Sementeira, o bloqueio de falhas de segurança e o funcionamento das regras de agronomia em múltiplos níveis.

**Testes Unitários**: Focados na camada de `Services`, com mocks dos `Repositories`. Garantem o isolamento da lógica de negócio, assegurando que cálculos de mortalidade, liberação de estufas, proteção contra saldos negativos e blindagem de segurança atuem corretamente. A cobertura esperada é superior a 70% nas lógicas de negócio.

**Testes de Integração (End-to-End/Rotas)**: Realizados utilizando o `Supertest` interagindo com o `App.js` e um banco `MongoDB Memory Server` real isolado. Validam a interligação das rotas, middlewares de autenticação, validação Zod e gravação final no banco de dados com seed.

**Testes Manuais**: Realizados pontualmente pelos desenvolvedores via `Postman` e interface do `Swagger`, para garantir que os fluxos complexos (como a visualização do histórico paginado no front-end) possuam a formatação correta de Payload e status codes esperados HTTP.


## 6 - Ambiente e Ferramentas

Os testes serão feitos em ambiente local e de CI/CD (Pipeline), utilizando as mesmas chaves e parâmetros contidos nas variáveis de ambiente padronizadas para desenvolvimento.

Ferramenta | Time | Descrição 
-----------|--------|--------
**Postman / Swagger UI** | Desenvolvimento | Ferramentas para documentação e realização de testes manuais de API.
**Jest** | Desenvolvimento | Framework principal de asserção, utilizado tanto para testes unitários quanto integração.
**Supertest** | Desenvolvimento | Biblioteca utilizada para simular requisições HTTP REST nos testes de Endpoints.
**MongoDB Memory Server** | Desenvolvimento | Sobe um binário real do MongoDB na memória RAM para garantir testes de banco rápidos, independentes e descartáveis.


## 7 - Classificação de Bugs

Durante a execução, os problemas encontrados serão classificados conforme a severidade no rastreio da regra de negócio:

ID | Nível de Severidade | Descrição 
---|---------------------|--------
1 | **Blocker** | • Crash da API (Ex: Loop infinito em transação).<br>• Geração de saldo negativo irreversível no estoque.<br>• Falha na segurança permitindo acesso anônimo a relatórios.
2 | **Grave** | • Cálculo incorreto de mortalidade ou estorno falhando em devolver saldo.<br>• Estufa não sendo liberada após a finalização do lote.
3 | **Moderada** | • Paginação não retornando o total correto de páginas.<br>• Mensagem de erro "genérica" retornando ao invés de detalhe de validação.<br>• Bypass inofensivo de campos que deveriam ser ignorados.
4 | **Pequena** | • Erro de digitação nas respostas (typos).<br>• Variáveis sobrando nos objetos de resposta (ex: `__v` do mongo).


## 8 - Definição de Pronto (Definition of Done)

Uma funcionalidade/história de usuário (Épico) será considerada pronta quando:
1. O código estiver mesclado na branch principal sem conflitos.
2. Não existirem bugs classificados como Blocker ou Grave em aberto.
3. Os Testes Unitários dos respectivos Services passarem com 100% de sucesso.
4. Os Testes de Integração (Rotas) baterem no endpoint e retornarem os Status Codes estabelecidos no Swagger.
5. A documentação (Markdown/Swagger) estiver atualizada para o front-end consumir.
