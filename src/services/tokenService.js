import jwt from 'jsonwebtoken';

class TokenService {

    generateAccessToken({ userId, papeis = [] }) {
        const expiresIn = process.env.JWT_ACCESS_TOKEN_EXPIRATION || '15m';
        const token = jwt.sign(
            { id: userId, papeis },
            process.env.JWT_SECRET_ACCESS_TOKEN || 'default_access_secret',
            { expiresIn }
        );
        
        const decoded = jwt.decode(token);
        return { token, expiraEm: new Date(decoded.exp * 1000).toISOString() };
    }

    generateRefreshToken(userId) {
        return jwt.sign(
            { id: userId },
            process.env.JWT_SECRET_REFRESH_TOKEN || 'default_refresh_secret',
            { expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION || '7d' }
        );
    }

    generatePasswordRecoveryToken(userId) {
        return jwt.sign(
            { id: userId },
            process.env.JWT_SECRET_PASSWORD_RECOVERY || 'default_recovery_secret',
            { expiresIn: process.env.JWT_PASSWORD_RECOVERY_EXPIRATION || '30m' }
        );
    }

    verifyAccessToken(token) {
        return jwt.verify(token, process.env.JWT_SECRET_ACCESS_TOKEN || 'default_access_secret');
    }

    verifyRefreshToken(token) {
        return jwt.verify(token, process.env.JWT_SECRET_REFRESH_TOKEN || 'default_refresh_secret');
    }

    verifyPasswordRecoveryToken(token) {
        return jwt.verify(token, process.env.JWT_SECRET_PASSWORD_RECOVERY || 'default_recovery_secret');
    }

    decodeToken(token) {
        return jwt.decode(token);
    }

    introspect(token) {
        const decoded = this.verifyAccessToken(token);
        const now = Math.floor(Date.now() / 1000);

        return {
            active: decoded.exp > now,
            client_id: decoded.id,
            token_type: 'Bearer',
            exp: decoded.exp,
            iat: decoded.iat,
            nbf: decoded.nbf ?? decoded.iat
        };
    }
}

export default TokenService;