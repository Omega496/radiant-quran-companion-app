
import { Outlet } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";

const AppLayout = () => {
  return (
    <div className="min-h-screen flex w-full">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="border-b bg-white dark:bg-gray-900 p-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="lg:hidden" />
          </div>
        </header>
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto py-6 px-4 sm:px-6">
            <Outlet />
          </div>
        </main>
        <footer className="border-t bg-white dark:bg-gray-900 p-4 text-center text-sm text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} Al Quran App
        </footer>
      </div>
    </div>
  );
};

export default AppLayout;
