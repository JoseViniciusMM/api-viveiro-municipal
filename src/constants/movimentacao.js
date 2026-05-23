export const TIPO_MOVIMENTACAO = Object.freeze({
        Entrada: "ENTRADA", 
        Saida: "SAIDA",
        Mortalidade: "MORTALIDADE",
        Expedicao: "EXPEDICAO", 
        Ajuste: "AJUSTE",
        Estorno: "ESTORNO"
});

export const TIPO_MOVIMENTACAO_ENUM = Object.freeze(Object.values(TIPO_MOVIMENTACAO));