export default {
  transform: {},
  testEnvironment: 'node',
  verbose: true,
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/utils/helpers/index.js',
    '/utils/logger.js',
    '/utils/SendMail.js',
    '/utils/errors',
    'utils/helpers',
    'src/seed',
    'src/config',
    'src/routes/index.js',
    'src/docs',
    'src/infra',
    '<rootDir>/src/middlewares/LogRoutesMiddleware.js'
  ]
};
