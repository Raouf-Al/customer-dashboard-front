import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { arSA, enUS } from "date-fns/locale";
import { translations } from "@/lib/translations";

export type Lang = "en" | "ar";

const LANGUAGE_STORAGE_KEY = "bankwise-lens:lang";
const localeByLanguage = {
  en: "en-LY",
  ar: "ar-LY",
} as const;

interface LanguageContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  dir: "ltr" | "rtl";
  locale: (typeof localeByLanguage)[Lang];
  dateLocale: typeof enUS;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
  t: (k) => k,
  dir: "ltr",
  locale: "en-LY",
  dateLocale: enUS,
  isRTL: false,
});

export const useLanguage = () => useContext(LanguageContext);

function interpolateTranslation(
  template: string,
  params?: Record<string, string | number>,
) {
  if (!params) return template;

  return Object.entries(params).reduce((result, [key, value]) => {
    return result.replaceAll(`{{${key}}}`, String(value));
  }, template);
}

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>(() => {
    if (typeof window === "undefined") return "en";

    const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return storedLanguage === "ar" ? "ar" : "en";
  });

  const dir = lang === "ar" ? "rtl" : "ltr";
  const locale = localeByLanguage[lang];
  const dateLocale = lang === "ar" ? arSA : enUS;
  const isRTL = dir === "rtl";

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
    document.body.dir = dir;
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  }, [dir, lang]);

  const value = useMemo<LanguageContextType>(() => {
    const t = (key: string, params?: Record<string, string | number>) => {
      const dict = translations[lang] || translations.en;
      const template = (dict as Record<string, string>)[key] || key;
      return interpolateTranslation(template, params);
    };

    return {
      lang,
      setLang,
      t,
      dir,
      locale,
      dateLocale,
      isRTL,
    };
  }, [dateLocale, dir, isRTL, lang, locale]);

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
};
