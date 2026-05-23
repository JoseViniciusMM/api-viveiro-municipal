## 1. Autenticação e Acesso

### `1.1 POST /login`

**Caso de Uso:**  
Permitir que servidores e administradores entrem no sistema utilizando credenciais seguras para acessar as ferramentas de manejo do viveiro.

---

**Regras de Negócio:**

- **Verificação de Credenciais:**  
  Validar CPF e Senha contra a base de dados.

- **Bloqueio de Usuários:**  
  Impedir o login de contas com status "Inativo" (Soft Delete).

- **Direcionamento de Fluxo:**  
  Validar o nível de acesso (Administrador ou Operador) para que o sistema saiba redirecionar o usuário à tela da Sementeira após o sucesso.

---

**Resultado:**  
Retorno dos tokens de acesso e dados básicos do servidor logado (nome, perfil e status).  
Em caso de falha, retorno de erro de credenciais inválidas ou conta inativa.

---

## 2. Gestão de Usuários (/usuarios)

### `2.1 POST /usuarios`

**Caso de Uso:**  
Registrar novos servidores no sistema PAMINE e disparar o convite por e-mail.

---

**Regras de Negócio:**

- **Atributos Obrigatórios:**  
  Exigir Nome, CPF, E-mail, Telefone e Cargo (conforme TIPO_USUARIO_ENUM). O campo "Senha" não é preenchido nesta etapa.

- **Unicidade:**  
  Bloquear cadastros com CPF ou E-mail já existentes no banco de dados.

- **Status Inicial:**  
  Novos registros iniciam automaticamente com o status "Pendente".

- **Fluxo de Segurança:**  
  O sistema deve gerar um `token_ativacao` único com data de expiração e disparar o e-mail de ativação.

---

**Resultado:**  
Usuário criado com status pendente e e-mail de convite enviado.

---

### `2.2 GET /usuarios`

**Caso de Uso:**  
Listar e gerenciar servidores cadastrados para controle administrativo.

---

**Regras de Negócio:**

- **Paginação e Filtros:**  
  Implementar listagem paginada com filtros por Nome, Cargo ou Status (Ativo, Inativo, Pendente).

- **Segurança de Dados:**  
  O campo Senha deve ser omitido do retorno da consulta.

- **Acesso Restrito:**  
  Endpoint disponível apenas para perfis de nível Administrador.

---

**Resultado:**  
Lista de usuários e metadados de paginação.

---

### `2.3 PATCH/PUT /usuarios/:id`

**Caso de Uso:**  
Atualizar informações cadastrais, alterar cargos ou inativar contas pelo Administrador.

---

**Regras de Negócio:**

- **Edição de Campos:**  
  Permite a alteração de dados do perfil, incluindo Nome, Telefone, CPF e E-mail, além de Cargo e Status.

- **Soft Delete:**  
  Inativação de contas via campo Status para preservar o histórico de auditoria.

- **Gestão de Convites:**  
  Permite que o administrador reenvie o e-mail de ativação caso o usuário ainda possua o status "Pendente".

---

**Resultado:**  
Registro atualizado com sucesso no banco de dados.

---

### `2.4 POST /usuarios/confirmar-cadastro`

**Caso de Uso:**  
Permitir que o servidor defina sua senha inicial e ative sua conta através do link de confirmação recebido por e-mail.

---

**Regras de Negócio:**

- **Validação de Token:**  
  O sistema deve validar a integridade e a expiração do token de ativação enviado via e-mail.

- **Criptografia:**  
  A senha fornecida pelo usuário deve ser processada via bcrypt (Hash) antes da persistência.

- **Ativação de Conta:**  
  Após a definição bem-sucedida da senha, o status do usuário deve ser alterado de "Pendente" para "Ativo".

---

**Resultado:**  
Senha definida e conta ativada com sucesso para o primeiro acesso.

---

### `2.5 PATCH /usuarios/perfil`

**Caso de Uso:**  
Permitir que o servidor logado atualize suas próprias informações básicas e altere sua senha de acesso.

---

**Regras de Negócio:**

- **Edição Restrita:**  
  O usuário pode alterar apenas Nome, E-mail e Telefone. Alterações de Cargo ou Status são bloqueadas neste endpoint.

