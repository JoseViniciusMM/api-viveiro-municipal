import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import compression from 'compression';
import DbConnect from './config/DbConnect.js';
import errorHandler from './utils/helpers/errorHandler.js';
import logger from './utils/logger.js';
import CommonResponse from './utils/helpers/CommonResponse.js';

const app = express();

// Conexão com o banco de dados
if (process.env.NODE_ENV !== 'test') {
    DbConnect.conectar()
        .then(() => logger.info('Conexão com o banco de dados estabelecida com sucesso.'))
        .catch((error) => {
            logger.error('Erro ao conectar com o banco de dados:', error);
            process.exit(1);
        });
}

app.options(/.*/, cors({ origin: true, credentials: true }));
app.use(cors({
    origin: true,      
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


await routes(app); 
app.use((req, res) => {
    return CommonResponse.error(
        res,
        404,
        'resourceNotFound',
        null,
        [{ message: 'Rota não encontrada.' }]
    );
});

process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception thrown:', error);
});

app.use(errorHandler);

export default app;