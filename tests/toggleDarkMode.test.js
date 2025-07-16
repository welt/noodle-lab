import { jest } from '@jest/globals';
import ToggleDarkMode from '../src/js/_lib/toggleDarkMode';

describe('Test ToggleDarkMode', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark-mode');
  });

  test('It handles options correctly', () => {
    const options = { events: ['toggle-button'] };
    const instance = new ToggleDarkMode(options);
    expect(instance.options).toEqual({ events: ['toggle-button'] });
  });

  test('It throws an error for invalid events', () => {
    expect(() => new ToggleDarkMode({ events: ['lorem-invalid-event'] })).toThrow(
      'Event "lorem-invalid-event" is not allowed. Allowed events are: toggle-button'
    );
  });

  test('It throws an error for invalid syntax', () => {
    expect(() => new ToggleDarkMode({ events: 'lorem-invalid-event, ipsum-invalid-)(*&^%$£), dolor-invalid-event' }))
      .toThrow('Events must be an array of strings.');
  });

  test('It toggles dark mode and updates localStorage to dark', () => {
    const instance = new ToggleDarkMode();
    const event = new CustomEvent('toggle-button', { detail: { checked: true } });
    instance.setMode(event);
    expect(document.documentElement.classList.contains('dark-mode')).toBe(true);
    expect(localStorage.getItem('mode')).toBe('dark');
  });

  test('It toggles dark mode and updates localStorage to light', () => {
    document.documentElement.classList.add('dark-mode');
    const instance = new ToggleDarkMode();
    const event = new CustomEvent('toggle-button', { detail: { checked: false } });
    instance.setMode(event);
    expect(document.documentElement.classList.contains('dark-mode')).toBe(false);
    expect(localStorage.getItem('mode')).toBe('light');
  });

  test('It does nothing when event.detail.checked is not set', () => {
    const instance = new ToggleDarkMode();
    const event = new CustomEvent('toggle-button', { detail: {} });
    instance.setMode(event);
    expect(document.documentElement.classList.contains('dark-mode')).toBe(false);
    expect(localStorage.getItem('mode')).toBe(null);
  });

  test('It adds event listeners', () => {
    const instance = new ToggleDarkMode();
    const addEventListenerSpy = jest.spyOn(document, 'addEventListener');
    instance.bindEvents();
    expect(addEventListenerSpy).toHaveBeenCalledWith('toggle-button', expect.any(Function));
    addEventListenerSpy.mockRestore();
  });

  test('It sets dark mode from localStorage', () => {
    localStorage.setItem('mode', 'dark');
    const instance = new ToggleDarkMode();
    instance.init();
    expect(document.documentElement.classList.contains('dark-mode')).toBe(true);
  });

  test('It sets light mode from localStorage', () => {
    localStorage.setItem('mode', 'light');
    const instance = new ToggleDarkMode();
    instance.init();
    expect(document.documentElement.classList.contains('dark-mode')).toBe(false);
  });
});