- **Atualização de Segurança:**  
  Se a senha for alterada, o novo valor deve passar obrigatoriamente pelo processo de re-hashing via bcrypt.

- **Identificação:**  
  O sistema deve identificar o usuário através do token de autenticação da sessão ativa.

---

**Resultado:**  
Perfil pessoal atualizado com sucesso.

---

### `2.6 POST /usuarios/esqueceu-senha`

**Caso de Uso:**  
Iniciar o fluxo de recuperação para usuários que esqueceram o acesso.

---

**Regras de Negócio:**

- **Geração de Token:**  
  Gerar `token_reset_senha` e `token_reset_expira` (validade de 1 hora) para o e-mail informado.

---

**Resultado:**  
E-mail de recuperação enviado com sucesso.

---

## 3. Sementeira (/especies)

### `3.1 POST /especies`

**Caso de Uso:**  
Cadastrar novas espécies botânicas no catálogo do viveiro, suportando o registro em lote de múltiplos itens simultaneamente.

---

**Regras de Negócio:**

- **Validação de Atributos Obrigatórios:**  
  Exigir Nome Popular, Variedade, Categoria e Tipo (Semente ou Muda). O Nome Científico é opcional.

- **Saldo Inicial e Movimentação Automática:**  
  A API aceita a inserção de uma quantidade inicial no ato do cadastro. O sistema registra a espécie com o status "Ativo" e, por baixo dos panos, gera automaticamente uma movimentação de "Entrada" correspondente ao valor informado. Isso garante que todo o saldo nasça rastreado.

---

**Resultado:**  
Espécie(s) registrada(s) com sucesso e saldo inicial devidamente contabilizado no inventário.

---

### `3.2 GET /especies`

**Caso de Uso:**  
Listar as sementes e mudas do catálogo junto com seus saldos físicos atuais para a tabela principal.

---

**Regras de Negócio:**

- **Filtros Específicos:**  
  Permitir filtragem combinada por atributos (Categoria, Tipo, Status) e busca rápida textual pelo nome da planta.

---

**Resultado:**  
Lista de espécies contendo o saldo atualizado em tempo real e os metadados de paginação.

---

### `3.3 GET /especies/:id`

**Caso de Uso:**  
Retornar os detalhes completos de uma única espécie para preencher os pop-ups de "Detalhes da Espécie" e "Editar Espécie".

---

**Regras de Negócio:**

- **Retorno Completo:**  
  Deve trazer todos os campos cadastrais, incluindo o bloco de anotações/observações de manejo e a data original de registro.

---

**Resultado:**  
Objeto JSON detalhado da planta solicitada.

---

### `3.4 PATCH /especies/:id`

**Caso de Uso:**  
Atualizar dados cadastrais de uma espécie (nome, variedade, categoria, anotações) ou alterar seu status (inativação).

---

**Regras de Negócio:**

- **Blindagem de Estoque:**  
  É estritamente proibida a alteração manual dos campos "Quantidade" e "Tipo" através desta rota. Qualquer correção de saldo deve ser obrigatoriamente roteada pelo módulo de `/movimentacoes` (Ajuste de Estoque), garantindo a integridade da auditoria.

---

**Resultado:**  
Registro atualizado com sucesso e log de edição gerado.

---

### `3.5 GET /especies/:id/historico`

**Caso de Uso:**  
Alimentar a tabela "Histórico da Espécie" presente dentro do modal de detalhes.

---

**Regras de Negócio:**

- **Linha do Tempo Específica:**  
  O sistema deve buscar no log de auditoria e movimentações apenas os eventos atrelados àquele ID (ex: "Semente cadastrada", "Mudança de Variedade", "Ajuste de Estoque"), retornando a data, a ação executada e o usuário responsável.

---

**Resultado:**  
Lista cronológica de ações relacionadas à vida útil daquela espécie específica.

---

## 4. Movimentações (/movimentacoes)

### `4.1 POST /movimentacoes`

**Caso de Uso:**  
Registrar entradas, saídas manuais, expedição de lote ou ajustes de inventário para manter o saldo digital idêntico ao físico.

---

**Regras de Negócio:**

- **Validação de Atributos:**  
  É obrigatório o envio de `especie_id`, `tipo` (Entrada, Saída, Ajuste, Perda, Expedição), `quantidade`, `justificativa` e `usuario_id`.

