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

export function renderWorkRow(project, lang, detailHtml = '') {  const title = escapeHtml(localize(project.title, lang));
  const stack = escapeHtml(project.stack.join(' · '));
  const year = escapeHtml(project.year);
  const id = escapeHtml(project.id);

  return `<li class="work-row">
  <button class="work-toggle" type="button" aria-expanded="false" aria-controls="detail-${id}">
    <span class="work-title">${title}</span>
    <span class="work-stack">${stack}</span>
    <span class="work-year">${year}</span>
  </button>${detailHtml}
</li>`;
}

export function renderWorkDetail(project, lang) {
  const title = escapeHtml(localize(project.title, lang));
  const role = escapeHtml(localize(project.role, lang));
  const summary = escapeHtml(localize(project.summary, lang));
  const repo = escapeHtml(project.repo);
  const id = escapeHtml(project.id);

  const figure = project.image
    ? `<div class="work-figure"><img src="${escapeHtml(project.image)}" alt="${title} — ${role}" loading="lazy" width="1600" height="1000"></div>`
    : `<div class="work-figure work-placeholder"><span>${title}</span></div>`;

  const demo = project.demo
    ? ` · <a href="${escapeHtml(project.demo)}" rel="noopener">Live</a>`
    : '';

  return `
  <div class="work-detail" id="detail-${id}" hidden>
    ${figure}
    <p>${summary}</p>
    <p class="meta">${role}</p>
    <p><a href="${repo}" rel="noopener">GitHub</a>${demo}</p>
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
