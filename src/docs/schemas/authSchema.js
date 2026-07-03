// src/docs/schemas/authSchema.js
const authSchemas = {
    LoginPost: {
        type: 'object',
        required: ['senha'],
        properties: {
            email: { type: 'string', format: 'email', description: 'Opcional se usar CPF' },
            cpf:   { type: 'string', description: 'Opcional se usar e-mail' },
            senha: { type: 'string' },
        },
        example: {
            email: 'admin@viveiro.com',
            senha: 'Admin@123!'
        }
    },
    RespostaLogin: {
        type: 'object',
        properties: {
            token:     { type: 'string', description: 'Access token JWT' },
            refresh:   { type: 'string', description: 'Refresh token JWT' },
            expiraEm:  { type: 'string', format: 'date-time', description: 'Expiração do access token' },
        },
    },
};

export default authSchemas;