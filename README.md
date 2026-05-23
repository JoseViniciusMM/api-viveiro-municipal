# 🌿 API Viveiro Municipal

Uma API RESTful desenvolvida em **Node.js** para o gerenciamento de processos e recursos de um Viveiro Municipal. O sistema permite o controle de espécies, estufas, lotes, movimentações de plantas, destinatários, além de contar com um painel de dashboard, relatórios detalhados e logs de auditoria.

---

# 🚀 Tecnologias e Ferramentas

Com base na estrutura do projeto, as principais tecnologias adotadas incluem:

- **Node.js & Express** *(presumido pela estrutura de rotas/middlewares)*
- **Banco de Dados:** Provavelmente MongoDB *(evidenciado pelo `ObjectIdSchema.js`)*
- **Validação de Dados:** Zod (`utils/validators/schemas/zod`)
- **Testes:** Jest (`jest.setup.js` e pasta `test/unit`)
- **Arquitetura:** Camadas (`Routes ➝ Controllers ➝ Services ➝ Repositories`) com Injeção de Dependência/Containers
- **Outros:** Hashing de senhas (`passwordHasher.js`), envio de e-mails (`SendMail.js`) e logs (`logger.js`)

---

# ⚙️ Funcionalidades (Domínios)

A API está dividida nos seguintes módulos/domínios principais:

- 🔐 **Autenticação e Acesso:** Login, gestão de sessões e tokens
- 👥 **Gestão de Usuários:** CRUD e controle de permissões
- 🌱 **Espécies:** Cadastro e gerenciamento das espécies cultivadas
- 🏠 **Estufas:** Controle dos ambientes de cultivo
- 📦 **Lotes:** Gerenciamento dos lotes de plantas/sementes
- 🔄 **Movimentações:** Registro de entrada, saída e transferências
- 🏢 **Destinatários:** Entidades ou pessoas que recebem as plantas
- 📊 **Dashboard:** Dados consolidados para a tela inicial
- 📄 **Relatórios:** Geração de relatórios de produção e saída
- 🔍 **Auditoria (Logs):** Rastreabilidade de ações (quem fez o quê e quando)

---

# 📁 Estrutura do Projeto

O projeto segue uma arquitetura limpa e organizada:

```plaintext
API-VIVEIRO-MUNICIPAL/
├── docs/                  # Documentação da API (Requisitos, Histórias de Usuário, etc.)
├── src/
│   ├── config/            # Configurações gerais (Ex: Conexão com Banco de Dados)
│   ├── constants/         # Constantes do sistema
│   ├── containers/        # Injeção de dependências e registro de serviços/repositórios
│   ├── controllers/       # Lida com as requisições HTTP e envia as respostas
│   ├── middlewares/       # Interceptadores de requisição (Auth, Logs, Tratamento de Erros)
│   ├── models/            # Esquemas de dados/Modelos do banco de dados
│   ├── repositories/      # Camada de acesso a dados (Isola o ORM/ODM)
│   ├── routes/            # Definição dos endpoints da API
│   ├── seed/              # Scripts para popular o banco de dados inicialmente
│   ├── services/          # Regras de negócio da aplicação
│   ├── test/              # Testes unitários focados nos Services
│   └── utils/             # Utilitários (Erros customizados, Helpers, Validadores Zod, Logger)
├── app.js                 # Configuração do aplicativo Express
├── server.js              # Ponto de entrada que inicializa o servidor HTTP
└── ...

