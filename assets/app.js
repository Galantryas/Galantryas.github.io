import { projects } from '../data/projects.js';
import { renderWorkRow, renderWorkDetail } from './lib.js';

function renderWork(lang) {
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

renderWork('en');
