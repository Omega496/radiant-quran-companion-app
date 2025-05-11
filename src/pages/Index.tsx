
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSurahs } from "@/services/quran-service";
import { useReadingPosition } from "@/services/favorites-service";
import { useLanguage } from "@/contexts/language-context";

const Index = () => {
  const { data: surahs, isLoading } = useSurahs();
  const { readingPosition } = useReadingPosition();
  const { t, language } = useLanguage();
  const [lastReadSurah, setLastReadSurah] = useState<number | null>(null);

  // Popular surahs that many Muslims regularly read
  const popularSurahs = [
    { id: 1, nameAr: "الفاتحة", nameEn: "Al-Fatihah" }, // The Opening
    { id: 36, nameAr: "يس", nameEn: "Ya-Sin" }, // Ya-Sin
    { id: 55, nameAr: "الرحمن", nameEn: "Ar-Rahman" }, // The Most Merciful
    { id: 56, nameAr: "الواقعة", nameEn: "Al-Waqi'ah" }, // The Inevitable
    { id: 67, nameAr: "الملك", nameEn: "Al-Mulk" }, // The Sovereignty
    { id: 112, nameAr: "الإخلاص", nameEn: "Al-Ikhlas" }, // Sincerity
  ];

  useEffect(() => {
    // Get last read surah from localStorage
    const lastRead = localStorage.getItem("last-read-surah");
    if (lastRead) {
      setLastReadSurah(parseInt(lastRead, 10));
    }
  }, []);

  return (
    <div className="space-y-8">
      <section className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-quran-dark dark:text-white">
          {t("app_name")}
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          {language === "ar" ? (
            "اقرأ واستمع إلى القرآن الكريم"
          ) : language === "bn" ? (
            "পবিত্র কোরআন পড়ুন এবং শুনুন"
          ) : language === "hi" ? (
            "पवित्र कुरआन पढ़ें और सुनें"
          ) : (
            "Read and listen to the Holy Quran"
          )}
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Continue Reading Section */}
        <Card className="shadow-md">
          <CardHeader className="bg-quran-light dark:bg-quran-dark/20 pb-2">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              {t("continue_reading")}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {readingPosition ? (
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="text-2xl font-amiri">{readingPosition.surahName}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {t("surah")} {readingPosition.surahNumber}, {t("verses")} {readingPosition.verseNumber}
                </div>
                <Button asChild className="w-full">
                  <Link to={`/surah/${readingPosition.surahNumber}?verse=${readingPosition.verseNumber}`}>
                    {t("continue_reading")}
                  </Link>
                </Button>
              </div>
            ) : lastReadSurah ? (
              <div className="flex flex-col items-center text-center space-y-4">
                {isLoading ? (
                  <Skeleton className="h-8 w-40" />
                ) : (
                  <div className="text-2xl font-amiri">
                    {surahs?.find(s => s.number === lastReadSurah)?.name || ""}
                  </div>
                )}
                <Button asChild className="w-full">
                  <Link to={`/surah/${lastReadSurah}`}>
                    {t("continue_reading")}
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="text-lg text-gray-600 dark:text-gray-400">
                  {language === "ar" ? (
                    "ابدأ القراءة اليوم"
                  ) : language === "bn" ? (
                    "আজ পড়া শুরু করুন"
                  ) : language === "hi" ? (
                    "आज पढ़ना शुरू करें"
                  ) : (
                    "Start reading today"
                  )}
                </div>
                <Button asChild className="w-full">
                  <Link to="/surah/1">
                    {t("surahs")}
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Prayer Times Preview */}
        <Card className="shadow-md">
          <CardHeader className="bg-quran-light dark:bg-quran-dark/20 pb-2">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              {t("prayer_times")}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="text-lg text-gray-600 dark:text-gray-400">
                {language === "ar" ? (
                  "تحقق من أوقات الصلاة المحلية"
                ) : language === "bn" ? (
                  "স্থানীয় নামাজের সময় দেখুন"
                ) : language === "hi" ? (
                  "स्थानीय नमाज के समय देखें"
                ) : (
                  "Check your local prayer times"
                )}
              </div>
              <Button asChild className="w-full">
                <Link to="/prayer-times">
                  {t("prayer_times")}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Popular Surahs Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t("popular_surahs")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {popularSurahs.map(surah => (
            <Link
              to={`/surah/${surah.id}`}
              key={surah.id}
              className="surah-card group"
            >
              <div className="p-4">
                <div className="text-xl font-amiri mb-2 text-center">
                  {surah.nameAr}
                </div>
                <div className="text-sm text-center text-gray-600 dark:text-gray-400">
                  {surah.nameEn}
                </div>
              </div>
              <div className="bg-quran-light dark:bg-quran-dark/20 text-center py-2 text-sm text-quran-primary dark:text-quran-accent group-hover:bg-quran-primary group-hover:text-white dark:group-hover:bg-quran-primary dark:group-hover:text-white transition-colors duration-200">
                {t("surah")} {surah.id}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;
