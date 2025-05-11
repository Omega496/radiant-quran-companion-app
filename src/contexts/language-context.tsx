
import { createContext, useContext, useState, useEffect } from "react";

type LanguageType = "ar" | "en" | "bn" | "hi";

interface LanguageContextType {
  language: LanguageType;
  setLanguage: (lang: LanguageType) => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<string, string>> = {
  ar: {
    app_name: "القرآن الكريم",
    home: "الرئيسية",
    surah: "سورة",
    prayer_times: "أوقات الصلاة",
    favorites: "المفضلة",
    search: "بحث",
    settings: "الإعدادات",
    surahs: "السور",
    verses: "الآيات",
    continue_reading: "متابعة القراءة",
    recently_read: "قرأت مؤخرًا",
    popular_surahs: "سور شائعة",
    play: "تشغيل",
    pause: "إيقاف",
    next: "التالي",
    previous: "السابق",
    bookmark: "إشارة مرجعية",
  },
  en: {
    app_name: "Al Quran",
    home: "Home",
    surah: "Surah",
    prayer_times: "Prayer Times",
    favorites: "Favorites",
    search: "Search",
    settings: "Settings",
    surahs: "Surahs",
    verses: "Verses",
    continue_reading: "Continue Reading",
    recently_read: "Recently Read",
    popular_surahs: "Popular Surahs",
    play: "Play",
    pause: "Pause",
    next: "Next",
    previous: "Previous",
    bookmark: "Bookmark",
  },
  bn: {
    app_name: "আল কুরআন",
    home: "হোম",
    surah: "সূরা",
    prayer_times: "নামাজের সময়",
    favorites: "প্রিয়",
    search: "অনুসন্ধান",
    settings: "সেটিংস",
    surahs: "সূরাসমূহ",
    verses: "আয়াতসমূহ",
    continue_reading: "পড়া চালিয়ে যান",
    recently_read: "সম্প্রতি পঠিত",
    popular_surahs: "জনপ্রিয় সূরা",
    play: "চালান",
    pause: "বিরতি",
    next: "পরবর্তী",
    previous: "পূর্ববর্তী",
    bookmark: "বুকমার্ক",
  },
  hi: {
    app_name: "अल क़ुरआन",
    home: "होम",
    surah: "सूरा",
    prayer_times: "नमाज़ के समय",
    favorites: "पसंदीदा",
    search: "खोज",
    settings: "सेटिंग्स",
    surahs: "सूरतें",
    verses: "आयतें",
    continue_reading: "पढ़ना जारी रखें",
    recently_read: "हाल ही में पढ़ा गया",
    popular_surahs: "लोकप्रिय सूरतें",
    play: "चलाएं",
    pause: "रोकें",
    next: "अगला",
    previous: "पिछला",
    bookmark: "बुकमार्क",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<LanguageType>(() => {
    const savedLanguage = localStorage.getItem("quran-app-language") as LanguageType;
    return savedLanguage || "en";
  });

  useEffect(() => {
    localStorage.setItem("quran-app-language", language);
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  
  return context;
};
