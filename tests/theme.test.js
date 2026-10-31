import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolveTheme } from '../assets/lib.js';

test('explicit choice beats the system preference', () => {
  assert.equal(resolveTheme('dark', false), 'dark');
  assert.equal(resolveTheme('light', true), 'light');
});

test('no choice follows the system preference', () => {
  assert.equal(resolveTheme(null, true), 'dark');
  assert.equal(resolveTheme(null, false), 'light');
});

test('garbage stored values fall back to the system preference', () => {
  assert.equal(resolveTheme('purple', true), 'dark');
  assert.equal(resolveTheme('', false), 'light');
});
