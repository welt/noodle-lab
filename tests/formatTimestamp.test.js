import formatTimestamp from '../src/js/_lib/formatTimestamp';

describe('Test formatTimestamp', () => {
  test('It formats timestamp with default options', () => {
    const timestamp = '2023-01-01T12:00:00Z';
    const formatted = formatTimestamp(timestamp);
    expect(formatted).toBe('01/01/2023, 12:00');
  });

  test('It formats timestamp with custom options', () => {
    const timestamp = '2023-01-01T12:00:00Z';
    const options = { year: '2-digit', month: 'short', day: 'numeric' };
    const formatted = formatTimestamp(timestamp, options);
    expect(formatted).toBe('1 Jan 23, 12:00');
  });
});
