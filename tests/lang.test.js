import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolveLang } from '../assets/lib.js';

test('stored language wins', () => {
  assert.equal(resolveLang('id', 'en-US'), 'id');
  assert.equal(resolveLang('en', 'id-ID'), 'en');
});

test('browser language decides when nothing is stored', () => {
  assert.equal(resolveLang(null, 'id-ID'), 'id');
  assert.equal(resolveLang(null, 'en-GB'), 'en');
  assert.equal(resolveLang(null, 'fr-FR'), 'en');
});

test('unknown stored values are ignored', () => {
  assert.equal(resolveLang('de', 'id-ID'), 'id');
});
