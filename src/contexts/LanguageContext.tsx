import { createContext, useContext, useState, ReactNode } from "react";
import { translations } from "@/lib/translations";

type Lang = "en" | "ar";

interface LanguageContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
  t: (k) => k,
  dir: "ltr",
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>("en");

  const t = (key: string): string => {
    const dict = translations[lang] || translations.en;
    return (dict as Record<string, string>)[key] || key;
  };

  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, dir }}>
      <div dir={dir} className={lang === "ar" ? "font-sans" : ""}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};
