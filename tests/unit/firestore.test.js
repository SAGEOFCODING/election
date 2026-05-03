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
    const tl = await getCollection('timeline');
    expect(tl.length).toBeGreaterThan(0);
  });
});
