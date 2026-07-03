import mongoose from 'mongoose';
import DbConnect from './src/config/DbConnect.js';
import { seedAll } from './src/seed/seedViveiroMunicipal.js';

beforeAll(async () => {
    // jest.spyOn(console, 'error').mockImplementation(() => { });
    // jest.spyOn(console, 'log').mockImplementation(() => { });

    const testPath = expect.getState().testPath;

if (testPath.includes('/routes/') || testPath.includes('\\routes\\')) {
        if (mongoose.connection.readyState !== 1) {
            await DbConnect.conectar();
        }
        
        if (mongoose.connection.readyState === 1) {
            await seedAll();
        }
    }
}, 30000);

afterAll(async () => {
    const testPath = expect.getState().testPath;

if (testPath.includes('/routes/') || testPath.includes('\\routes\\')) {
        await DbConnect.desconectar();
    }

    if (console.error.mockRestore) {
        console.error.mockRestore();
    }
    if (console.log.mockRestore) {
        console.log.mockRestore();
    }
});
