# Requisitos Funcionais - Sistema PAMINE

A tabela abaixo descreve as funcionalidades essenciais e importantes para a gestão do viveiro municipal.

| Identificação | Requisito Funcional        | Descrição                                                                 | Prioridade |
|--------------|---------------------------|---------------------------------------------------------------------------|------------|
| RF-001       | Login e Autenticação      | Permitir acesso via CPF e senha. O sistema deve bloquear usuários com status "Inativo" ou "Pendente". | Essencial  |
| RF-002       | Convite de Usuários       | Administradores criam o perfil básico; o sistema gera um token e envia por e-mail para o servidor definir sua senha. | Essencial  |
| RF-003       | Gestão de Contas          | Permitir editar perfis e inativar usuários. O sistema não permite a exclusão física para preservar logs de auditoria. | Essencial  |
| RF-004       | Cadastrar Espécie         | Registrar espécies na sementeira com nome científico/popular, categoria e permitir inserção de saldo inicial. | Essencial  |
| RF-005       | Consultar Sementeira      | Localizar espécies e sementes utilizando filtros de categoria, tipo (semente/muda) e busca textual. | Essencial  |
| RF-006       | Registrar Movimentação    | Registrar entradas, saídas e ajustes, atualizando o saldo disponível. Deve permitir o estorno de operações incorretas. | Essencial  |
| RF-007       | Cadastrar Estufa          | Registrar espaços físicos com identificação tripla (Estufa, Barraca, Posição) e definir capacidade máxima. | Essencial  |
| RF-008       | Cadastrar Lote            | Criar lotes de produção vinculados a uma espécie e definir a quantidade inicial que sairá da sementeira. | Essencial  |
| RF-009       | Alocar Estufa             | Validar e vincular um lote a uma estufa com status "Livre" ou que possua capacidade volumétrica disponível. | Essencial  |
| RF-010       | Atualizar Status de Lote  | Alterar as fases do ciclo de vida (Germinação, Produção, Pronto). Ao finalizar, liberar o espaço da estufa. | Essencial  |
| RF-011       | Registrar Mortalidade     | Registrar perdas de mudas no lote com justificativa, reduzindo o saldo vivo e gerando registro de movimentação. | Essencial  |
| RF-012       | Consultar Lotes           | Visualizar listagem de lotes ativos e finalizados com suporte a filtros por espécie, estufa e período. | Essencial  |
| RF-013       | Rastreabilidade de Lote   | Exibir o histórico completo de um lote, desde a origem da semente até a expedição final ou mortalidade. | Essencial  |
| RF-014       | Exportação de Dados       | Permitir a exportação de relatórios de estoque, mortalidade e produção nos formatos PDF e Excel. | Essencial  |
| RF-015       | Logs de Auditoria         | Registrar de forma imutável qual usuário realizou cada criação, edição ou movimentação no sistema. | Essencial  |
| RF-016       | Expedição de Lotes        | Permitir a saída total ou parcial de mudas de lotes com status "Pronto", vinculando obrigatoriamente a um destinatário cadastrado, ou o retorno para a sementeira como "Muda". | Essencial  |
| RF-017       | Dashboard Gerencial       | Apresentar indicadores de mudas prontas, taxa de mortalidade e ocupação de estufas na tela inicial. | Importante |
| RF-018       | Gerenciar Destinatários   | Permitir o cadastro de pessoas físicas ou instituições que recebem as mudas. | Essencial  |