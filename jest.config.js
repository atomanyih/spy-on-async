module.exports = {
  preset: 'ts-jest',
  restoreMocks: true,
  "testMatch": [
    "**/__tests__/**/*.ts?(x)",
    "**/?(*.)+(spec|test).ts?(x)"
  ],
  globals: {
    'ts-jest': {
      tsconfig: {
        noImplicitAny: true
      }
    }
  }
};