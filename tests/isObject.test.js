import { jest } from '@jest/globals';
import isObject from '../src/js/_lib/isObject';

const testData = { loremFakeKey: "ipsumFakeValue" };

describe('Test isObject helper fn', () => {
  test('returns true for plain objects', () => {
    expect(isObject({})).toBe(true);
    expect(isObject({ key: 'value' })).toBe(true);
    expect(isObject(testData)).toBe(true);
  });

  test('returns false for non-objects', () => {
    expect(isObject(null)).toBe(false);
    expect(isObject(undefined)).toBe(false);
    expect(isObject(9999)).toBe(false);
    expect(isObject('lorem-Ipsum-)(*&^%$£"')).toBe(false);
    expect(isObject(true)).toBe(false);
    expect(isObject([])).toBe(false);
    expect(isObject(() => {})).toBe(false);
    expect(isObject(new Date())).toBe(false);
  });
});
