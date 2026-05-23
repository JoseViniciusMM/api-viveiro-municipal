## Épico 1: Autenticação e Controle de Acesso (RF-001, RF-002, RF-003, RF-015)

---

### US-001 (RF-002) – Cadastro Centralizado de Usuários (Convite)

**Como** um administrador do sistema,  
**Quero** cadastrar novos servidores fornecendo seus dados básicos e e-mail,  
**Para que** o sistema gerencie o envio de convites e a segurança da senha inicial.

---

**Critérios de Aceite:**

- O formulário de cadastro deve exigir obrigatoriamente: Nome Completo, CPF, E-mail, Telefone e Perfil de Acesso (nenhuma senha deve ser fornecida nesta etapa).
- O sistema deve validar se o CPF e o e-mail informados são únicos e possuem formato válido.
- Ao salvar, o usuário deve ser criado com status "Pendente" por padrão.
- O sistema deve gerar um token único e disparar automaticamente um e-mail para o servidor convidado com o link para definição de senha.
- O administrador não deve ter acesso ao campo de definição de senha do novo usuário.

**Prioridade:** Essencial

---

### US-002 (RF-001) – Login de Usuário via CPF ou E-mail

**Como** um servidor cadastrado pelo administrador,  
**Quero** realizar o login utilizando meu CPF ou E-mail juntamente com minha senha,  
**Para** acessar as ferramentas de manejo do viveiro de forma segura.

---

**Critérios de Aceite:**

- A tela de login deve validar as credenciais (CPF ou E-mail, e a Senha) contra a base de dados.
- O sistema deve impedir o acesso de usuários com status "Inativo", mesmo que a senha esteja correta.
- O sistema deve impedir o acesso de usuários com status "Pendente" que ainda não ativaram a conta.
- Após o sucesso na autenticação, o usuário deve ser redirecionado diretamente para a tela de Dashboard.

**Prioridade:** Essencial

---

### US-003 (RF-002) – Ativação de Conta e Definição de Senha

**Como** um servidor convidado pelo administrador,  
**Quero** utilizar o token recebido por e-mail para cadastrar minha senha pessoal,  
**Para** ativar minha conta e acessar as ferramentas de manejo do viveiro.

---

**Critérios de Aceite:**

- O sistema deve validar a integridade e a expiração do token de ativação enviado por e-mail.
- O formulário de ativação deve exigir a definição de uma senha e a confirmação da mesma.
- A senha deve ser criptografada antes de ser salva no banco de dados.
- Após a definição da senha com sucesso, o status do usuário deve ser alterado de "Pendente" para "Ativo".
- O token deve ser invalidado imediatamente após o primeiro uso com sucesso.

**Prioridade:** Essencial

---

### US-004 (RF-003, RF-015) – Gestão e Inativação de Contas (Soft Delete)

**Como** um administrador,  
**Quero** editar dados de servidores ou inativar seus acessos,  
**Para** manter a base de usuários atualizada e garantir a segurança do sistema.

---

**Critérios de Aceite:**

- O administrador pode editar nome, e-mail, telefone e perfil, mas o CPF deve permanecer inalterável por ser a chave de identidade do usuário.
- O sistema não deve permitir a exclusão física de usuários que já realizaram operações no sistema (Movimentações/Lotes) para preservar os logs de auditoria.
- A remoção de acesso deve ser feita alterando o status para "Inativo" (Soft Delete), bloqueando o login instantaneamente.

**Prioridade:** Essencial

---

### US-005 (RF-003) – Edição de Perfil e Segurança

**Como** um usuário autenticado,  
**Quero** gerenciar meus próprios dados básicos e senha,  
**Para** manter minhas informações de contato atualizadas e minha conta segura.

---

**Critérios de Aceite:**

- O usuário deve poder alterar seu nome, telefone e e-mail de contato. O sistema deve impedir (bloquear) qualquer tentativa do usuário alterar o próprio Cargo ou Status.
- Para realizar a troca de senha, o sistema deve obrigatoriamente exigir a senha atual por questões de segurança.
- O sistema deve garantir que o novo e-mail fornecido não pertença a outro servidor.
- As alterações devem ser validadas e refletidas no banco de dados sem deslogar o usuário da sessão atual.

**Prioridade:** Essencial

---

### US-006 (RF-015) – Hierarquia de Níveis de Acesso

**Como** um administrador,  
**Quero** atribuir perfis de "Administrador" ou "Operador" aos usuários,  
**Para** restringir funções críticas e relatórios estratégicos.

