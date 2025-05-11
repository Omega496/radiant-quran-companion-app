
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/language-context";
import { language as LanguageIcon } from "lucide-react";

const languages = [
  { id: "ar", label: "العربية" },
  { id: "en", label: "English" },
  { id: "bn", label: "বাংলা" },
  { id: "hi", label: "हिन्दी" },
];

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  
  const handleLanguageChange = (lang: string) => {
    setLanguage(lang as "ar" | "en" | "bn" | "hi");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="text-sidebar-foreground hover:bg-sidebar-accent/50">
          <LanguageIcon className="h-5 w-5" />
          <span className="sr-only">Select language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.id}
            onClick={() => handleLanguageChange(lang.id)}
            className={language === lang.id ? "bg-accent/50" : ""}
          >
            {lang.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
