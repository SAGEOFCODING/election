const cache = require('../../src/server/services/cache');

describe('cache service', () => {
  test('get returns undefined for missing key', () => {
    expect(cache.get('nonexistent-key-xyz')).toBeUndefined();
  });

  test('set and get roundtrip works', () => {
    cache.set('test-key', { data: 'hello' });
    expect(cache.get('test-key')).toEqual({ data: 'hello' });
  });

  test('set works with string values', () => {
    cache.set('str-key', 'string value');
    expect(cache.get('str-key')).toBe('string value');
  });

  test('set works with array values', () => {
    cache.set('arr-key', [1, 2, 3]);
    expect(cache.get('arr-key')).toEqual([1, 2, 3]);
  });

  test('stats returns object with keys and hits', () => {
    const s = cache.stats();
    expect(s).toHaveProperty('keys');
    expect(s).toHaveProperty('hits');
    expect(s).toHaveProperty('misses');
  });
});
