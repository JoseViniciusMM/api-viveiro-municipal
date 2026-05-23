import bcrypt from 'bcryptjs';

class PasswordHasher {
    async hashPassword(password) {
        return await bcrypt.hash(password, 12);
    }
    async comparePassword(password, hash) {
        return await bcrypt.compare(password, hash);
    }
}
export default new PasswordHasher();