import { createI18n } from "vue-i18n";

let savedLang = localStorage.getItem("lang") || "ar";

async function loadMessages() {
  const files = {
    en: "/locals/en.json",
    ar: "/locals/ar.json",
  };

  const messages = {};

  for (const [lang, url] of Object.entries(files)) {
    const res = await fetch(url);
    messages[lang] = await res.json();
  }

  return messages;
}

export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: savedLang,
  fallbackLocale: "en",
  messages: {},
});

export async function setupI18n() {
  const messages = await loadMessages();

  for (const [lang, msg] of Object.entries(messages)) {
    i18n.global.setLocaleMessage(lang, msg);
  }

  i18n.global.locale.value = savedLang;
}

export default i18n;
