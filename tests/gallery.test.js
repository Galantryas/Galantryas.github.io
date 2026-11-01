import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderWorkDetail } from '../assets/lib.js';

const base = {
  id: 'demo', title: { en: 'Demo', id: 'Demo' }, year: 2026,
  stack: ['Laravel'], role: { en: 'Developer', id: 'Developer' },
  summary: { en: 'A project.', id: 'Sebuah proyek.' },
  repo: 'https://github.com/Galantryas/demo', demo: null,
};

test('a single image still works', () => {
  const detail = renderWorkDetail({ ...base, images: ['assets/work/one.webp'] }, 'en');
  assert.match(detail, /src="assets\/work\/one.webp"/);
  assert.doesNotMatch(detail, /work-thumb/);
});

test('the legacy image field still works', () => {
  const detail = renderWorkDetail({ ...base, image: 'assets/work/legacy.webp' }, 'en');
  assert.match(detail, /src="assets\/work\/legacy.webp"/);
});

test('several images produce a thumbnail per image', () => {
  const detail = renderWorkDetail(
    { ...base, images: ['assets/work/a.webp', 'assets/work/b.webp', 'assets/work/c.webp'] },
    'en',
  );
  assert.equal((detail.match(/class="work-thumb"/g) || []).length, 3);
  assert.match(detail, /aria-pressed="true"[\s\S]*a\.webp/);
  assert.equal((detail.match(/class="work-thumb"[\s\S]*?aria-pressed="false"/g) || []).length >= 2, true);
});

test('no images at all degrade to the placeholder', () => {
  const detail = renderWorkDetail({ ...base, images: [] }, 'en');
  assert.doesNotMatch(detail, /<img/);
  assert.match(detail, /work-placeholder/);
});

test('a demo url adds a live link', () => {
  const detail = renderWorkDetail({ ...base, demo: 'https://example.com/demo' }, 'en');
  assert.match(detail, /href="https:\/\/example\.com\/demo"/);
  assert.match(detail, />Live</);
});

test('external work links open in a new tab', () => {
  const detail = renderWorkDetail({ ...base, demo: 'https://example.com/demo' }, 'en');
  assert.equal((detail.match(/target="_blank"/g) || []).length, 2);
  assert.equal((detail.match(/rel="noopener"/g) || []).length, 2);
});
