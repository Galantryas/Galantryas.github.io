import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dictionaries } from '../data/i18n.js';
import { t, localize } from '../assets/lib.js';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

test('every data-i18n key in the page exists in both dictionaries', () => {
  const keys = [...html.matchAll(/data-i18n="([^"]+)"/g)].map(m => m[1]);
  assert.ok(keys.length > 0);
  for (const key of keys) {
    assert.ok(dictionaries.en[key], `en missing ${key}`);
    assert.ok(dictionaries.id[key], `id missing ${key}`);
  }
});

test('both dictionaries carry the same key set', () => {
  assert.deepEqual(Object.keys(dictionaries.en).sort(), Object.keys(dictionaries.id).sort());
});

test('t falls back to English, then to the key itself', () => {
  assert.equal(t('id', 'nav.work'), dictionaries.id['nav.work']);
  assert.equal(t('fr', 'nav.work'), dictionaries.en['nav.work']);
  assert.equal(t('en', 'nope'), 'nope');
});

test('localize picks the language, then English, then empty', () => {
  assert.equal(localize({ en: 'A', id: 'B' }, 'id'), 'B');
  assert.equal(localize({ en: 'A' }, 'id'), 'A');
  assert.equal(localize(null, 'id'), '');
});
