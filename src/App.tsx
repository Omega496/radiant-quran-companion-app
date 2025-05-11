
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/contexts/language-context";

import AppLayout from "@/components/layout/app-layout";
import Index from "@/pages/Index";
import Surah from "@/pages/surah";
import PrayerTimes from "@/pages/prayer-times";
import Favorites from "@/pages/favorites";
import Search from "@/pages/search";
import Settings from "@/pages/settings";
import NotFound from "@/pages/NotFound";
import AllSurahs from "@/pages/all-surahs";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light">
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <SidebarProvider>
            <BrowserRouter>
              <Routes>
                <Route element={<AppLayout />}>
                  <Route path="/" element={<Index />} />
                  <Route path="/surah/:id" element={<Surah />} />
                  <Route path="/prayer-times" element={<PrayerTimes />} />
                  <Route path="/favorites" element={<Favorites />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/all-surahs" element={<AllSurahs />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </SidebarProvider>
        </TooltipProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
