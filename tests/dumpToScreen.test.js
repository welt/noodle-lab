import { jest } from '@jest/globals';
import DumpToScreen from '../src/js/_lib/dumpToScreen';

describe('DumpToScreen', () => {
  test('It should initialize with the correct element', () => {
    let element = document.createElement('div');
    element.id = 'message-panel';
    document.body.appendChild(element);
    const screenDumper = new DumpToScreen('message-panel');
    expect(screenDumper.element).toBe(element);
    document.body.removeChild(element);
  });

  test('It should throw an error if the element is not found', () => {
    expect(() => new DumpToScreen('message-panel'))
      .toThrow("Element with id 'message-panel' not found.");
  });

  test('It should log messages and update the DOM element', () => {
    let element = document.createElement('div');
    element.id = 'message-panel';
    document.body.appendChild(element);
    const screenDumper = new DumpToScreen('message-panel');
    screenDumper.log('First message');
    screenDumper.log('Second message');
    screenDumper.log('Third message');
    expect(element.innerHTML).toBe('<p>First message</p><p>Second message</p><p>Third message</p>');

    screenDumper.log('Fourth message');
    expect(element.innerHTML).toBe('<p>Second message</p><p>Third message</p><p>Fourth message</p>');
    document.body.removeChild(element);
  });
});
