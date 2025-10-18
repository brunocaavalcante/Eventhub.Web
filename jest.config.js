module.exports = {
    preset: 'jest-preset-angular',
    testPathIgnorePatterns: [
        "./node_modules/",
        "./dist/"
    ],
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['./setup-jest.ts'],
    transform: {
        "^.+\\.(ts|js|html)$": "ts-jest"
    },
    // By default node_modules is ignored by transformers. Allow transforming @angular
    // packages (and other ESM packages) if necessary so Jest can parse them.
    transformIgnorePatterns: ["node_modules/(?!@angular)"],
    moduleFileExtensions: ['ts', 'js', 'html'],
    globals: {
        'ts-jest': {
            tsconfig: 'tsconfig.spec.json'
        }
    }
};