---

**Critérios de Aceite:**

- O perfil "Operador" terá acesso apenas às telas de Dashboard, Sementeira, Lotes, Movimentação e Estufas.
- O perfil "Administrador" terá acesso total, incluindo a gestão de usuários, relatórios e logs de auditoria.
- Botões de ações administrativas (como "Novo Usuário" ou "Auditoria") devem estar ocultos para perfis de nível Operador.

**Prioridade:** Essencial

---

## Épico 2: Sementeira – Gestão de Catálogo e Espécies (RF-004, RF-005, RF-014)

---

### US-007 (RF-004) – Cadastro Técnico de Espécies

**Como** um servidor,  
**Quero** cadastrar novas espécies informando nome popular, variedade, categoria e tipo,  
**Para** estabelecer os registros base que alimentarão os lotes e movimentações.

---

**Critérios de Aceite:**

- O formulário deve exigir o Nome Popular e permitir a inserção opcional do Nome Científico.
- Deve ser possível adicionar múltiplos itens em uma única sessão de cadastro antes de confirmar.
- O sistema deve registrar uma anotação inicial opcional para cada espécie cadastrada.
- Caso seja informada uma `quantidade_inicial` maior que zero, o sistema deve gerar uma Movimentação de "Entrada"

**Prioridade:** Essencial

---

### US-008 (RF-005) – Visualização e Filtros da Sementeira

**Como** um usuário,  
**Quero** visualizar a listagem completa de sementes e mudas com seus respectivos saldos,  
**Para** gerenciar a disponibilidade de insumos para produção.

---

**Critérios de Aceite:**

- A tabela deve exibir: Espécie, Variedade, Categoria, Qtd. Atual e o marcador visual de Tipo (Semente/Muda).
- O sistema deve oferecer busca textual dinâmica e filtros por atributos.

**Prioridade:** Essencial

---

### US-009 (RF-003) – Edição e Inativação de Espécie (Soft Delete)

**Como** um administrador,  
**Quero** editar os dados de uma espécie ou alterar seu status de atividade,  
**Para** corrigir erros de cadastro ou descontinuar o uso de sementes sem apagar o histórico.

---

**Critérios de Aceite:**

- O formulário de edição deve bloquear a alteração manual da "Quantidade" e do "Tipo", que devem ser geridos apenas por movimentações.
- O status deve ser alterado via dropdown (ex: Ativo/Inativo).
- O sistema deve disparar um log de alteração sempre que uma edição for salva.

**Prioridade:** Essencial

---

## Épico 3: Movimentação e Auditoria de Estoque (RF-006, RF-011, RF-013, RF-015)

---

### US-010 (RF-006) – Registro de Entrada e Saída

**Como** um servidor,  
**Quero** registrar movimentações manuais de entrada ou saída informando a origem ou destino,  
**Para que** o saldo físico coincida com o saldo digital do sistema.

---

**Critérios de Aceite:**

- O usuário deve selecionar a espécie e o sistema deve exibir a "Quantidade Disponível" de forma travada para consulta.
- O registro deve exigir obrigatoriamente: Tipo (Entrada/Saída), Quantidade, Origem/Destino e Observações.
- O sistema deve listar as movimentações anteriores daquela espécie específica no rodapé do popup para conferência.

**Prioridade:** Essencial

---

### US-011 (RF-016) – Expedição e Entrega de Mudas

**Como** um servidor do viveiro,  
**Quero** registrar a saída final (total ou parcial) de mudas prontas ou o seu retorno ao estoque como mudas produzidas,  
**Para** encerrar o ciclo de produção, liberar o espaço físico das estufas e documentar o destino das plantas.

---

**Critérios de Aceite:**

- **Filtro de Origem:** O sistema deve permitir a seleção apenas de lotes que estejam na fase "Pronto".
- **Seleção de Itens:** O usuário deve poder selecionar uma espécie específica dentro de um lote para realizar a expedição.
- **Cenários de Saída:**
  - **Saída Total:** Ao despachar todas as mudas, o sistema deve alterar automaticamente o status do lote para "Finalizado" e a estufa vinculada para "Livre".
  - **Saída Parcial:** Permite a retirada de uma quantidade específica; o lote permanece "Ativo" na estufa com o saldo atualizado.
  - **Retorno ao Viveiro:** No caso de mudas que retornam ao estoque para armazenamento, o sistema deve gerar automaticamente um novo registro (ou atualizar saldo) na Sementeira com o tipo "Muda".
