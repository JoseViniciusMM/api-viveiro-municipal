import { readdirSync } from 'fs';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

const PATHS_DIR   = join(__dirname, '../paths');
const SCHEMAS_DIR = join(__dirname, '../schemas');

const SCHEMAS_EXCLUDE = new Set(['swaggerCommonResponses.js']);

async function autoImportDir(dir, exclude = new Set()) {
    const files = readdirSync(dir)
        .filter(f => f.endsWith('.js') && !f.startsWith('.') && !exclude.has(f))
        .sort();

    const merged = {};

    for (const file of files) {
        try {
            const url = pathToFileURL(join(dir, file)).href;
            const mod = await import(url);
            Object.assign(merged, mod.default ?? mod);
        } catch (err) {
            console.warn(`[swagger] Falha ao importar ${file}:`, err.message);
        }
    }

    return merged;
}

const getServersInCorrectOrder = () => {
    const devUrl  = { url: process.env.SWAGGER_DEV_URL  || 'http://localhost:7340' };
    const prodUrl = { url: process.env.SWAGGER_PROD_URL || 'http://localhost:80'   };

    if (process.env.NODE_ENV === 'production') return [prodUrl, devUrl];
    return [devUrl, prodUrl];
};

const getSwaggerOptions = async () => {
    const [allPaths, allSchemas] = await Promise.all([
        autoImportDir(PATHS_DIR),
        autoImportDir(SCHEMAS_DIR, SCHEMAS_EXCLUDE),
    ]);

    return {
        swaggerDefinition: {
            openapi: '3.0.0',
            info: {
                title: 'API Viveiro Municipal',
                version: '1.0.0',
                description: `API do Sistema de Gestão de Viveiro Municipal.

## Como autenticar
1. Execute **POST /auth/login** com email e senha
2. Copie o \`token\` da resposta
3. Clique em **Authorize** (cadeado) e cole **apenas o seu token**

## Cargos
- **Administrador** — acesso total
- **Operador** — operações do dia a dia`,
            },
            servers: getServersInCorrectOrder(),
            tags: [
                { name: 'Auth',          description: 'Autenticação e autorização'                },
                { name: 'Usuários',      description: 'Gestão de usuários do sistema'             },
                { name: 'Espécies',      description: 'Cadastro e gestão de espécies do viveiro'  },
                { name: 'Estufas',       description: 'Gestão de estufas e espaços físicos'       },
                { name: 'Lotes',         description: 'Controle de lotes de produção'             },
                { name: 'Movimentações', description: 'Entradas, saídas e expedições'             },
                { name: 'Destinatários', description: 'Cadastro de destinatários das expedições'  },
                { name: 'Relatórios',    description: 'Relatórios gerenciais'                     },
                { name: 'Auditoria',     description: 'Registros de auditoria do sistema'         },
                { name: 'Dashboard',     description: 'Dados analíticos para dashboards'          },
            ],
            paths: allPaths,
            security: [{ bearerAuth: [] }],
            components: {
                securitySchemes: {
                    bearerAuth: {
                        type: 'http',
                        scheme: 'bearer',
                        bearerFormat: 'JWT',
                    },
                },
                schemas: allSchemas,
            },
        },
        apis: ['./src/routes/*.js'],
    };
};

export default getSwaggerOptions;