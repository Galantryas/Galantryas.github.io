import { projects } from '../data/projects.js';
import { renderWorkRow, renderWorkDetail, resolveTheme, t } from './lib.js';

const THEME_KEY = 'porto.theme';
let lang = 'en';

function renderWork() {
  const list = document.getElementById('work-list');
  if (!list) return;

  list.innerHTML = projects
    .map((project) => renderWorkRow(project, lang, renderWorkDetail(project, lang)))
    .join('');

  list.querySelectorAll('.work-toggle').forEach((toggle) => {
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      const detail = document.getElementById(toggle.getAttribute('aria-controls'));
      if (detail) detail.hidden = expanded;
    });
  });
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const button = document.getElementById('theme-toggle');
  if (!button) return;
  button.setAttribute('aria-pressed', String(theme === 'dark'));
  const label = button.querySelector('span');
  if (label) {
    label.textContent = t(lang, theme === 'dark' ? 'ui.theme.toLight' : 'ui.theme.toDark');
  }
}

function initTheme() {
  const stored = localStorage.getItem(THEME_KEY);
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(resolveTheme(stored, systemPrefersDark));

  document.getElementById('theme-toggle')?.addEventListener('click', () => {
    const current = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
  });
}

initTheme();
renderWork();