- **Dados de Destino:** O sistema deve exigir a seleção de um Destinatário previamente cadastrado (que possua status "Ativo") e a finalidade do uso.
- **Rastreabilidade:** O registro de movimentação do tipo `SAIDA_EXPEDICAO` deve salvar o ID do destinatário para auditoria.

**Prioridade:** Essencial

---

### US-012 (RF-006) – Ajuste Manual de Inventário

**Como** um administrador,  
**Quero** realizar ajustes de correção (+/-) no saldo das espécies,  
**Para** alinhar o sistema após inventários físicos onde houver divergência.

---

**Critérios de Aceite:**

- O sistema deve exibir a quantidade atual e permitir a inserção de um valor positivo ou negativo de ajuste.
- É obrigatório registrar uma justificativa detalhada para o ajuste manual.

**Prioridade:** Essencial

---

### US-013 (RF-015) – Estorno de Movimentações

**Como** um administrador,  
**Quero** estornar uma movimentação realizada indevidamente,  
**Para** corrigir erros operacionais sem deletar o registro original da auditoria.

---

**Critérios de Aceite:**

- A tela de histórico deve possuir um ícone de "Estorno" para cada linha de movimentação.
- Ao estornar, o sistema deve gerar uma nova movimentação inversa (ex: Entrada de 500 vira Saída de 500) vinculada à original.
- O histórico deve preservar o rastro de quem realizou a ação original e quem realizou o estorno.
- O sistema deve **bloquear** o estorno caso ele gere um saldo negativo na sementeira ou tente devolver mudas para um Lote que já está Inativo/Finalizado.

**Prioridade:** Essencial

---

## Épico 4: Gestão de Lotes, Estufas e Mortalidade (RF-007, RF-008, RF-009, RF-010, RF-011, RF-012)

---

### US-014 (RF-007) – Cadastro de Estufas

**Como** um servidor,  
**Quero** cadastrar as estufas do viveiro informando Número da Estufa, Barraca, Posição e Capacidade Máxima,  
**Para que** eu possa organizar a localização física dos lotes em produção.

---

**Critérios de Aceite:**

- O formulário deve conter os campos: Número da Estufa, Barraca, Posição e Capacidade Máxima.
- O sistema deve registrar o status inicial da estufa como "Livre".
- Deve ser possível visualizar quais estufas estão ocupadas e por qual lote.
- O sistema deve concatenar o ID Visual (Ex: E01-B01-01) automaticamente, bloquear conflitos no mesmo espaço e bloquear a diminuição da capacidade física para um valor menor que a quantidade do lote atual ali dentro.

**Prioridade:** Essencial

---

### US-015 (RF-008, RF-009) – Abertura de Lote e Alocação em Estufa

**Como** um servidor,  
**Quero** criar um novo lote vinculando uma semente e uma estufa livre,  
**Para** iniciar o ciclo de produção e reservar o espaço físico necessário.

---

**Critérios de Aceite:**

- O usuário deve selecionar uma espécie da sementeira e informar a quantidade inicial de sementes, e o sistema deve barrar a ação se a Sementeira não tiver saldo ou se a quantidade exceder a Estufa alvo.
- O sistema deve permitir apenas a seleção de estufas que estejam com status "Livre".
- Ao salvar, o sistema deve gerar um código único para o lote e mudar o status da estufa para "Ocupada".
- O sistema deve realizar uma saída automática na sementeira correspondente à quantidade iniciada no lote.

**Prioridade:** Essencial

---

### US-016 (RF-011) – Registro de Mortalidade e Movimentação

**Como** um operador,  
**Quero** registrar a mortalidade de mudas dentro de um lote específico,  
**Para** manter o saldo do lote real e gerar um rastro de perda na sementeira.

---

**Critérios de Aceite:**

- A tela de movimentação do lote deve permitir a inserção da quantidade de mudas perdidas e a justificativa.
- O sistema deve subtrair a quantidade informada do saldo atual do lote.
- Deve ser gerado um registro automático de movimentação do tipo "Mortalidade" vinculado ao lote

**Prioridade:** Essencial

---

### US-017 (RF-010) – Atualização de Status e Finalização de Lote

**Como** um servidor,  
**Quero** atualizar as fases do lote (Germinação, Produção, Pronto ou Finalizado),  
**Para** controlar o progresso da produção e liberar o espaço da estufa ao concluir.