- **Ações Imediatas (Cálculo de Saldo):**  
  Se `tipo` for ENTRADA ou AJUSTE (positivo), o sistema deve somar a quantidade ao campo `quantidade_atual` da Espécie. Se `tipo` for SAIDA, PERDA, EXPEDICAO ou AJUSTE (negativo), o sistema deve subtrair a quantidade do saldo da Espécie.

- **Vínculo de Lote:**  
  Se o tipo for PERDA ou EXPEDICAO, o `lote_id` deve ser validado para garantir que a baixa ocorra no lote correto.

- **Expedição:**  
  Se o tipo for EXPEDICAO, o campo `destinatario_id` torna-se obrigatório.

- **Registro de Auditoria:**  
  Toda operação deve gerar automaticamente um log contendo o ID do usuário autenticado.

- **Validação de Destino:**  
  O sistema deve validar se o destinatário selecionado existe e está com status "Ativo".

---

**Resultado:**  
Movimentação registrada com sucesso (Status 201) e saldo da espécie atualizado em tempo real na sementeira.

---

### `4.2 POST /movimentacoes/:id/estorno`

**Caso de Uso:**  
Estornar uma movimentação inserida por engano, corrigindo o saldo sem apagar o histórico original.

---

**Regras de Negócio:**

- **Ação Inversa Automática:**  
  O sistema deve localizar a movimentação original pelo ID e gerar uma nova movimentação com o valor inverso.

- **Rastreabilidade de Erro:**  
  A nova movimentação de estorno deve conter uma referência (campo `justificativa` ou metadado) ao ID da movimentação incorreta.

- **Recálculo de Saldo:**  
  O saldo da Espécie vinculada deve ser atualizado automaticamente após a criação do registro compensatório.

---

**Resultado:**  
Nova movimentação criada com sucesso (Status 201) e saldo da sementeira recalculado com registro de auditoria atualizado.

---

### `4.3 GET /movimentacoes`

**Caso de Uso:**  
Listagem geral de todo o histórico do viveiro para auditoria e controle de fluxo.

---

**Regras de Negócio:**

- **Filtros Avançados:**  
  Deve permitir filtrar por tipo (ex: só ver Estornos), `data_inicio`/`data_fim` e `usuario_id`.

- **Paginação:**  
  Obrigatória para suportar grandes volumes de dados (ex: 20 registros por página).

- **Populate (Vínculos):**  
  O retorno deve incluir os nomes (não apenas IDs) da Espécie, do Usuário e do Lote (se houver).

- **Ordenação:**  
  Exibição cronológica inversa (da mais recente para a mais antiga).

---

**Resultado:**  
Lista paginada de movimentações (Status 200).

---

### `4.4 GET /movimentacoes/especie/:especie_id`

**Caso de Uso:**  
Analisar o histórico de estoque de uma semente ou muda específica (Rastreio de Consumo).

---

**Regras de Negócio:**

- **Isolamento:**  
  Retorna apenas as movimentações vinculadas à espécie informada no parâmetro.

- **Visão de Saldo:**  
  Útil para entender por que o saldo de uma espécie está baixo (ex: verificar se houve muita "Perda" ou muita "Saída para Lote").

---

**Resultado:**  
Histórico filtrado por espécie (Status 200).

---

### `4.5 GET /movimentacoes/lote/:lote_id`

**Caso de Uso:**  
Consultar todas as ações que afetaram um lote específico (Mortalidade e Expedição).

---

**Regras de Negócio:**

- **Rastreabilidade do Lote:**  
  Esta é a rota que alimenta a "Linha do Tempo" do lote.

- **Eventos Críticos:**  
  Deve listar desde a saída da sementeira para a criação do lote até a expedição final ou registros de mortalidade intermediários.

---

**Resultado:**  
Histórico completo de vida do lote (Status 200).

---

### `4.6 GET /movimentacoes/:id`

**Caso de Uso:**  
Ver os detalhes completos de uma única movimentação (Justificativa técnica).

---

**Regras de Negócio:**

- **Detalhamento:**  
  Exibe o texto completo da justificativa, nome do usuário, tipo da movimentação etc.

- **Vínculo de Estorno:**  
  Se a movimentação for um estorno, deve exibir o ID da movimentação original que ela corrigiu.

