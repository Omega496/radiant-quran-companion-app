
import { NavLink } from "react-router-dom";
import { Home, BookOpen, Clock, Bookmark, Search, Settings } from "lucide-react";
import { Sidebar, SidebarContent, SidebarHeader, SidebarFooter } from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import { LanguageSelector } from "@/components/language-selector";
import { useLanguage } from "@/contexts/language-context";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const { t } = useLanguage();
  
  const navItems = [
    { name: t("home"), href: "/", icon: Home },
    { name: t("surahs"), href: "/surah/1", icon: BookOpen },
    { name: t("prayer_times"), href: "/prayer-times", icon: Clock },
    { name: t("favorites"), href: "/favorites", icon: Bookmark },
    { name: t("search"), href: "/search", icon: Search },
    { name: t("settings"), href: "/settings", icon: Settings },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="py-6 px-3 flex flex-col items-center">
        <div className="text-2xl font-bold text-center">{t("app_name")}</div>
      </SidebarHeader>
      <SidebarContent>
        <nav className="space-y-1 px-2">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                )
              }
              end
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </SidebarContent>
      <SidebarFooter className="py-4 px-3 flex justify-between items-center">
        <ModeToggle />
        <LanguageSelector />
      </SidebarFooter>
    </Sidebar>
  );
}
