module.exports = {
  restoreMocks: true,
  "transform": {
    "^.+\\.ts$": "ts-jest"
  },
  "testMatch": [
    "**/__tests__/**/*.ts?(x)",
    "**/?(*.)+(spec|test).ts?(x)"
  ],
  "moduleFileExtensions": [
    "js",
    "ts",
    "tsx"
  ],
  // "globals": {
  //   "ts-jest": {
  //     "tsconfig": "tsconfig.jest.json"
  //   }
  // },
};