- **Populate de Destinatário:**  
  Se for uma expedição, o retorno deve incluir os dados do destinatário vinculado.

---

**Resultado:**  
Objeto detalhado da movimentação (Status 200).

---

## 5. Estufas (/estufas)

### `5.1 POST /estufas`

**Caso de Uso:**  
Registrar os espaços físicos do viveiro municipal para armazenamento de lotes.

---

**Regras de Negócio:**

- **Validação de Atributos Obrigatórios:**  
  O sistema deve exigir os campos de endereço interno (Localização da Estufa, Localização da Barraca e Localização da Posição) e a Capacidade Total de mudas.

- **Definição de Status Inicial:**  
  Toda nova estufa deve ser salva obrigatoriamente com o status "Livre".

- **Formatação de Identificador:**  
  O sistema deve gerar um identificador único (ex: `E01-B03-05`) concatenando as três localizações para facilitar a busca e organização na listagem.

---

### `5.2 GET /estufas`

**Caso de Uso:**  
Listar e filtrar estufas para gestão de espaço e preenchimento de formulários de alocação de lotes.

---

**Regras de Negócio:**

- **Cálculo de Ocupação:**  
  A listagem deve retornar a relação Quantidade Atual / Capacidade Total (ex: 500/800).

- **Indicadores de Status:**  
  Disponível para estufas com 0% de ocupação ou espaço disponível; Indisponível para estufas que atingiram 100% da capacidade total.

- **Filtros de Interface:**  
  A API deve suportar filtros por status (`?status=Livre`) e busca textual pelo código identificador gerado.

---

### `5.3 GET /estufas/:id`

**Caso de Uso:**  
Visualizar o detalhamento técnico de uma posição específica e quais lotes estão ocupando o espaço no momento.

---

**Regras de Negócio:**

- **Visão de Ocupação:**  
  Além dos dados básicos, o sistema deve retornar a lista de todos os lotes com status "ATIVO" vinculados a este `estufa_id`.

- **Cálculo de Disponibilidade:**  
  Deve exibir de forma clara o "Espaço Restante" (Capacidade Total - Soma da Quantidade Atual dos Lotes).

- **Populate:**  
  Trazer os dados resumidos dos lotes (Código e Espécie) para evitar que o usuário tenha que sair da tela.

---

**Resultado:**  
Objeto detalhado da estufa e seus ocupantes atuais (Status 200).

---

### `5.4 PATCH /estufas/:id`

**Caso de Uso:**  
Atualizar informações da estufa ou alterar seu estado operacional (ex: colocar em manutenção).

---

**Regras de Negócio:**

- **Bloqueio por Manutenção:**  
  Se o status for alterado para "MANUTENÇÃO", o sistema deve impedir a criação de novos lotes para este ID, mesmo que haja capacidade física.

- **Alteração de Capacidade:**  
  Se a capacidade total for reduzida, o sistema deve validar se a nova capacidade ainda comporta os lotes existentes. Se não comportar, a alteração deve ser bloqueada.

- **Atualização de Identificador:**  
  Caso mude a Barraca ou Posição, o sistema deve reconstruir o identificador único (ex: `E01-B03-05`).

---

**Resultado:**  
Dados da estufa atualizados com sucesso (Status 200).

---

### `5.5 DELETE /estufas/:id`

**Caso de Uso:**  
Desativar permanentemente uma posição física do sistema.

---

**Regras de Negócio:**

- **Validação de Esvaziamento:**  
  O sistema proíbe a exclusão de uma estufa que possua lotes ativos. O usuário deve primeiro mover ou finalizar os lotes.

- **Soft Delete:**  
  Para manter o histórico de auditoria, a estufa deve ter seu status alterado para "INATIVO" em vez de ser apagada do banco de dados.

---

**Resultado:**  
Estufa desativada com sucesso (Status 200 ou 204).

---

## 6. Lotes (/lotes)

### `6.1 POST /lotes`

**Caso de Uso:**  
Iniciar o ciclo de produção, alocando sementes em uma estufa disponível.

---

**Regras de Negócio:**

- **Validação de Espaço:**  
  Verificar se a `capacidade_maxima` da estufa suporta o novo lote somado aos lotes ativos já presentes.

- **Reserva de Espaço:**  
  Alterar o status da estufa para "INDISPONÍVEL" apenas se a ocupação atingir 100%.

