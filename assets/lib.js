import { dictionaries } from '../data/i18n.js';

export function t(lang, key) {
  return dictionaries[lang]?.[key] ?? dictionaries.en[key] ?? key;
}

export function localize(value, lang) {
  return value?.[lang] ?? value?.en ?? '';
}

function escapeHtml(value) {
  return String(value ?? '').replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  );
}

export function paginate(items, page, perPage = 5) {
  const list = Array.isArray(items) ? items : [];
  const pages = Math.max(1, Math.ceil(list.length / perPage));
  const current = Math.min(Math.max(1, Number(page) || 1), pages);
  const start = (current - 1) * perPage;
  return { items: list.slice(start, start + perPage), page: current, pages };
}

export function renderWorkPager(page, pages, lang) {
  if (pages <= 1) return '';

  const label = escapeHtml(t(lang, 'work.pagination'));
  const counter = escapeHtml(
    t(lang, 'work.page').replace('{page}', page).replace('{pages}', pages),
  );

  return `<nav class="work-pager" aria-label="${label}">
  <button type="button" class="work-prev"${page <= 1 ? ' disabled' : ''}>${escapeHtml(t(lang, 'work.prev'))}</button>
  <span class="meta">${counter}</span>
  <button type="button" class="work-next"${page >= pages ? ' disabled' : ''}>${escapeHtml(t(lang, 'work.next'))}</button>
</nav>`;
}

export function renderWorkRow(project, lang, detailHtml = '', expanded = false) {
  const title = escapeHtml(localize(project.title, lang));
  const stack = escapeHtml(project.stack.join(' · '));
  const year = escapeHtml(project.year);
  const id = escapeHtml(project.id);

  return `<li class="work-row">
  <button class="work-toggle" type="button" aria-expanded="${expanded}" aria-controls="detail-${id}">
    <span class="work-title">${title}</span>
    <span class="work-stack">${stack}</span>
    <span class="work-year">${year}</span>
  </button>${detailHtml}
</li>`;
}

export function renderWorkDetail(project, lang, expanded = false) {
  const title = escapeHtml(localize(project.title, lang));
  const role = escapeHtml(localize(project.role, lang));
  const summary = escapeHtml(localize(project.summary, lang));
  const repo = escapeHtml(project.repo);
  const id = escapeHtml(project.id);

  const images = Array.isArray(project.images) && project.images.length
    ? project.images
    : project.image
      ? [project.image]
      : [];

  let figure;
  if (!images.length) {
    figure = `<div class="work-figure work-placeholder" data-fallback="${title}"><span>${title}</span></div>`;
  } else {
    const mainId = `figure-${id}`;
    const main = `<div class="work-figure" data-fallback="${title}"><img id="${mainId}" src="${escapeHtml(images[0])}" alt="${title} — ${role}" loading="lazy" width="1600" height="1000" onerror="this.closest('.work-figure').classList.add('is-broken')"></div>`;

    const thumbs = images.length > 1
      ? `<div class="work-thumbs" role="group" aria-label="${escapeHtml(t(lang, 'work.gallery'))}">${images
          .map(
            (src, index) =>
              `<button type="button" class="work-thumb" aria-pressed="${index === 0}" data-target="${mainId}" data-src="${escapeHtml(src)}"><img src="${escapeHtml(src)}" alt="" loading="lazy" width="160" height="100"></button>`,
          )
          .join('')}</div>`
      : '';

    figure = `<div class="work-gallery">${main}${thumbs}</div>`;
  }

  const demo = project.demo
    ? ` · <a href="${escapeHtml(project.demo)}" rel="noopener">Live</a>`
    : '';

  return `
  <div class="work-detail" id="detail-${id}"${expanded ? '' : ' hidden'}>
    ${figure}
    <p>${summary}</p>
    <p class="meta">${role}</p>
    <p><a href="${repo}" rel="noopener">${title} on GitHub</a>${demo}</p>
  </div>`;
}

export function resolveTheme(stored, systemPrefersDark) {
  if (stored === 'light' || stored === 'dark') return stored;
  return systemPrefersDark ? 'dark' : 'light';
}

export function resolveLang(stored, navigatorLang) {
  if (stored === 'en' || stored === 'id') return stored;
  return String(navigatorLang || '').toLowerCase().startsWith('id') ? 'id' : 'en';
}

export function mailtoHref(email, subject) {
  const clean = String(email).replace(/["<>]/g, '');
  return `mailto:${clean}?subject=${encodeURIComponent(subject)}`;
}

export function canCopy() {
  return typeof navigator !== 'undefined' && !!navigator.clipboard?.writeText;
}

export function readStore(storage, key) {
  try {
    if (!storage) return null;
    return storage.getItem(key) ?? null;
  } catch {
    return null;
  }
}

export function writeStore(storage, key, value) {
  try {
    if (!storage) return false;
    storage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}
