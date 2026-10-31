import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

test('core meta present', () => {
  assert.match(html, /<meta name="description" content="[^"]{40,}"/);
  assert.match(html, /<link rel="canonical" href="https:\/\/galantryas\.github\.io\/"/);
  assert.match(html, /property="og:image"/);
  assert.match(html, /name="twitter:card"/);
});

test('json-ld parses and is a Person', () => {
  const raw = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1];
  const data = JSON.parse(raw);
  assert.equal(data['@type'], 'Person');
  assert.ok(Array.isArray(data.sameAs) && data.sameAs.length >= 2);
});

test('404 page exists and links home', () => {
  const notFound = readFileSync(new URL('../404.html', import.meta.url), 'utf8');
  assert.match(notFound, /href="\/"/);
  assert.match(notFound, /assets\/styles\.css/);
});
