module.exports = {
    testEnvironment: 'node',
    coveragePathIgnorePatterns: ['/node_modules/', 'Mongo\.js$'],
    testMatch: ['**/__tests__/**/*.test.js'],
    collectCoverageFrom: [
        'controllers/**/*.js',
        'models/Task.js',
        'models/User.js',
        'routes/**/*.js',
        'middleware/**/*.js',
        'validators/**/*.js'
    ],
    coverageThreshold: {
        global: {
            branches: 60,
            functions: 70,
            lines: 70,
            statements: 70
        }
    }
};
