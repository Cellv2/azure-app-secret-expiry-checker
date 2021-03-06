module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    roots: ["<rootDir>/src"],
    transform: {
        "^.+\\.ts$": "ts-jest",
    },
    coverageThreshold: {
        global: {
            branches: 60,
            functions: 60,
            lines: 60,
            statements: 60,
        },
    },
    coverageReporters: ["json", "lcov", "text", "clover"],
};