- **Abatimento de Estoque:**  
  Gerar automaticamente uma movimentação de "Saída" na sementeira para a espécie utilizada.

---

**Resultado:**  
Lote gerado com sucesso (Status 201) e ocupação física registrada.

---

### `6.2 PATCH /lotes/:id/fase`

**Caso de Uso:**  
Evoluir o lote entre as fases biológicas (Semeadura, Germinação, Produção, Pronto).

---

**Regras de Negócio:**

- **Evolução de Manejo:**  
  Atualiza a fase para controle da equipe de campo.

- **Sinalização de Prontidão:**  
  Quando o lote atinge a fase "PRONTO", ele fica habilitado para ser selecionado na rota de Expedição (Movimentações).

---

**Resultado:**  
Status biológico atualizado no sistema.

---

### `6.3 POST /lotes/:id/mortalidade`

**Caso de Uso:**  
Registrar perdas técnicas de mudas durante o cultivo.

---

**Regras de Negócio:**

- **Ajuste de Saldo Vivo:**  
  Subtrair a quantidade perdida do saldo do lote e da espécie.

- **Rastro de Perda:**  
  Gerar automaticamente uma movimentação do tipo MORTALIDADE com justificativa obrigatória e `usuario_id`.

- **Recálculo de Vagas:**  
  Se a perda reduzir a ocupação da estufa para menos de 100%, o status da estufa retorna para "DISPONÍVEL".

---

**Resultado:**  
Saldo do lote reduzido e histórico de perda documentado.

---

### `6.4 GET /lotes/:id/historico`

**Caso de Uso:**  
Visualizar a rastreabilidade completa do lote, desde a semente até a saída definitiva.

---

**Regras de Negócio:**

- **Consolidação de Dados:**  
  O sistema deve reunir a espécie de origem, data de plantio, todas as trocas de fase e registros de mortalidade.

- **Linha do Tempo:**  
  Apresentar os eventos em ordem cronológica com a identificação dos usuários que realizaram cada ação.

---

**Resultado:**  
Relatório detalhado da vida útil do lote gerado para o usuário.

---

### `6.5 GET /lotes`

**Caso de Uso:**  
Listagem dinâmica de lotes com filtros avançados para controle de produção e manejo.

---

**Regras de Negócio:**

- **Busca Global (Campo Search):**  
  Deve permitir filtragem por texto parcial que coincida com qualquer um dos campos presentes na tela de Lotes.

- **Filtros de Coluna (Botão Filtro):**  
  A API deve suportar filtros específicos para cada coluna da tabela: `especie_id`, `estufa_id`, `data_inicio` (intervalo de datas), `fase` (estágio biológico) e `status` (Ativo/Inativo).

---

**Resultado:**  
Lista de lotes filtrada conforme a seleção do usuário (Status 200).

---

### `6.6 GET /lotes/:id`

**Caso de Uso:**  
Abrir o card detalhado de um lote específico para realizar manejos ou consultas.

---

**Regras de Negócio:**

- **Visão Detalhada:**  
  Retorna todos os dados do lote, incluindo o array completo de `itens_especies` com as quantidades iniciais e atuais.

---

**Resultado:**  
Objeto detalhado do lote retornado (Status 200).

---

### `6.7 PATCH /lotes/:id/transferir`

**Caso de Uso:**  
Mover um lote de uma posição física para outra (ex: da Germinação para uma Estufa de Crescimento).

---

**Regras de Negócio:**

- **Validação de Destino:**  
  O sistema deve verificar se a nova estufa possui capacidade disponível para receber a quantidade atual do lote.

- **Troca de Vagas:**  
  O sistema libera o espaço na estufa de origem (recálculo de status "Disponível") e ocupa o espaço na estufa de destino (recálculo de status "Indisponível" se atingir 100%).

- **Registro de Auditoria:**  
  Gravar no log que o lote mudou de localização física.

---

**Resultado:**  
Lote atualizado com a nova localização e capacidades das estufas recalculadas.

---

### `6.8 DELETE /lotes/:id`

**Caso de Uso:**  
Descartar um lote inteiro por erro de entrada ou perda total.

---

**Regras de Negócio:**

- **Movimentação de Ajuste:**  
  O sistema deve gerar automaticamente uma movimentação de "PERDA_TOTAL" na sementeira para zerar o saldo técnico daquela produção.

