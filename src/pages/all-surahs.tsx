
import { useState } from "react";
import { Link } from "react-router-dom";
import { useSurahs } from "@/services/quran-service";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/language-context";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { BookOpen, Search } from "lucide-react";

const AllSurahs = () => {
  const { data: surahs, isLoading } = useSurahs();
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Filter surahs based on search term
  const filteredSurahs = surahs?.filter((surah) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      surah.name.toLowerCase().includes(searchLower) ||
      surah.englishName.toLowerCase().includes(searchLower) ||
      surah.englishNameTranslation.toLowerCase().includes(searchLower) ||
      surah.number.toString().includes(searchLower)
    );
  });

  // Paginate results
  const indexOfLastSurah = currentPage * itemsPerPage;
  const indexOfFirstSurah = indexOfLastSurah - itemsPerPage;
  const currentSurahs = filteredSurahs?.slice(indexOfFirstSurah, indexOfLastSurah);
  const totalPages = filteredSurahs ? Math.ceil(filteredSurahs.length / itemsPerPage) : 0;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">{t("all_surahs")}</h1>
        <p className="text-gray-600 dark:text-gray-300">
          {t("total")}: {surahs?.length || 114} {t("surahs")}
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md mx-auto mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
        <Input
          placeholder={t("search_surahs")}
          className="pl-10"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset to first page on new search
          }}
        />
      </div>

      {/* Surahs Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array(20).fill(0).map((_, index) => (
            <Skeleton key={index} className="h-28 rounded-md" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {currentSurahs?.map((surah) => (
              <Link
                to={`/surah/${surah.number}`}
                key={surah.number}
                className="surah-card group relative border rounded-md overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                <div className="absolute top-2 left-2 bg-quran-primary text-white text-xs px-2 py-1 rounded-full">
                  {surah.number}
                </div>
                <div className="p-4 pt-8">
                  <div className="text-xl font-amiri mb-2 text-center">
                    {surah.name}
                  </div>
                  <div className="text-sm text-center text-gray-600 dark:text-gray-400">
                    {surah.englishName}
                  </div>
                  <div className="text-xs text-center text-gray-500 dark:text-gray-500 mt-1">
                    {surah.englishNameTranslation}
                  </div>
                </div>
                <div className="bg-quran-light dark:bg-quran-dark/20 text-center py-2 text-xs flex justify-between px-4">
                  <span>{surah.revelationType === "Meccan" ? 
                    (language === "ar" ? "مكية" : "Meccan") : 
                    (language === "ar" ? "مدنية" : "Medinan")}
                  </span>
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-3 w-3" />
                    <span>{surah.numberOfAyahs}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination className="mt-8">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  // Show first page, last page, and pages around current page
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          isActive={page === currentPage}
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  } else if (
                    (page === currentPage - 2 && currentPage > 3) ||
                    (page === currentPage + 2 && currentPage < totalPages - 2)
                  ) {
                    return (
                      <PaginationItem key={page}>
                        <span className="flex h-9 w-9 items-center justify-center">
                          ...
                        </span>
                      </PaginationItem>
                    );
                  }
                  return null;
                })}
                
                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
};

export default AllSurahs;
