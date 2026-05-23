/* import mongoose from 'mongoose';
import { seedAll } from './src/seeds/seeds.js';

beforeAll(async () => {
    // jest.spyOn(console, 'error').mockImplementation(() => { });
    // jest.spyOn(console, 'log').mockImplementation(() => { });

    if (mongoose.connection.readyState !== 1) {
        await new Promise((resolve, reject) => {
            const timer = setTimeout(() => resolve(false), 15000);
            mongoose.connection.once('connected', () => { clearTimeout(timer); resolve(true); });
            mongoose.connection.once('error', (err) => { clearTimeout(timer); reject(err); });
        });
    }

    if (mongoose.connection.readyState === 1) {
        await seedAll();
    }
}, 30000);

afterAll(() => {
    if (console.error.mockRestore) {
        console.error.mockRestore();
    }
    if (console.log.mockRestore) {
        console.log.mockRestore();
    }
});
 */