- **Liberação Imediata:**  
  A estufa vinculada tem seu espaço liberado imediatamente.

- **Justificativa:**  
  Exigir um motivo para o cancelamento, que será registrado como uma movimentação de "PERDA TOTAL".

---

**Resultado:**  
Lote desativado e espaço físico liberado no viveiro.

---

## 7. Relatórios e Auditoria (/relatorios e /auditoria)

### `7.1 GET /relatorios/lotes`

**Caso de Uso:**  
Gerar um relatório gerencial com o histórico completo dos ciclos de produção (do plantio à finalização).

---

**Regras de Negócio:**

- **Filtros Flexíveis:**  
  Permitir busca por intervalo de datas, espécie e fase atual.

- **Consolidação:**  
  O retorno deve trazer os dados mastigados (Sementes Iniciais vs. Quantidade Atual vs. Perdas Totais) para facilitar a visualização em tabela.

---

**Resultado:**  
Lista consolidada do histórico de lotes pronta para renderização.

---

### `7.2 GET /relatorios/movimentacoes`

**Caso de Uso:**  
Listar de forma analítica todas as entradas, saídas e ajustes de estoque do viveiro.

---

**Regras de Negócio:**

- **Rastreabilidade de Origem/Destino:**  
  O retorno deve obrigatoriamente trazer as justificativas (ex: "Coleta em campo", "Doação") e o usuário responsável pela ação.

---

**Resultado:**  
Histórico físico do inventário em um período determinado.

---

### `7.3 GET /relatorios/mortalidade`

**Caso de Uso:**  
Gerar consolidados analíticos sobre perdas de mudas no cultivo para identificar gargalos de manejo e pragas.

---

**Regras de Negócio:**

- **Filtros Específicos:**  
  Obrigatório o filtro por intervalo de datas, com suporte a filtro por espécie botânica e estufa.

- **Retorno de Relacionamentos:**  
  Trazer as justificativas preenchidas nos registros de mortalidade para análise qualitativa.

---

**Resultado:**  
Estrutura de dados contendo o detalhamento dos óbitos das plantas.

---

### `7.4 GET /relatorios/:tipo/exportar`

**Caso de Uso:**  
Exportar os dados em tela (Lotes, Movimentações, Mortalidade ou Auditoria) para arquivos físicos.

---

**Regras de Negócio:**

- **Parametrização de Formato:**  
  A rota deve aceitar um parâmetro (ex: `?formato=pdf` ou `?formato=excel`) juntamente com os filtros aplicados em tela.

- **Geração Dinâmica:**  
  O servidor processa os dados e compila o arquivo de forma assíncrona.

---

**Resultado:**  
Retorna um Buffer/Stream do arquivo (binário) permitindo o download direto pelo navegador, sem expor caminhos internos do servidor.

---

### `7.5 GET /auditoria/logs`

**Caso de Uso:**  
Monitorar e rastrear de forma imutável todas as ações executadas no sistema PAMINE.

---

**Regras de Negócio:**

- **Controle de Permissão Rígido:**  
  Assegurar via middleware que apenas usuários com a role "Administrador" possam consumir este endpoint.

- **Retorno de Relacionamentos:**  
  Retornar cronologicamente o "Quem" (Usuário), "O Quê" (Ação: Criar, Editar, Excluir, Movimentar) e o "Onde" (Qual registro/ID sofreu a ação).

---

**Resultado:**  
Lista cronológica, não-editável e rastreável dos eventos do sistema.

---

## 8. Dashboard e Início (/dashboard)

### `8.1 GET /dashboard/geral`

**Caso de Uso:**  
Centralizar indicadores de desempenho (KPIs) e dados gráficos em uma única chamada para a visão gerencial do viveiro.

---

**Regras de Negócio:**

- **Agregação Dinâmica:**  
  Realiza o cruzamento de dados das coleções de Lotes, Movimentações e Estufas no momento da requisição (sem salvar dados duplicados).

- **Indicadores de Resumo (Cards):**  
  Retorna os totais de mudas prontas (fase "Pronto"), lotes ativos, saldo da sementeira e a porcentagem global de mortalidade.

- **Métricas Visuais:**  
  Processa o histórico de saídas por período e a taxa de ocupação por setor (Ocupado vs. Disponível).

