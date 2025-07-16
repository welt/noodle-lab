import { jest } from '@jest/globals';
import createScreenLogger from '../src/js/_lib/screenLogger';

describe('Test the screenLogger proxies console.log() correctly', () => {
  let originalConsoleLog;
  let element;
  let mockLog;
  let MockDumpToScreen;

  beforeAll(() => {
    originalConsoleLog = console.log;
  });

  beforeEach(() => {
    element = document.createElement('div');
    element.id = 'message-panel';
    document.body.appendChild(element);

    mockLog = jest.fn();
    MockDumpToScreen = jest.fn().mockImplementation(() => {
      return {
        log: mockLog,
      };
    });

    createScreenLogger(MockDumpToScreen, 'message-panel');
  });

  afterEach(() => {
    const element = document.getElementById('message-panel');
    if (element) {
      document.body.removeChild(element);
    }
  });

  afterAll(() => {
    console.log = originalConsoleLog;
  });

  test('It should log messages containing "cached" to screen', () => {
    console.log('This is a cached message');
    expect(mockLog).toHaveBeenCalledWith('This is a cached message');
  });

  test('It should not log messages which do not contain "cached" to screen', () => {
    console.log('This is a regular message');
    expect(mockLog).not.toHaveBeenCalledWith('This is a regular message');
  });

  test('It should not send non-string messages to screen', () => {
    console.log({ loremKey: 'ipsumValue' });
    expect(mockLog).not.toHaveBeenCalledWith({ loremKey: 'ipsumValue' });
  });
});
