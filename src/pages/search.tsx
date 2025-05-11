
import { useState } from "react";
import { Link } from "react-router-dom";
import { Search as SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language-context";
import { useSurahs } from "@/services/quran-service";

interface SearchResult {
  type: "surah";
  surahNumber: number;
  surahName: string;
  surahEnglishName: string;
}

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { language, t } = useLanguage();
  const { data: surahs } = useSurahs();
  const [results, setResults] = useState<SearchResult[]>([]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchTerm.trim() || !surahs) {
      setResults([]);
      return;
    }
    
    const term = searchTerm.toLowerCase();
    const surahResults = surahs
      .filter((surah) => {
        return (
          surah.name.toLowerCase().includes(term) ||
          surah.englishName.toLowerCase().includes(term) ||
          surah.englishNameTranslation.toLowerCase().includes(term) ||
          surah.number.toString() === term
        );
      })
      .map((surah) => ({
        type: "surah" as const,
        surahNumber: surah.number,
        surahName: surah.name,
        surahEnglishName: surah.englishName
      }));
    
    setResults(surahResults);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-center">{t("search")}</h1>
      
      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative">
          <Input
            type="text"
            placeholder={
              language === "ar" 
                ? "ابحث عن اسم السورة أو رقمها" 
                : language === "bn" 
                ? "সূরার নাম বা নম্বর অনুসন্ধান করুন" 
                : language === "hi" 
                ? "सूरत का नाम या नंबर खोजें" 
                : "Search for surah name or number"
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-20"
          />
          <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <Button 
            type="submit" 
            className="absolute right-1 top-1 h-8 bg-quran-primary hover:bg-quran-secondary"
          >
            {language === "ar" ? "بحث" : language === "bn" ? "অনুসন্ধান" : language === "hi" ? "खोज" : "Search"}
          </Button>
        </div>
      </form>
      
      {/* Search Results */}
      {searchTerm && (
        <div className="mb-4">
          <h2 className="text-lg font-medium mb-2">
            {results.length === 0 
              ? (language === "ar" ? "لا توجد نتائج" : language === "bn" ? "কোন ফলাফল নেই" : language === "hi" ? "कोई परिणाम नहीं" : "No results") 
              : results.length === 1 
                ? (language === "ar" ? "نتيجة واحدة" : language === "bn" ? "১ টি ফলাফল" : language === "hi" ? "1 परिणाम" : "1 result") 
                : (language === "ar" ? `${results.length} نتائج` : language === "bn" ? `${results.length} টি ফলাফল` : language === "hi" ? `${results.length} परिणाम` : `${results.length} results`)
            }
          </h2>
        </div>
      )}
      
      {/* Results List */}
      <div className="space-y-2">
        {results.map((result) => (
          <Link
            key={`${result.type}-${result.surahNumber}`}
            to={`/surah/${result.surahNumber}`}
            className="block bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700"
          >
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">{result.surahEnglishName}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {t("surah")} {result.surahNumber}
                </div>
              </div>
              <div className="font-amiri text-lg">{result.surahName}</div>
            </div>
          </Link>
        ))}
      </div>
      
      {/* Popular Searches */}
      {(!searchTerm || results.length === 0) && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">
            {language === "ar" ? "سور شائعة" : language === "bn" ? "জনপ্রিয় সূরাগুলি" : language === "hi" ? "लोकप्रिय सूरतें" : "Popular Surahs"}
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[1, 36, 55, 67, 78, 112, 113, 114].map((surahNumber) => {
              const surah = surahs?.find(s => s.number === surahNumber);
              
              if (!surah) return null;
              
              return (
                <Link
                  key={surahNumber}
                  to={`/surah/${surahNumber}`}
                  className="bg-white dark:bg-gray-800 p-3 rounded-lg text-center shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700"
                >
                  <div className="font-amiri text-lg mb-1">{surah.name}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {surah.englishName}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
