module.exports = {
  preset: 'ts-jest',
  restoreMocks: true,
  "testMatch": [
    "<rootDir>/__tests__/**/*.ts?(x)",
  ],
  globals: {
    'ts-jest': {
      tsconfig: {
        noImplicitAny: true
      }
    }
  }
};