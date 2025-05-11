
import { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Play, Bookmark, ArrowLeft, ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AudioPlayer } from "@/components/audio/audio-player";
import { useSurahDetail } from "@/services/quran-service";
import { useBookmarks, useReadingPosition } from "@/services/favorites-service";
import { useLanguage } from "@/contexts/language-context";
import { toast } from "@/components/ui/sonner";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";

const Surah = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const surahNumber = parseInt(id || "1", 10);
  const initialVerseId = searchParams.get("verse") ? parseInt(searchParams.get("verse") || "1", 10) : null;
  
  const { language, t } = useLanguage();
  const { data: surah, isLoading, error } = useSurahDetail(surahNumber, language);
  const { addBookmark } = useBookmarks();
  const { updateReadingPosition } = useReadingPosition();
  
  const [currentVerseIndex, setCurrentVerseIndex] = useState<number>(initialVerseId ? initialVerseId - 1 : 0);
  const [audioMode, setAudioMode] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const versesRef = useRef<(HTMLDivElement | null)[]>([]);

  // Store the last read surah in localStorage
  useEffect(() => {
    localStorage.setItem("last-read-surah", surahNumber.toString());
  }, [surahNumber]);

  // Scroll to verse if initialVerseId is provided
  useEffect(() => {
    if (initialVerseId && surah && versesRef.current[initialVerseId - 1]) {
      setTimeout(() => {
        versesRef.current[initialVerseId - 1]?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 500);
    }
  }, [initialVerseId, surah]);

  // Update reading position
  useEffect(() => {
    if (surah) {
      updateReadingPosition({
        surahNumber,
        verseNumber: currentVerseIndex + 1,
        surahName: surah.name,
        timestamp: Date.now()
      });
    }
  }, [currentVerseIndex, surah, surahNumber, updateReadingPosition]);

  const handleVerseBookmark = (verseIndex: number) => {
    if (!surah) return;
    
    const verse = surah.verses[verseIndex];
    addBookmark({
      surahNumber,
      verseNumber: verse.number,
      surahName: surah.name,
      verseText: verse.text
    });
    
    toast.success(t("bookmark") + " " + t("added"));
  };

  const handleVerseClick = (index: number) => {
    setCurrentVerseIndex(index);
    versesRef.current[index]?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleVerseChange = (index: number) => {
    setCurrentVerseIndex(index);
    versesRef.current[index]?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const navigateToNextSurah = () => {
    if (surahNumber < 114) {
      window.location.href = `/surah/${surahNumber + 1}`;
    }
  };

  const navigateToPrevSurah = () => {
    if (surahNumber > 1) {
      window.location.href = `/surah/${surahNumber - 1}`;
    }
  };

  // Filter verses based on search query
  const filteredVerses = surah?.verses.filter(verse => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      verse.text.toLowerCase().includes(query) || 
      verse.translation.toLowerCase().includes(query)
    );
  });

  if (error) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl text-red-500 mb-4">Error loading surah</h2>
        <p className="text-gray-600 dark:text-gray-400">Please try again later</p>
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Input
            type="text"
            placeholder={t("search_verses") || "Search verses"}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
        {searchQuery && filteredVerses && (
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {filteredVerses.length} {filteredVerses.length === 1 ? t("result") : t("results")} {t("found")}
          </div>
        )}
      </div>
      
      {/* Surah Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={navigateToPrevSurah}
            disabled={surahNumber <= 1}
            className="flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            {language === "ar" ? "السابق" : "Previous"}
          </Button>
          
          <div className="text-center">
            {isLoading ? (
              <Skeleton className="h-12 w-36 mx-auto" />
            ) : surah ? (
              <>
                <h1 className="text-3xl font-amiri mb-1">{surah.name}</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {surah.englishName} - {surah.englishNameTranslation}
                </p>
              </>
            ) : null}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={navigateToNextSurah}
            disabled={surahNumber >= 114}
            className="flex items-center gap-1"
          >
            {language === "ar" ? "التالي" : "Next"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        
        {isLoading ? (
          <Skeleton className="h-5 w-full" />
        ) : surah ? (
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            {surah.revelationType === "Meccan" ? 
              (language === "ar" ? "مكية" : "Meccan") : 
              (language === "ar" ? "مدنية" : "Medinan")} • {surah.numberOfAyahs} {t("verses")}
          </div>
        ) : null}
      </div>
      
      {/* Bismillah */}
      {isLoading ? (
        <Skeleton className="h-16 w-full mb-6" />
      ) : surah && surahNumber !== 9 ? (
        <div className="arabic-text text-center text-2xl font-amiri mb-8">
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </div>
      ) : null}

      {/* Surah Verses */}
      {isLoading ? (
        <div className="space-y-6">
          {Array(5).fill(0).map((_, index) => (
            <Skeleton key={index} className="h-32 w-full" />
          ))}
        </div>
      ) : surah ? (
        <div className="space-y-1">
          {(filteredVerses || []).map((verse, index) => {
            // Find the actual index in the original verses array
            const originalIndex = surah.verses.findIndex(v => v.number === verse.number);
            
            return (
              <div 
                key={verse.number}
                ref={(el) => (versesRef.current[originalIndex] = el)}
                className={`verse-container ${currentVerseIndex === originalIndex ? 'verse-highlight' : ''}`}
                onClick={() => handleVerseClick(originalIndex)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="bg-quran-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">
                    {verse.number}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleVerseBookmark(originalIndex);
                    }}
                    className="text-gray-500 hover:text-quran-primary dark:text-gray-400"
                  >
                    <Bookmark className="h-4 w-4" />
                    <span className="sr-only">{t("bookmark")}</span>
                  </Button>
                </div>
                <div dir="rtl" className="arabic-text text-xl md:text-2xl mb-3 font-amiri">
                  {verse.text}
                </div>
                <div className="text-gray-700 dark:text-gray-300 text-sm md:text-base">
                  {verse.translation}
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      {/* Audio Controls Fixed at Bottom */}
      {surah && (
        <div className="fixed bottom-0 left-0 right-0 z-10">
          {audioMode ? (
            <AudioPlayer
              audioUrls={surah.verses.map(v => v.audioUrl || "")}
              onVerseChange={handleVerseChange}
              currentVerseIndex={currentVerseIndex}
              className="rounded-t-lg"
            />
          ) : (
            <Button
              className="flex items-center gap-2 mx-auto mb-4 bg-quran-primary hover:bg-quran-secondary"
              onClick={() => setAudioMode(true)}
            >
              <Play className="h-4 w-4" />
              {t("play")} {t("audio")}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default Surah;
