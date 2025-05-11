
import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { usePrayerTimes } from "@/services/quran-service";
import { useLanguage } from "@/contexts/language-context";

const PrayerTimes = () => {
  const { language } = useLanguage();
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const { data: prayerTimes, isLoading } = usePrayerTimes(
    location?.lat || 0,
    location?.lng || 0
  );

  // Get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationError("Unable to get your location. Please check your browser settings.");
        }
      );
    } else {
      setLocationError("Geolocation is not supported by your browser.");
    }
  }, []);

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  // Format time to 12-hour format
  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Get time remaining until next prayer
  const getTimeRemaining = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(":");
    const prayerTime = new Date();
    prayerTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0);
    
    if (prayerTime < currentTime) {
      // Prayer time has passed for today
      prayerTime.setDate(prayerTime.getDate() + 1);
    }
    
    const diff = prayerTime.getTime() - currentTime.getTime();
    const hoursLeft = Math.floor(diff / (1000 * 60 * 60));
    const minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hoursLeft > 0) {
      return `${hoursLeft}h ${minutesLeft}m`;
    } else {
      return `${minutesLeft}m`;
    }
  };

  const getNextPrayer = () => {
    if (!prayerTimes) return null;
    
    const prayers = [
      { name: "Fajr", time: prayerTimes.fajr },
      { name: "Dhuhr", time: prayerTimes.dhuhr },
      { name: "Asr", time: prayerTimes.asr },
      { name: "Maghrib", time: prayerTimes.maghrib },
      { name: "Isha", time: prayerTimes.isha },
    ];
    
    const now = currentTime;
    for (const prayer of prayers) {
      const [hours, minutes] = prayer.time.split(":");
      const prayerTime = new Date();
      prayerTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0);
      
      if (prayerTime > now) {
        return prayer;
      }
    }
    
    // If all prayers passed, return Fajr for tomorrow
    return { name: "Fajr", time: prayerTimes.fajr };
  };

  const nextPrayer = prayerTimes ? getNextPrayer() : null;

  const getPrayerNameLocalized = (name: string) => {
    const translations: Record<string, Record<string, string>> = {
      ar: {
        Fajr: "الفجر",
        Dhuhr: "الظهر",
        Asr: "العصر",
        Maghrib: "المغرب",
        Isha: "العشاء",
        Sunrise: "الشروق",
      },
      bn: {
        Fajr: "ফজর",
        Dhuhr: "যোহর",
        Asr: "আসর",
        Maghrib: "মাগরিব",
        Isha: "এশা",
        Sunrise: "সূর্যোদয়",
      },
      hi: {
        Fajr: "फजर",
        Dhuhr: "जुहर",
        Asr: "अस्र",
        Maghrib: "मग़रिब",
        Isha: "इशा",
        Sunrise: "सूर्योदय",
      },
      en: {
        Fajr: "Fajr",
        Dhuhr: "Dhuhr",
        Asr: "Asr",
        Maghrib: "Maghrib",
        Isha: "Isha",
        Sunrise: "Sunrise",
      },
    };
    
    return translations[language][name] || name;
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-center">
        {language === "ar" ? "أوقات الصلاة" : 
         language === "bn" ? "নামাজের সময়" :
         language === "hi" ? "नमाज के समय" :
         "Prayer Times"}
      </h1>
      
      {locationError && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg mb-6">
          {locationError}
        </div>
      )}
      
      {/* Current Date */}
      {isLoading ? (
        <Skeleton className="h-16 w-full mb-6" />
      ) : prayerTimes ? (
        <Card className="mb-6">
          <CardContent className="pt-6 text-center">
            <p className="text-xl font-semibold">
              {prayerTimes.date.readable}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {prayerTimes.date.hijri.date} {prayerTimes.date.hijri.month.en} {prayerTimes.date.hijri.year} Hijri
            </p>
          </CardContent>
        </Card>
      ) : null}
      
      {/* Next Prayer */}
      {isLoading ? (
        <Skeleton className="h-32 w-full mb-6" />
      ) : prayerTimes && nextPrayer ? (
        <Card className="mb-6 overflow-hidden">
          <CardHeader className="bg-quran-primary text-white">
            <CardTitle className="text-center">
              {language === "ar" ? "الصلاة القادمة" : 
               language === "bn" ? "পরবর্তী নামাজ" :
               language === "hi" ? "अगली नमाज़" :
               "Next Prayer"}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 text-center">
            <h2 className="text-3xl font-bold mb-1">{getPrayerNameLocalized(nextPrayer.name)}</h2>
            <div className="text-xl">{formatTime(nextPrayer.time)}</div>
            <div className="mt-2 text-sm text-quran-primary font-medium">
              {language === "ar" ? "متبقي:" : 
               language === "bn" ? "বাকি আছে:" :
               language === "hi" ? "शेष है:" :
               "Time remaining:"} {getTimeRemaining(nextPrayer.time)}
            </div>
          </CardContent>
        </Card>
      ) : null}
      
      {/* All Prayer Times */}
      <h2 className="text-2xl font-semibold mb-4">
        {language === "ar" ? "جدول الصلوات" : 
         language === "bn" ? "নামাজের সময়সূচী" :
         language === "hi" ? "नमाज का टाइम टेबल" :
         "Prayer Schedule"}
      </h2>
      
      {isLoading ? (
        <div className="space-y-4">
          {Array(5).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : prayerTimes ? (
        <div className="grid gap-4">
          <PrayerTimeCard name="Fajr" time={prayerTimes.fajr} language={language} />
          <PrayerTimeCard name="Sunrise" time={prayerTimes.sunrise} language={language} />
          <PrayerTimeCard name="Dhuhr" time={prayerTimes.dhuhr} language={language} />
          <PrayerTimeCard name="Asr" time={prayerTimes.asr} language={language} />
          <PrayerTimeCard name="Maghrib" time={prayerTimes.maghrib} language={language} />
          <PrayerTimeCard name="Isha" time={prayerTimes.isha} language={language} />
        </div>
      ) : (
        <div className="text-center py-8 text-gray-600 dark:text-gray-400">
          {language === "ar" ? "يرجى السماح بالوصول إلى موقعك لعرض أوقات الصلاة" : 
           language === "bn" ? "নামাজের সময় দেখতে আপনার অবস্থানে অ্যাক্সেস অনুমতি দিন" :
           language === "hi" ? "नमाज के समय देखने के लिए कृपया अपने स्थान तक पहुंच की अनुमति दें" :
           "Please allow access to your location to view prayer times"}
        </div>
      )}
    </div>
  );
};

