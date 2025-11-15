import { ref } from "vue";
import en from "./enTest.json";
import ar from "./arTest.json";

const lang = ref(localStorage.getItem("testLang") || "en");

const texts = {
  en,
  ar,
};

function switchLang(newLang) {
  lang.value = newLang;
  localStorage.setItem("testLang", newLang);

  document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
}

export function useTestLang() {
  return {
    lang,
    texts,
    switchLang,
  };
}
