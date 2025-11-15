import { createI18n } from "vue-i18n";

import ar from "./locals/ar.json";
import en from "./locals/en.json";

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem("locale") || "en",
  fallbackLocale: "en",
  messages: {
    en,
    ar
  }
});

export default i18n;
