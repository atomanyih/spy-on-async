/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  restoreMocks: true,
  testMatch: ['<rootDir>/__tests__/**/*.spec.ts?(x)'],
};
