export const STATUS_USUARIO = Object.freeze({
    Ativo: 'ATIVO',
    Inativo: 'INATIVO',
    Pendente: 'PENDENTE',
});

export const STATUS_USUARIO_ENUM = Object.freeze(Object.values(STATUS_USUARIO));

export const TIPO_USUARIO = Object.freeze({
    Administrador: 'ADMINISTRADOR',
    Operador: 'OPERADOR',
});

export const TIPO_USUARIO_ENUM = Object.freeze(Object.values(TIPO_USUARIO));