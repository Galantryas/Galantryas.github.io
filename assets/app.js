import { projects } from '../data/projects.js';
import {
  renderWorkRow,
  renderWorkDetail,
  resolveTheme,
  resolveLang,
  mailtoHref,
  canCopy,
  t,
} from './lib.js';

const THEME_KEY = 'porto.theme';
const LANG_KEY = 'porto.lang';
const EMAIL = 'galantryas.2014@gmail.com';
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

function currentTheme() {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

function applyLang(next) {
  lang = next;
  document.documentElement.lang = next;

  document.querySelectorAll('[data-i18n]').forEach((node) => {
    node.textContent = t(next, node.dataset.i18n);
  });

  const group = document.querySelector('.lang');
  if (group) group.setAttribute('aria-label', t(next, 'ui.lang'));

  document.querySelectorAll('[data-lang]').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.lang === next));
  });

  renderWork();
  applyTheme(currentTheme());
}

function initTheme() {
  const stored = localStorage.getItem(THEME_KEY);
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(resolveTheme(stored, systemPrefersDark));

  document.getElementById('theme-toggle')?.addEventListener('click', () => {
    const next = currentTheme() === 'dark' ? 'light' : 'dark';
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
  });
}

function initLang() {
  applyLang(resolveLang(localStorage.getItem(LANG_KEY), navigator.language));

  document.querySelectorAll('[data-lang]').forEach((button) => {
    button.addEventListener('click', () => {
      localStorage.setItem(LANG_KEY, button.dataset.lang);
      applyLang(button.dataset.lang);
    });
  });
}

function selectEmailFallback() {
  const input = document.createElement('input');
  input.value = EMAIL;
  input.setAttribute('readonly', '');
  input.style.position = 'fixed';
  input.style.opacity = '0';
  document.body.appendChild(input);
  input.select();
  try {
    document.execCommand('copy');
  } finally {
    input.remove();
  }
}

function initContact() {
  const link = document.getElementById('email-link');
  if (link) link.href = mailtoHref(EMAIL, 'Project enquiry');

  const button = document.getElementById('copy-email');
  const feedback = document.getElementById('copy-feedback');
  if (!button) return;

  button.addEventListener('click', async () => {
    try {
      if (canCopy()) await navigator.clipboard.writeText(EMAIL);
      else selectEmailFallback();
    } catch {
      selectEmailFallback();
    }

    if (feedback) {
      feedback.hidden = false;
      setTimeout(() => { feedback.hidden = true; }, 2000);
    }
  });
}

initTheme();
initLang();
initContact();