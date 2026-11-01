import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

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

test('favicon is declared on both pages and the files exist', () => {
  const notFound = readFileSync(new URL('../404.html', import.meta.url), 'utf8');
  for (const page of [html, notFound]) {
    assert.match(page, /rel="icon"[^>]*favicon\.svg/);
    assert.match(page, /rel="apple-touch-icon"/);
  }
  for (const file of ['favicon.svg', 'favicon-32.png', 'apple-touch-icon.png']) {
    assert.ok(existsSync(new URL(`../assets/${file}`, import.meta.url)), file);
  }
});

test('profile links open in a new tab', () => {
  for (const url of ['https://github.com/Galantryas', 'https://www.linkedin.com/in/galantryas-mukti-pratama']) {
    const tag = html.match(new RegExp(`<a[^>]*href="${url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*>`));
    assert.ok(tag, `missing link ${url}`);
    assert.match(tag[0], /target="_blank"/);
    assert.match(tag[0], /rel="noopener"/);
  }
});
