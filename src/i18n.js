// ===============================
// src/i18n.js
// ===============================

import { createI18n } from "vue-i18n";

let savedLang = "en";
try {
  const stored = localStorage.getItem("lang");
  if (stored) savedLang = stored;
} catch (e) {}

// Load JSON file
async function loadLocale(lang) {
  const res = await fetch(`/locals/${lang}.json`);
  if (!res.ok) {
    console.error(`❌ Failed to load locale file: /locals/${lang}.json`);
    return {};
  }
  return await res.json();
}

export async function createI18nInstance() {
  const messages = {
    en: await loadLocale("en"),
    ar: await loadLocale("ar"),
  };

  return createI18n({
    legacy: false,
    globalInjection: true,
    locale: savedLang,
    fallbackLocale: "en",
    messages,
  });
}
