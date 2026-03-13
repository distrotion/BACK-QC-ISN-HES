/**
 * Unit tests for axios utility wrapper
 */

let axiosUtil;

beforeEach(() => {
  jest.resetModules();
  jest.mock('axios');
  axiosUtil = require('../function/axios');
});

describe('axios.post', () => {
  test('returns response data on success', async () => {
    const axiosMock = require('axios');
    axiosMock.post = jest.fn().mockResolvedValue({ data: { result: 'OK' } });
    const result = await axiosUtil.post('http://localhost/test', { key: 'val' });
    expect(result).toEqual({ result: 'OK' });
  });

  test('returns error status on failure', async () => {
    const axiosMock = require('axios');
    axiosMock.post = jest.fn().mockRejectedValue({ response: { status: 500 } });
    const result = await axiosUtil.post('http://localhost/fail', {});
    expect(result).toBe(500);
  });
});

describe('axios.get', () => {
  test('returns response data on success', async () => {
    const axiosMock = require('axios');
    axiosMock.get = jest.fn().mockResolvedValue({ data: [1, 2, 3] });
    const result = await axiosUtil.get('http://localhost/data');
    expect(result).toEqual([1, 2, 3]);
  });

  test('returns error status on failure', async () => {
    const axiosMock = require('axios');
    axiosMock.get = jest.fn().mockRejectedValue({ response: { status: 404 } });
    const result = await axiosUtil.get('http://localhost/missing');
    expect(result).toBe(404);
  });
});
