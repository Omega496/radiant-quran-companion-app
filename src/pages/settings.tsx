import { useState, useEffect } from "react";
import { Settings as SettingsIcon, Sun, Moon, Globe, Volume2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { useLanguage } from "@/contexts/language-context";
import { useTheme } from "@/components/theme-provider";
import { toast } from "@/components/ui/sonner";

const Settings = () => {
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  
  const [audioQuality, setAudioQuality] = useState("medium");
  const [autoPlayNext, setAutoPlayNext] = useState(true);
  const [downloadEnabled, setDownloadEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [fontSize, setFontSize] = useState(100);
  
  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem("quran-app-settings");
    
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      
      if (settings.audioQuality) setAudioQuality(settings.audioQuality);
      if (settings.autoPlayNext !== undefined) setAutoPlayNext(settings.autoPlayNext);
      if (settings.downloadEnabled !== undefined) setDownloadEnabled(settings.downloadEnabled);
      if (settings.notificationsEnabled !== undefined) setNotificationsEnabled(settings.notificationsEnabled);
      if (settings.fontSize) setFontSize(settings.fontSize);
    }
  }, []);
  
  // Save settings to localStorage when they change
  useEffect(() => {
    const settings = {
      audioQuality,
      autoPlayNext,
      downloadEnabled,
      notificationsEnabled,
      fontSize
    };
    
    localStorage.setItem("quran-app-settings", JSON.stringify(settings));
  }, [audioQuality, autoPlayNext, downloadEnabled, notificationsEnabled, fontSize]);
  
  const handleClearAppData = () => {
    // Keep language and theme preferences
    const savedLanguage = language;
    const savedTheme = theme;
    
    // Clear all localStorage except language and theme
    localStorage.clear();
    
    // Restore language and theme
    localStorage.setItem("quran-app-language", savedLanguage);
    localStorage.setItem("ui-theme", savedTheme);
    
    toast.success(
      language === "ar" ? "تم مسح بيانات التطبيق" : 
      language === "bn" ? "অ্যাপ্লিকেশন ডেটা সাফ করা হয়েছে" :
      language === "hi" ? "ऐप डेटा साफ़ किया गया" :
      "App data cleared"
    );
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center flex items-center justify-center gap-2">
        <SettingsIcon className="h-8 w-8" />
        {t("settings")}
      </h1>
      
      <div className="space-y-6">
        {/* Theme Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              {language === "ar" ? "المظهر" : language === "bn" ? "থিম" : language === "hi" ? "थीम" : "Theme"}
            </CardTitle>
            <CardDescription>
              {language === "ar" ? "اختر مظهر التطبيق المفضل لديك" : 
               language === "bn" ? "আপনার পছন্দসই অ্যাপ থিম বেছে নিন" :
               language === "hi" ? "अपनी पसंदीदा ऐप थीम चुनें" :
               "Choose your preferred app theme"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={theme}
              onValueChange={(value) => setTheme(value as "light" | "dark" | "system")}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="light" id="theme-light" />
                <Label htmlFor="theme-light">
                  {language === "ar" ? "فاتح" : language === "bn" ? "লাইট" : language === "hi" ? "लाइट" : "Light"}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dark" id="theme-dark" />
                <Label htmlFor="theme-dark">
                  {language === "ar" ? "داكن" : language === "bn" ? "ডার্ক" : language === "hi" ? "डार्क" : "Dark"}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="system" id="theme-system" />
                <Label htmlFor="theme-system">
                  {language === "ar" ? "النظام" : language === "bn" ? "সিস্টেম" : language === "hi" ? "सिस्टम" : "System"}
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
        
        {/* Language Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              {language === "ar" ? "اللغة" : language === "bn" ? "ভাষা" : language === "hi" ? "भाषा" : "Language"}
            </CardTitle>
            <CardDescription>
              {language === "ar" ? "اختر لغة واجهة المستخدم" : 
               language === "bn" ? "ইউজার ইন্টারফেস ভাষা নির্বাচন করুন" :
               language === "hi" ? "उपयोगकर्ता इंटरफ़ेस भाषा चुनें" :
               "Select user interface language"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={language}
              onValueChange={(value) => setLanguage(value as "ar" | "en" | "bn" | "hi")}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="en" id="lang-en" />
                <Label htmlFor="lang-en">English</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ar" id="lang-ar" />
                <Label htmlFor="lang-ar">العربية</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bn" id="lang-bn" />
                <Label htmlFor="lang-bn">বাংলা</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="hi" id="lang-hi" />
                <Label htmlFor="lang-hi">हिन्दी</Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
        
        {/* Audio Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="h-5 w-5" />
              {language === "ar" ? "الصوت" : language === "bn" ? "অডিও" : language === "hi" ? "ऑडियो" : "Audio"}
            </CardTitle>
            <CardDescription>
              {language === "ar" ? "إعدادات التلاوة والصوت" : 
               language === "bn" ? "অডিও এবং আবৃত্তি সেটিংস" :
               language === "hi" ? "ऑडियो और पठन सेटिंग्स" :
               "Audio and recitation settings"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Audio Quality */}
            <div className="space-y-2">
              <Label>
                {language === "ar" ? "جودة الصوت" : 
                 language === "bn" ? "অডিও মান" :
                 language === "hi" ? "ऑडियो गुणवत्ता" :
                 "Audio Quality"}
              </Label>
              <RadioGroup
                value={audioQuality}
                onValueChange={setAudioQuality}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="low" id="quality-low" />
                  <Label htmlFor="quality-low">
                    {language === "ar" ? "منخفضة (48kbps)" : 
                     language === "bn" ? "নিম্ন (48kbps)" :
                     language === "hi" ? "कम (48kbps)" :
                     "Low (48kbps)"}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="quality-medium" />
                  <Label htmlFor="quality-medium">
                    {language === "ar" ? "متوسطة (128kbps)" : 
                     language === "bn" ? "মাঝারি (128kbps)" :
                     language === "hi" ? "मध्यम (128kbps)" :
                     "Medium (128kbps)"}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="high" id="quality-high" />
                  <Label htmlFor="quality-high">
                    {language === "ar" ? "عالية (256kbps)" : 
                     language === "bn" ? "উচ্চ (256kbps)" :
                     language === "hi" ? "उच्च (256kbps)" :
                     "High (256kbps)"}
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            {/* Auto Play Next */}
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-play-next">
                {language === "ar" ? "تشغيل الآية التالية تلقائيًا" : 
                 language === "bn" ? "স্বয়ংক্রিয়ভাবে পরবর্তী আয়াত চালান" :
                 language === "hi" ? "अगली आयत को स्वचालित रूप से चलाएं" :
                 "Auto-play next verse"}
              </Label>
              <Switch
                id="auto-play-next"
                checked={autoPlayNext}
                onCheckedChange={setAutoPlayNext}
              />
            </div>
          </CardContent>
        </Card>
        
        {/* Display Settings */}
        <Card>
          <CardHeader>
            <CardTitle>
              {language === "ar" ? "العرض" : language === "bn" ? "ডিসপ্লে" : language === "hi" ? "प्रदर्शन" : "Display"}
            </CardTitle>
            <CardDescription>
              {language === "ar" ? "تخصيص كيفية ظهور النص" : 
               language === "bn" ? "টেক্সট কিভাবে প্রদর্শিত হবে তা কাস্টমাইজ করুন" :
               language === "hi" ? "टेक्स्ट कैसे प्रदर्शित होता है कस्टमाइज़ करें" :
               "Customize how text is displayed"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Font Size */}
            <div className="space-y-4">
              <div className="flex justify-between">
                <Label>
                  {language === "ar" ? "حجم الخط" : 
                   language === "bn" ? "ফন্ট সাইজ" :
                   language === "hi" ? "फ़ॉन्ट आकार" :
                   "Font Size"}
                </Label>
                <span className="text-sm text-gray-600 dark:text-gray-400">{fontSize}%</span>
              </div>
              <Slider
                value={[fontSize]}
                onValueChange={(value) => setFontSize(value[0])}
                min={50}
                max={200}
                step={10}
              />
              <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>A</span>
                <span className="text-xl">A</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Offline & Storage */}
        <Card>
          <CardHeader>
            <CardTitle>
              {language === "ar" ? "وضع عدم الاتصال والتخزين" : 
               language === "bn" ? "অফলাইন এবং স্টোরেজ" :
               language === "hi" ? "ऑफलाइन और स्टोरेज" :
               "Offline & Storage"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="download-for-offline">
                {language === "ar" ? "تنزيل السور للقراءة بدون إنترنت" : 
                 language === "bn" ? "অফলাইন পাঠের জন্য সূরা ডাউনলোড করুন" :
                 language === "hi" ? "ऑफलाइन पढ़ने के लिए सूरतों को डाउनलोड करें" :
                 "Download surahs for offline reading"}
              </Label>
              <Switch
                id="download-for-offline"
                checked={downloadEnabled}
                onCheckedChange={setDownloadEnabled}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications">
                {language === "ar" ? "الإشعارات" : 
                 language === "bn" ? "বিজ্ঞপ্তি" :
                 language === "hi" ? "नोटिफिकेशन" :
                 "Notifications"}
              </Label>
              <Switch
                id="notifications"
                checked={notificationsEnabled}
                onCheckedChange={setNotificationsEnabled}
              />
            </div>
          </CardContent>
        </Card>
        
        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle>
              {language === "ar" ? "إدارة البيانات" : 
               language === "bn" ? "ডেটা ব্যবস্থাপনা" :
               language === "hi" ? "डेटा प्रबंधन" :
               "Data Management"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <button
              onClick={handleClearAppData}
              className="w-full p-2 border border-destructive text-destructive rounded-md hover:bg-destructive/10 transition-colors"
            >
              {language === "ar" ? "مسح بيانات التطبيق" : 
               language === "bn" ? "অ্যাপ্লিকেশন ডেটা সাফ করুন" :
               language === "hi" ? "ऐप डेटा साफ़ करें" :
               "Clear App Data"}
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
