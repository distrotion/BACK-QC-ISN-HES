/**
 * Input validation utility
 * Returns { valid: true } or { valid: false, message: '...' }
 */

exports.required = (obj, ...fields) => {
  for (const field of fields) {
    const val = obj[field];
    if (val === undefined || val === null || val === '') {
      return { valid: false, message: `Missing required field: ${field}` };
    }
  }
  return { valid: true };
};

exports.isString = (obj, ...fields) => {
  for (const field of fields) {
    if (obj[field] !== undefined && typeof obj[field] !== 'string') {
      return { valid: false, message: `Field must be a string: ${field}` };
    }
  }
  return { valid: true };
};

exports.isArray = (obj, field) => {
  if (!Array.isArray(obj[field])) {
    return { valid: false, message: `Field must be an array: ${field}` };
  }
  return { valid: true };
};

// Convenience: validate and respond if invalid
// Usage: if (validate.check(res, validate.required(body, 'PO', 'CP'))) return;
exports.check = (res, ...results) => {
  for (const result of results) {
    if (!result.valid) {
      res.status(400).json({ error: result.message });
      return true; // means "invalid - caller should return"
    }
  }
  return false;
};
