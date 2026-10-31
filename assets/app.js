import { projects } from '../data/projects.js';
import {
  renderWorkRow,
  renderWorkDetail,
  renderWorkPager,
  paginate,
  resolveTheme,
  resolveLang,
  mailtoHref,
  canCopy,
  readStore,
  writeStore,
  t,
} from './lib.js';

const THEME_KEY = 'porto.theme';
const LANG_KEY = 'porto.lang';
const EMAIL = 'galantryas.2014@gmail.com';

let lang = 'en';
let page = 1;
const expandedIds = new Set();

function storage() {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function renderWork() {
  const list = document.getElementById('work-list');
  if (!list) return;

  const view = paginate(projects, page, 5);
  page = view.page;

  list.innerHTML = view.items
    .map((project) =>
      renderWorkRow(
        project,
        lang,
        renderWorkDetail(project, lang, expandedIds.has(project.id)),
        expandedIds.has(project.id),
      ),
    )
    .join('');

  list.querySelectorAll('.work-toggle').forEach((toggle) => {
    toggle.addEventListener('click', () => {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      const id = toggle.getAttribute('aria-controls').replace('detail-', '');
      if (isOpen) expandedIds.delete(id);
      else expandedIds.add(id);

      toggle.setAttribute('aria-expanded', String(!isOpen));
      const detail = document.getElementById(toggle.getAttribute('aria-controls'));
      if (detail) detail.hidden = isOpen;
    });
  });

  list.querySelectorAll('.work-thumb').forEach((thumb) => {
    thumb.addEventListener('click', () => {
      const target = document.getElementById(thumb.dataset.target);
      if (target) {
        target.classList.remove('is-broken');
        target.src = thumb.dataset.src;
      }
      thumb.parentElement
        .querySelectorAll('.work-thumb')
        .forEach((other) => other.setAttribute('aria-pressed', String(other === thumb)));
    });
  });

  const pager = document.getElementById('work-pager');
  if (pager) {
    pager.innerHTML = renderWorkPager(view.page, view.pages, lang);
    pager.querySelector('.work-prev')?.addEventListener('click', () => {
      page = view.page - 1;
      renderWork();
      document.getElementById('work')?.scrollIntoView({ block: 'start' });
    });
    pager.querySelector('.work-next')?.addEventListener('click', () => {
      page = view.page + 1;
      renderWork();
      document.getElementById('work')?.scrollIntoView({ block: 'start' });
    });
  }

  const fallback = document.getElementById('work-fallback');
  if (fallback) fallback.hidden = true;
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const button = document.getElementById('theme-toggle');
  if (button) button.setAttribute('aria-pressed', String(theme === 'dark'));
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

  const link = document.getElementById('email-link');
  if (link) link.href = mailtoHref(EMAIL, t(next, 'contact.subject'));

  renderWork();
}

function initTheme() {
  const store = storage();
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(resolveTheme(readStore(store, THEME_KEY), systemPrefersDark));

  document.getElementById('theme-toggle')?.addEventListener('click', () => {
    const next = currentTheme() === 'dark' ? 'light' : 'dark';
    writeStore(store, THEME_KEY, next);
    applyTheme(next);
  });
}

function initLang() {
  applyLang(resolveLang(readStore(storage(), LANG_KEY), navigator.language));

  document.querySelectorAll('[data-lang]').forEach((button) => {
    button.addEventListener('click', () => {
      writeStore(storage(), LANG_KEY, button.dataset.lang);
      applyLang(button.dataset.lang);
    });
  });
}

function execCopyFallback() {
  try {
    const input = document.createElement('input');
    input.value = EMAIL;
    input.setAttribute('readonly', '');
    input.style.position = 'fixed';
    input.style.opacity = '0';
    document.body.appendChild(input);
    input.select();
    input.setSelectionRange(0, EMAIL.length);
    const copied = document.execCommand('copy');
    input.remove();
    return copied;
  } catch {
    return false;
  }
}

function selectEmailText() {
  const link = document.getElementById('email-link');
  if (!link) return;
  const range = document.createRange();
  range.selectNodeContents(link);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
}

async function copyEmail() {
  if (canCopy()) {
    try {
      await navigator.clipboard.writeText(EMAIL);
      return true;
    } catch {
      /* fall through to the selection path */
    }
  }
  return execCopyFallback();
}

function initContact() {
  const link = document.getElementById('email-link');
  if (link) link.href = mailtoHref(EMAIL, t(lang, 'contact.subject'));

  const button = document.getElementById('copy-email');
  const feedback = document.getElementById('copy-feedback');
  if (!button) return;

  button.addEventListener('click', async () => {
    const copied = await copyEmail();

    if (copied) {
      if (feedback) {
        feedback.hidden = false;
        setTimeout(() => {
          feedback.hidden = true;
        }, 2000);
      }
      return;
    }

    selectEmailText();
  });
}

function initReveals() {
  const sections = [...document.querySelectorAll('main section')];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduced) {
    sections.forEach((section) => section.classList.add('is-visible'));
    return;
  }

  document.documentElement.classList.add('js');

  const reveal = () => {
    const limit = window.innerHeight * 0.95;
    sections.forEach((section) => {
      if (section.classList.contains('is-visible')) return;
      if (section.getBoundingClientRect().top < limit) section.classList.add('is-visible');
    });
  };

  reveal();
  window.addEventListener('scroll', reveal, { passive: true });
  window.addEventListener('resize', reveal, { passive: true });
}

initTheme();
initLang();
initContact();
initReveals();
