module.exports = {
  preset: 'ts-jest',
  restoreMocks: true,
  testMatch: ['<rootDir>/__tests__/**/*.spec.ts?(x)'],
  globals: {
    'ts-jest': {
      tsconfig: {
        noImplicitAny: true,
      },
    },
  },
};
