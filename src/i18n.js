import { createI18n } from "vue-i18n";

let savedLang = "ar";
try {
  const stored = localStorage.getItem("lang");
  if (stored) savedLang = stored;
} catch (e) {}

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

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: savedLang,
  fallbackLocale: "en",
  messages: {}, // temporary empty
});

export async function setupI18n(app) {
  const messages = await loadMessages();

  // Load translations into i18n
  Object.entries(messages).forEach(([lang, msg]) => {
    i18n.global.setLocaleMessage(lang, msg);
  });

  // Force Vue to update after messages load
  i18n.global.locale.value = savedLang;

  app.use(i18n);
}

export default i18n;
