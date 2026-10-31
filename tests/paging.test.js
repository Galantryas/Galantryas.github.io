import { test } from 'node:test';
import assert from 'node:assert/strict';
import { paginate, renderWorkPager } from '../assets/lib.js';

const items = Array.from({ length: 12 }, (_, i) => ({ id: `p${i + 1}` }));

test('pages items five at a time', () => {
  const first = paginate(items, 1);
  assert.equal(first.items.length, 5);
  assert.equal(first.items[0].id, 'p1');
  assert.equal(first.pages, 3);
});

test('later pages carry the right slice', () => {
  const second = paginate(items, 2);
  assert.equal(second.items[0].id, 'p6');
  assert.equal(second.items.length, 5);

  const third = paginate(items, 3);
  assert.equal(third.items.length, 2);
  assert.equal(third.page, 3);
});

test('out of range pages clamp', () => {
  assert.equal(paginate(items, 99).page, 3);
  assert.equal(paginate(items, 0).page, 1);
  assert.equal(paginate(items, 'nonsense').page, 1);
});

test('five or fewer items are a single page', () => {
  assert.equal(paginate(items.slice(0, 5), 1).pages, 1);
});

test('empty list still reports one page', () => {
  assert.equal(paginate([], 1).pages, 1);
});

test('pager is absent when there is one page', () => {
  assert.equal(renderWorkPager(1, 1, 'en'), '');
});

test('pager disables the button at each end', () => {
  const first = renderWorkPager(1, 3, 'en');
  assert.match(first, /work-prev"[^>]*disabled/);
  assert.doesNotMatch(first, /work-next"[^>]*disabled/);

  const last = renderWorkPager(3, 3, 'en');
  assert.match(last, /work-next"[^>]*disabled/);
  assert.doesNotMatch(last, /work-prev"[^>]*disabled/);
});

test('pager is localised', () => {
  assert.match(renderWorkPager(2, 3, 'id'), /Halaman 2 dari 3/);
});