- **Sistema de Alertas:**  
  Filtra e retorna automaticamente lotes com alta mortalidade ou estufas que atingiram 100% de ocupação.

---

**Resultado:**  
Objeto JSON completo para alimentar todos os componentes da tela de Início (Status 200).

---

## 9. Destinatários (/destinatarios)

### `9.1 POST /destinatarios`

**Caso de Uso:**  
Registrar no sistema as entidades, órgãos públicos ou cidadãos que estão aptos a receber mudas e sementes do viveiro municipal.

---

**Regras de Negócio:**

- **Atributos Obrigatórios:**  
  Exigir Nome/Razão Social, Tipo (Físico ou Jurídico), Categoria (Público, Social ou Privado), Telefone e Setor/Bairro.

- **Validação de Documento:**  
  O campo `documento` (CPF ou CNPJ) deve ser validado conforme o formato e deve ser único na base de dados para evitar duplicidade de beneficiários.

- **Categorização Técnica:**  
  O campo `categoria` deve seguir um ENUM para permitir relatórios consolidados (ex: identificar quanto foi entregue para "Escolas" vs "ONGs").

- **Status Inicial:**  
  Todo novo destinatário é criado automaticamente com o status "Ativo".

- **Auditoria:**  
  A criação deve registrar o `usuario_id` responsável pelo cadastro no log de auditoria.

---

**Resultado:**  
Destinatário cadastrado com sucesso e habilitado para seleções em processos de expedição.

---

### `9.2 GET /destinatarios`

**Caso de Uso:**  
Listar os destinatários para gestão administrativa ou para alimentar componentes de busca (Select) na tela de expedição de lotes.

---

**Regras de Negócio:**

- **Paginação e Busca Dinâmica:**  
  Suportar listagem paginada com busca textual por Nome ou Documento.

- **Filtros de Segmentação:**  
  Permitir filtrar a lista por Categoria (ex: listar apenas "Secretarias") e Status (Ativo/Inativo).

- **Ordenação:**  
  Exibição por ordem alfabética de Nome/Razão Social por padrão.

---

**Resultado:**  
Lista paginada de destinatários e metadados para controle da interface.

---

### `9.3 GET /destinatarios/:id`

**Caso de Uso:**  
Consultar o perfil detalhado de um destinatário, incluindo informações de contato e localização geográfica para logística de entrega.

---

**Regras de Negócio:**

- **Retorno Completo:**  
  Deve exibir todos os campos, incluindo Finalidade Padrão, Vínculo Legal e observações de histórico.

- **Vínculo de Expedições:**  
  Opcionalmente, pode retornar um resumo das últimas expedições vinculadas a este ID (Rastreio de Beneficiário).

---

**Resultado:**  
Objeto JSON detalhado com os dados da entidade ou cidadão.

---

### `9.4 PATCH /destinatarios/:id`

**Caso de Uso:**  
Atualizar dados de contato, endereço ou categoria do destinatário conforme mudanças administrativas ou cadastrais.

---

**Regras de Negócio:**

- **Blindagem de Identidade:**  
  É proibida a alteração do campo `documento` (CPF/CNPJ) após o cadastro inicial. Caso o documento esteja errado, o registro deve ser inativado e um novo deve ser criado, garantindo a integridade dos logs de expedição antigos.

- **Gestão de Status:**  
  Permite reativar um destinatário que foi anteriormente inativado.

---

**Resultado:**  
Dados atualizados no banco de dados e log de alteração registrado na auditoria.

---

### `9.5 DELETE /destinatarios/:id`

**Caso de Uso:**  
Desativar um destinatário que não deve mais receber mudas (ex: órgão extinto ou cidadão com restrições).

---

**Regras de Negócio:**

- **Soft Delete:**  
  O registro nunca é apagado fisicamente. O sistema altera o status para "Inativo".

- **Integridade Referencial:**  
  O sistema impede o vínculo de novos registros a este ID, mas preserva o nome do destinatário em todos os relatórios de expedições já realizadas.

- **Bloqueio de Inativação (Opcional):**  
  O sistema pode impedir a inativação se houver uma expedição com status "Em Trânsito" ou pendente de assinatura.

---

**Resultado:**  
Destinatário inativado com sucesso e removido das listas de seleção ativa.