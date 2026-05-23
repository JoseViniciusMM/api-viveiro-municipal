import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

import logRoutes from "../middlewares/LogRoutesMiddleware.js";

import auth from './authRoutes.js';
import usuarios from './usuarioRoutes.js';
import auditorias from './auditoriaRoutes.js';
import dashboard from './dashboardRoutes.js';
import especies from './especieRoutes.js';
import estufas from './estufaRoute.js';
import lotes from './loteRoutes.js';
import movimentacoes from './movimentacaoRoutes.js';
import relatorios from './relatorioRoutes.js';
import destinatarios from './destinatarioRoute.js';

dotenv.config();

const routes = (app) => {
    if (process.env.DEBUGLOG) {
        app.use(logRoutes);
    }

    app.get("/", (req, res) => {
        res.redirect("/");
    });

    app.use(express.json());

    app.use('/auth', auth);
    app.use(
        usuarios, 
        auditorias, 
        dashboard, 
        especies, 
        estufas, 
        lotes, 
        movimentacoes, 
        relatorios, 
        destinatarios
    );
};
export default routes;