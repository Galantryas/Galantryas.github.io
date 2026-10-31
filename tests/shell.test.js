import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const css = readFileSync(new URL('../assets/styles.css', import.meta.url), 'utf8');

test('document declares English and a skip link', () => {
  assert.match(html, /<html[^>]+lang="en"/);
  assert.match(html, /href="#main"/);
});

test('every required landmark exists once', () => {
  for (const id of ['main', 'work', 'about', 'experience', 'contact']) {
    assert.equal(html.split(`id="${id}"`).length - 1, 1, id);
  }
});

test('work section has a fallback when scripts are blocked', () => {
  assert.match(html, /id="work-fallback"/);
});

test('light tokens are declared', () => {
  for (const [name, value] of Object.entries({
    '--paper': '#f4f1ea', '--ink': '#191512', '--rule': '#8a8175',
    '--muted': '#6d655a', '--accent': '#7a2e1e',
  })) assert.match(css, new RegExp(`${name}:\\s*${value}`, 'i'));
});

test('dark tokens are declared under prefers-color-scheme', () => {
  const dark = css.slice(css.indexOf('prefers-color-scheme: dark'));
  for (const [name, value] of Object.entries({
    '--paper': '#15130f', '--ink': '#ebe5d9', '--rule': '#6d655a',
    '--muted': '#8a8175', '--accent': '#d9905e',
  })) assert.match(dark, new RegExp(`${name}:\\s*${value}`, 'i'));
});
