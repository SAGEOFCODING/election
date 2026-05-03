const errorHandler = require('../../src/server/middleware/errorHandler');

describe('Error Handler', () => {
  test('Returns 500 for generic error', () => {
    const err = new Error('Test Error');
    const req = { method: 'GET', url: '/' };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    errorHandler(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });

  test('Returns specific status if err.status is set', () => {
    const err = new Error('Not Found');
    err.status = 404;
    const req = { method: 'GET', url: '/' };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    errorHandler(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Not Found' });
  });
});
