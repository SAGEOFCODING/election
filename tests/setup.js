// Global test setup
jest.setTimeout(10000);

// Suppress console.log in tests (keep console.error)
global.console.log = jest.fn();
global.console.warn = jest.fn();

// Clean up mocks after each test
afterEach(() => {
  jest.restoreAllMocks();
});
