// src/i18n.js
import { createI18n } from "vue-i18n";

const DEFAULT_LANG = (() => {
  try {
    return localStorage.getItem("lang") || "ar";
  } catch {
    return "ar";
  }
})();

async function loadMessages() {
  const files = {
    en: "/locals/en.json",
    ar: "/locals/ar.json",
  };

  const messages = {};

  for (const [lang, url] of Object.entries(files)) {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to fetch ${url}: ${res.status}`);
    }
    messages[lang] = await res.json();
  }

  return messages;
}

// named export (so main.js can import { i18n })
export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: DEFAULT_LANG,
  fallbackLocale: "en",
  messages: {}, // will populate after loading
});

export async function setupI18n() {
  const messages = await loadMessages();

  for (const [lang, msg] of Object.entries(messages)) {
    i18n.global.setLocaleMessage(lang, msg);
  }

  // Force the selected locale to be applied
  i18n.global.locale.value = DEFAULT_LANG;

  // Return some debug info for main.js to log
  return {
    locales: i18n.global.availableLocales,
    current: i18n.global.locale.value,
    currentMessages: i18n.global.getLocaleMessage(i18n.global.locale.value),
  };
}

export default i18n;
