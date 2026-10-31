import { dictionaries } from '../data/i18n.js';

export function t(lang, key) {
  return dictionaries[lang]?.[key] ?? dictionaries.en[key] ?? key;
}

export function localize(value, lang) {
  return value?.[lang] ?? value?.en ?? '';
}
