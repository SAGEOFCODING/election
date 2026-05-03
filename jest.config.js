module.exports = {
  testEnvironment: 'node',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  testMatch: ['**/tests/unit/**/*.js', '**/tests/integration/**/*.js'],
  clearMocks: true
};
