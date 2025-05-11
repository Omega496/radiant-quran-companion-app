
import { useState } from "react";
import { Link } from "react-router-dom";
import { Bookmark, X, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useBookmarks } from "@/services/favorites-service";
import { useLanguage } from "@/contexts/language-context";
import { toast } from "@/components/ui/sonner";

const Favorites = () => {
  const { bookmarks, removeBookmark } = useBookmarks();
  const { language, t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");

  const handleRemoveBookmark = (id: string) => {
    removeBookmark(id);
    toast.success(t("bookmark") + " " + (language === "ar" ? "تمت إزالته" : language === "bn" ? "সরানো হয়েছে" : language === "hi" ? "हटा दिया गया" : "removed"));
  };

  const filteredBookmarks = bookmarks.filter(
    (bookmark) =>
      bookmark.surahName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bookmark.verseText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${t("surah")} ${bookmark.surahNumber}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-center">
        {t("favorites")}
      </h1>

      {/* Search */}
      <div className="relative mb-6">
        <Input
          type="text"
          placeholder={language === "ar" ? "بحث في المفضلة" : language === "bn" ? "প্রিয়গুলিতে অনুসন্ধান করুন" : language === "hi" ? "पसंदीदा में खोजें" : "Search in favorites"}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      </div>

      {/* Bookmarks */}
      {filteredBookmarks.length > 0 ? (
        <div className="space-y-4">
          {filteredBookmarks.map((bookmark) => (
            <Card key={bookmark.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex items-center gap-2 bg-quran-light dark:bg-quran-dark/20 p-3">
                  <Bookmark className="h-5 w-5 text-quran-primary" />
                  <span className="font-medium">
                    {t("surah")} {bookmark.surahNumber}, {t("verses")} {bookmark.verseNumber}
                  </span>
                  <span className="font-amiri ml-auto">
                    {bookmark.surahName}
                  </span>
                </div>

                <div className="p-4">
                  <div dir="rtl" className="arabic-text text-xl mb-3 font-amiri">
                    {bookmark.verseText}
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveBookmark(bookmark.id)}
                      className="text-white"
                    >
                      <X className="h-4 w-4 mr-1" />
                      {language === "ar" ? "إزالة" : language === "bn" ? "সরান" : language === "hi" ? "हटाएं" : "Remove"}
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="text-quran-primary"
                    >
                      <Link to={`/surah/${bookmark.surahNumber}?verse=${bookmark.verseNumber}`}>
                        {language === "ar" ? "عرض" : language === "bn" ? "দেখুন" : language === "hi" ? "देखें" : "View"}
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <Bookmark className="h-16 w-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <h2 className="text-xl font-semibold mb-2">
            {language === "ar" ? "لا توجد إشارات مرجعية" : language === "bn" ? "কোন বুকমার্ক নেই" : language === "hi" ? "कोई बुकमार्क नहीं" : "No bookmarks yet"}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {language === "ar" ? "احفظ آياتك المفضلة للوصول إليها بسرعة" : language === "bn" ? "দ্রুত অ্যাক্সেসের জন্য আপনার প্রিয় আয়াতগুলি সংরক্ষণ করুন" : language === "hi" ? "तेज़ी से पहुंच के लिए अपनी पसंदीदा आयतें सेव करें" : "Save your favorite verses for quick access"}
          </p>
          <Button asChild className="bg-quran-primary hover:bg-quran-secondary">
            <Link to="/surah/1">
              {language === "ar" ? "ابدأ القراءة" : language === "bn" ? "পড়া শুরু করুন" : language === "hi" ? "पढ़ना शुरू करें" : "Start Reading"}
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default Favorites;
