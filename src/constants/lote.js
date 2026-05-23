export const FASE_LOTE = Object.freeze({
        Semeadura: "SEMEADURA", 
        Germinacao: "GERMINAÇÃO", 
        Producao: "PRODUÇÃO", 
        Pronto: "PRONTO", 
        Finalizado: "FINALIZADO"
});

export const FASE_LOTE_ENUM = Object.freeze(Object.values(FASE_LOTE));

export const STATUS = Object.freeze({
        Ativo: "ATIVO", 
        Inativo: "INATIVO"
});

export const STATUS_ENUM = Object.freeze(Object.values(STATUS));