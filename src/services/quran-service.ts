
import { useQuery } from "@tanstack/react-query";

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  numberOfAyahs: number;
}

export interface Verse {
  number: number;
  text: string;
  translation?: string;
  transliteration?: string;
  audioUrl?: string;
}

export interface SurahDetail {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  numberOfAyahs: number;
  verses: Verse[];
}

const API_BASE_URL = "https://api.alquran.cloud/v1";

// Fetch all surahs
export const fetchSurahs = async (): Promise<Surah[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/surah`);
    const data = await response.json();
    
    if (data.code === 200 && data.status === "OK") {
      return data.data;
    }
    
    throw new Error("Failed to fetch surahs");
  } catch (error) {
    console.error("Error fetching surahs:", error);
    throw error;
  }
};

// Fetch a specific surah with verses
export const fetchSurahDetail = async (surahNumber: number, language = "en"): Promise<SurahDetail> => {
  try {
    // Fetch Arabic text
    const arabicResponse = await fetch(`${API_BASE_URL}/surah/${surahNumber}`);
    const arabicData = await arabicResponse.json();
    
    // Fetch translation based on language
    let translationEdition = "en.sahih"; // Default
    
    if (language === "ar") {
      translationEdition = "ar.muyassar";
    } else if (language === "bn") {
      translationEdition = "bn.bengali";
    } else if (language === "hi") {
      translationEdition = "hi.hindi";
    }
    
    const translationResponse = await fetch(
      `${API_BASE_URL}/surah/${surahNumber}/${translationEdition}`
    );
    const translationData = await translationResponse.json();
    
    if (arabicData.code === 200 && arabicData.status === "OK") {
      const surah = arabicData.data;
      const translatedVerses = translationData.data?.ayahs || [];
      
      const verses = surah.ayahs.map((ayah: any, index: number) => ({
        number: ayah.numberInSurah,
        text: ayah.text,
        translation: translatedVerses[index]?.text || "",
        audioUrl: `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayah.number}.mp3`
      }));
      
      return {
        number: surah.number,
        name: surah.name,
        englishName: surah.englishName,
        englishNameTranslation: surah.englishNameTranslation,
        revelationType: surah.revelationType,
        numberOfAyahs: surah.numberOfAyahs,
        verses
      };
    }
    
    throw new Error("Failed to fetch surah details");
  } catch (error) {
    console.error(`Error fetching surah ${surahNumber}:`, error);
    throw error;
  }
};

// React Query hooks
export const useSurahs = () => {
  return useQuery({
    queryKey: ["surahs"],
    queryFn: fetchSurahs,
  });
};

export const useSurahDetail = (surahNumber: number, language: string) => {
  return useQuery({
    queryKey: ["surah", surahNumber, language],
    queryFn: () => fetchSurahDetail(surahNumber, language),
  });
};

// Prayer times API
export interface PrayerTimes {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  date: {
    readable: string;
    timestamp: string;
    gregorian: {
      date: string;
      month: {
        number: number;
        en: string;
      };
      year: string;
    };
    hijri: {
      date: string;
      day: string;
      month: {
        number: number;
        en: string;
        ar: string;
      };
      year: string;
    };
  };
}

export const fetchPrayerTimes = async (latitude: number, longitude: number): Promise<PrayerTimes> => {
  try {
    const response = await fetch(
      `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=2`
    );
    const data = await response.json();
    
    if (data.code === 200 && data.status === "OK") {
      return {
        fajr: data.data.timings.Fajr,
        sunrise: data.data.timings.Sunrise,
        dhuhr: data.data.timings.Dhuhr,
        asr: data.data.timings.Asr,
        maghrib: data.data.timings.Maghrib,
        isha: data.data.timings.Isha,
        date: data.data.date
      };
    }
    
    throw new Error("Failed to fetch prayer times");
  } catch (error) {
    console.error("Error fetching prayer times:", error);
    throw error;
  }
};

export const usePrayerTimes = (latitude: number, longitude: number) => {
  return useQuery({
    queryKey: ["prayerTimes", latitude, longitude],
    queryFn: () => fetchPrayerTimes(latitude, longitude),
    enabled: !!latitude && !!longitude,
  });
};
