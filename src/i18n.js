import { createI18n } from "vue-i18n";

import ar from "../public/locales/ar.json";
import en from "../public/locales/en.json";

const i18n = createI18n({
  legacy: true,
  locale: localStorage.getItem("lang") || "ar",
  fallbackLocale: "en",
  messages: {
    en:en,
    ar:ar
  }
});

export default i18n;