interface PrayerTimeCardProps {
  name: string;
  time: string;
  language: string;
}

const PrayerTimeCard = ({ name, time, language }: PrayerTimeCardProps) => {
  const translations: Record<string, Record<string, string>> = {
    ar: {
      Fajr: "الفجر",
      Dhuhr: "الظهر",
      Asr: "العصر",
      Maghrib: "المغرب",
      Isha: "العشاء",
      Sunrise: "الشروق",
    },
    bn: {
      Fajr: "ফজর",
      Dhuhr: "যোহর",
      Asr: "আসর",
      Maghrib: "মাগরিব",
      Isha: "এশা",
      Sunrise: "সূর্যোদয়",
    },
    hi: {
      Fajr: "फजर",
      Dhuhr: "जुहर",
      Asr: "अस्र",
      Maghrib: "मग़रिब",
      Isha: "इशा",
      Sunrise: "सूर्योदय",
    },
    en: {
      Fajr: "Fajr",
      Dhuhr: "Dhuhr",
      Asr: "Asr",
      Maghrib: "Maghrib",
      Isha: "Isha",
      Sunrise: "Sunrise",
    },
  };
  
  const formattedTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center">
        <div className="p-4 bg-quran-light dark:bg-quran-dark/20 w-16 flex items-center justify-center">
          <Clock className="h-6 w-6 text-quran-primary" />
        </div>
        <div className="flex-1 flex justify-between items-center p-4">
          <span className="font-medium">{translations[language][name]}</span>
          <span className="text-quran-primary">{formattedTime(time)}</span>
        </div>
      </div>
    </Card>
  );
};

export default PrayerTimes;
