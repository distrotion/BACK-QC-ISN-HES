/**
 * Unit tests for MongoDB utility (connection pool pattern)
 * Uses mocks — no real DB connection required
 */

// Mock the mongodb package
jest.mock('mongodb', () => {
  const mockCollection = {
    find: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    project: jest.fn().mockReturnThis(),
    toArray: jest.fn().mockResolvedValue([{ _id: '1', PO: '100' }]),
    insertMany: jest.fn().mockResolvedValue({ insertedCount: 2 }),
    updateOne: jest.fn().mockResolvedValue({ modifiedCount: 1 }),
  };
  const mockDb = { collection: jest.fn().mockReturnValue(mockCollection) };
  const mockClient = {
    connect: jest.fn().mockResolvedValue(undefined),
    db: jest.fn().mockReturnValue(mockDb),
    close: jest.fn().mockResolvedValue(undefined),
  };
  return { MongoClient: jest.fn().mockImplementation(() => mockClient) };
});

// Reset module between tests to reset the singleton pool
beforeEach(() => jest.resetModules());

describe('mongodb.find', () => {
  test('returns array from collection', async () => {
    const mongodb = require('../function/mongodb');
    const result = await mongodb.find('MAIN_DATA', 'MAIN', { PO: '100' });
    expect(Array.isArray(result)).toBe(true);
    expect(result[0].PO).toBe('100');
  });

  test('reuses connection (singleton)', async () => {
    const mongodb = require('../function/mongodb');
    await mongodb.find('DB', 'COL', {});
    await mongodb.find('DB', 'COL', {});
    const { MongoClient } = require('mongodb');
    expect(MongoClient).toHaveBeenCalledTimes(1);
  });
});

describe('mongodb.update', () => {
  test('calls updateOne and returns result', async () => {
    const mongodb = require('../function/mongodb');
    const result = await mongodb.update('DB', 'COL', { PO: '100' }, { $set: { status: 'OK' } });
    expect(result.modifiedCount).toBe(1);
  });
});

describe('mongodb.insertMany', () => {
  test('returns insert result', async () => {
    const mongodb = require('../function/mongodb');
    const result = await mongodb.insertMany('DB', 'COL', [{ a: 1 }, { b: 2 }]);
    expect(result.insertedCount).toBe(2);
  });
});
