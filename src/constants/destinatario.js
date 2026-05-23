export const TIPO_PESSOA = Object.freeze({
    Fisica: 'FISICA',
    Juridica: 'JURIDICA'
});

export const TIPO_PESSOA_ENUM = Object.freeze(Object.values(TIPO_PESSOA));

export const CATEGORIA_USUARIO = Object.freeze({
    Publica: 'PUBLICA',
    Privada: 'PRIVADA',
    Social: 'SOCIAL'
});

export const CATEGORIA_USUARIO_ENUM = Object.freeze(Object.values(CATEGORIA_USUARIO));

export const STATUS_DESTINATARIO = Object.freeze({
    Ativo: 'ATIVO',
    Inativo: 'INATIVO'
});

export const STATUS_DESTINATARIO_ENUM = Object.freeze(Object.values(STATUS_DESTINATARIO));
