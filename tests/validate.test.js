const validate = require('../function/validate');

describe('validate.required', () => {
  test('returns valid when all fields present', () => {
    const result = validate.required({ PO: '1000', CP: 'A001' }, 'PO', 'CP');
    expect(result.valid).toBe(true);
  });

  test('returns invalid when field missing', () => {
    const result = validate.required({ PO: '1000' }, 'PO', 'CP');
    expect(result.valid).toBe(false);
    expect(result.message).toContain('CP');
  });

  test('returns invalid when field is empty string', () => {
    const result = validate.required({ PO: '', CP: 'A001' }, 'PO', 'CP');
    expect(result.valid).toBe(false);
    expect(result.message).toContain('PO');
  });

  test('returns invalid when field is null', () => {
    const result = validate.required({ PO: null, CP: 'A001' }, 'PO', 'CP');
    expect(result.valid).toBe(false);
  });
});

describe('validate.isString', () => {
  test('returns valid when field is string', () => {
    const result = validate.isString({ PO: '1000' }, 'PO');
    expect(result.valid).toBe(true);
  });

  test('returns invalid when field is number', () => {
    const result = validate.isString({ PO: 1000 }, 'PO');
    expect(result.valid).toBe(false);
    expect(result.message).toContain('PO');
  });

  test('returns valid when field is absent (optional check)', () => {
    const result = validate.isString({}, 'PO');
    expect(result.valid).toBe(true);
  });
});

describe('validate.isArray', () => {
  test('returns valid when field is array', () => {
    const result = validate.isArray({ items: [1, 2] }, 'items');
    expect(result.valid).toBe(true);
  });

  test('returns invalid when field is not array', () => {
    const result = validate.isArray({ items: 'not an array' }, 'items');
    expect(result.valid).toBe(false);
  });
});

describe('validate.check', () => {
  test('returns false (no error) when all valid', () => {
    const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const result = validate.check(mockRes, { valid: true }, { valid: true });
    expect(result).toBe(false);
    expect(mockRes.status).not.toHaveBeenCalled();
  });

  test('sends 400 and returns true on first invalid', () => {
    const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const result = validate.check(
      mockRes,
      { valid: true },
      { valid: false, message: 'Missing CP' }
    );
    expect(result).toBe(true);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Missing CP' });
  });
});
