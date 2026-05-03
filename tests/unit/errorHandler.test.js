const errorHandler = require('../../src/server/middleware/errorHandler');

describe('Error Handler', () => {
  let req, res, next;

  beforeEach(() => {
    req = { method: 'GET', url: '/' };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  test('Returns 500 for generic error', () => {
    const err = new Error('Test Error');
    errorHandler(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      error: 'Internal Server Error',
      status: 'error'
    }));
  });

  test('Returns specific status if err.status is set', () => {
    const err = new Error('Not Found');
    err.status = 404;
    errorHandler(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      error: 'Not Found',
      status: 'error'
    }));
  });
});