---

**Critérios de Aceite:**

- O usuário deve poder alterar o status conforme o lote evolui no viveiro.
- Ao marcar o lote como "Finalizado", o status da estufa vinculada deve retornar automaticamente para "Livre".

**Prioridade:** Essencial

---

### US-018 (RF-012) – Consulta e Filtros de Lotes

**Como** um usuário,  
**Quero** consultar a listagem de lotes ativos e finalizados utilizando filtros avançados,  
**Para** acompanhar a produtividade e o histórico de cada plantio.

---

**Critérios de Aceite:**

- Deve haver filtros por Espécie, Estufa, Status e Intervalo de Datas.
- A listagem deve exibir de forma clara o saldo atual de mudas vivas (Quantidade Inicial - Mortalidade).

**Prioridade:** Essencial

---

## Épico 5: Relatórios e Auditoria (RF-013, RF-014, RF-015)

---

### US-019 (RF-013) – Rastreabilidade Completa do Lote

**Como** um usuário,  
**Quero** visualizar o histórico detalhado de um lote, desde a origem da semente até a muda pronta,  
**Para** garantir o controle de qualidade e a procedência de cada planta produzida.

---

**Critérios de Aceite:**

- O sistema deve exibir uma linha do tempo ou histórico contendo: dados da sementeira de origem, data de início, movimentações de mortalidade e alterações de status.
- Deve ser possível identificar qual servidor foi responsável por cada etapa do processo.
- O histórico deve exibir obrigatoriamente o Destinatário final caso o lote tenha sido expedido.

**Prioridade:** Essencial

---

### US-020 (RF-013, RF-014) – Geração de Relatórios dos Módulos

**Como** um gestor,  
**Quero** gerar relatórios analíticos e exportáveis para os diversos módulos do sistema (Espécies, Lotes, Movimentações, Mortalidade, Destinatários, etc.),  
**Para** ter uma visão global da operação, identificar gargalos e fundamentar tomadas de decisão.

---

**Critérios de Aceite:**

- O sistema deve disponibilizar extração de relatórios para as principais entidades do sistema.
- Deve ser possível aplicar filtros dinâmicos adequados a cada contexto (ex: período, espécie, estufa, status, destinatário).
- Os relatórios devem consolidar os dados essenciais para leitura gerencial.
- O sistema deve permitir a exportação de qualquer um desses relatórios em formato PDF e Excel.

**Prioridade:** Essencial

---

### US-021 (RF-015) – Monitoramento via Logs de Auditoria

**Como** um administrador,  
**Quero** consultar os logs de auditoria do sistema,  
**Para** monitorar as ações dos usuários e garantir a integridade dos registros de movimentação.

---

**Critérios de Aceite:**

- O sistema deve listar cronologicamente: Usuário, Ação realizada (Criar, Editar, Excluir, Movimentar), Data/Hora e Registro afetado.
- Deve ser possível filtrar os logs por um usuário específico ou por tipo de operação.

**Prioridade:** Essencial

---

### US-022 (RF-018) – Gestão de Destinatários

**Como** servidor,  
**Quero** cadastrar pessoas e entidades destinatárias,  
**Para** agilizar o processo de expedição e garantir a rastreabilidade das entregas.

---

**Critérios de Aceite:**

- O cadastro deve validar se o CPF/CNPJ e o E-mail são únicos e válidos. A alteração de documentos deve ser barrada na edição.
- O sistema deve listar destinatários ativos para seleção no momento da expedição.
- Deve permitir a busca rápida por nome, tipo de entidade ou documento.
- A exclusão deve ser lógica (Soft Delete) para não quebrar o histórico de auditoria.

**Prioridade:** Essencial

---

### US-023 (RF-017) – Dashboard e Indicadores em Tempo Real

**Como** um gestor,  
**Quero** consultar indicadores consolidados do viveiro,  
**Para** monitorar rapidamente a ocupação das estufas, mudas prontas e taxas de mortalidade.

---

**Critérios de Aceite:**

- O sistema deve disponibilizar os dados consolidados de: Total de Mudas Prontas, Lotes Ativos e Saldo Total da Sementeira.
- O sistema deve disponibilizar dados de ocupação por setor (E01, E02, etc.) para exibição gráfica no front-end.
- O sistema deve disponibilizar alertas para lotes com alta mortalidade ou estufas com 100% de ocupação.

**Prioridade:** Essencial