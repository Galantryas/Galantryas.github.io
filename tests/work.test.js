import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderWorkRow, renderWorkDetail } from '../assets/lib.js';

const project = {
  id: 'smarteco', title: { en: 'Smart Eco', id: 'Smart Eco' }, year: 2018,
  stack: ['Laravel', 'Blade', 'MySQL'], role: { en: 'Full-stack', id: 'Full-stack' },
  summary: { en: 'Regional data.', id: 'Data wilayah.' },
  repo: 'https://github.com/Galantryas/smarteco2', demo: null,
  image: 'assets/work/smarteco.webp',
};

test('row carries title, stack and year', () => {
  const row = renderWorkRow(project, 'en');
  assert.match(row, /Smart Eco/);
  assert.match(row, /Laravel · Blade · MySQL/);
  assert.match(row, /2018/);
  assert.match(row, /aria-expanded="false"/);
});

test('detail localises and carries alt text plus a safe link', () => {
  const detail = renderWorkDetail(project, 'id');
  assert.match(detail, /Data wilayah\./);
  assert.match(detail, /alt="[^"]*Smart Eco[^"]*"/);
  assert.match(detail, /rel="noopener"/);
  assert.match(detail, /loading="lazy"/);
});

test('missing image path degrades to a labelled placeholder', () => {
  const detail = renderWorkDetail({ ...project, image: '' }, 'en');
  assert.doesNotMatch(detail, /<img/);
  assert.match(detail, /work-placeholder/);
});

test('long Indonesian strings do not break the markup', () => {
  const long = {
    ...project,
    title: { en: 'Smart Eco', id: 'Sistem Informasi Lingkungan Hidup Wilayah Kabupaten' },
  };
  const row = renderWorkRow(long, 'id');
  assert.match(row, /Sistem Informasi Lingkungan Hidup Wilayah Kabupaten/);
  assert.equal((row.match(/<li/g) || []).length, 1);
});

test('html in copy is escaped', () => {
  const row = renderWorkRow({ ...project, title: { en: '<script>x</script>', id: '' } }, 'en');
  assert.doesNotMatch(row, /<script>/);
  assert.match(row, /&lt;script&gt;/);
});

test('a renamed image file degrades instead of showing a broken icon', () => {
  const detail = renderWorkDetail({ ...project, image: 'assets/work/gone.webp' }, 'en');
  assert.match(detail, /onerror=/);
  assert.match(detail, /data-fallback="Smart Eco"/);
});

test('expanded rows render open after a re-render', () => {
  const detail = renderWorkDetail(project, 'en', true);
  assert.doesNotMatch(detail, /hidden>/);
  assert.match(renderWorkRow(project, 'en', '', true), /aria-expanded="true"/);
});
