const { verifyToken, saveUser, getCollection, addDocument } = require('../../src/server/services/firestore');

describe('Firestore Service (Mock Mode)', () => {
  test('verifyToken validates mock token', async () => {
    const result = await verifyToken('mock-valid-token');
    expect(result.uid).toBe('mock-user-123');
  });

  test('verifyToken rejects invalid token', async () => {
    await expect(verifyToken('bad-token')).rejects.toThrow('Invalid mock token');
  });

  test('saveUser returns success', async () => {
    const result = await saveUser({ uid: '123' });
    expect(result.success).toBe(true);
  });

  test('getCollection returns mock data', async () => {
    const q = await getCollection('quizzes');
    expect(q.length).toBeGreaterThan(0);
  });

  test('getCollection returns empty array for unknown collection', async () => {
    const result = await getCollection('unknown');
    expect(result).toEqual([]);
  });

  test('addDocument returns doc with ID', async () => {
    const data = { test: 'data' };
    const result = await addDocument('any', data);
    expect(result.id).toBe('mock-doc-id');
    expect(result.test).toBe('data');
  });
});
