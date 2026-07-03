import express from 'express';
import swaggerJsDoc from 'swagger-jsdoc';
import getSwaggerOptions from '../docs/config/head.js';
import dotenv from 'dotenv';

import logRoutes from '../middlewares/LogRoutesMiddleware.js';

import auth          from './authRoutes.js';
import usuarios      from './usuarioRoutes.js';
import auditorias    from './auditoriaRoutes.js';
import dashboard     from './dashboardRoutes.js';
import especies      from './especieRoutes.js';
import estufas       from './estufaRoute.js';
import lotes         from './loteRoutes.js';
import movimentacoes from './movimentacaoRoutes.js';
import relatorios    from './relatorioRoutes.js';
import destinatarios from './destinatarioRoute.js';

dotenv.config();

const routes = async (app) => {
    if (process.env.DEBUGLOG) {
        app.use(logRoutes);
    }

    if (process.env.NODE_ENV !== 'test') {
        const swaggerDocs = swaggerJsDoc(await getSwaggerOptions());

        app.get('/', (req, res) => res.redirect('/docs'));

        app.get('/docs.json', (req, res) => {
            res.setHeader('Content-Type', 'application/json');
            res.json(swaggerDocs);
        });

        app.get('/docs', (req, res) => {
            const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>API Viveiro Municipal — Documentação</title>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css" />
    <style>
        .download-btn {
            position: fixed; top: 10px; right: 20px; z-index: 9999;
            background: #49cc90; color: #fff; padding: 8px 16px;
            border-radius: 4px; text-decoration: none;
            font-family: sans-serif; font-size: 14px; font-weight: bold;
            box-shadow: 0 2px 4px rgba(0,0,0,.2);
        }
        .download-btn:hover { background: #3db47e; }
    </style>
</head>
<body>
    <a href="/docs.json" class="download-btn" download>⬇ JSON</a>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js"></script>
    <script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-standalone-preset.js"></script>
    <script>
        window.onload = function() {
            SwaggerUIBundle({
                spec: ${JSON.stringify(swaggerDocs)},
                dom_id: '#swagger-ui',
                deepLinking: true,
                persistAuthorization: true,
                presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
                plugins: [SwaggerUIBundle.plugins.DownloadUrl],
                layout: 'StandaloneLayout',
            });
        };
    </script>
</body>
</html>`;
            res.setHeader('Content-Type', 'text/html');
            res.send(html);
        });
    }

    app.use(express.json());

    app.use('/auth', auth);
    app.use(
        usuarios,
        auditorias,
        dashboard,
        especies,
        estufas,
        lotes,
        relatorios,
        movimentacoes,
        destinatarios,
    );
};

export default routes;