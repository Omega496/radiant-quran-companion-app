
import { useState, useEffect } from 'react';

export interface Bookmark {
  id: string;
  surahNumber: number;
  verseNumber: number;
  surahName: string;
  verseText: string;
  dateAdded: number;
  notes?: string;
}

export interface ReadingPosition {
  surahNumber: number;
  verseNumber: number;
  surahName: string;
  timestamp: number;
}

// Helper function to get bookmarks from localStorage
const getBookmarks = (): Bookmark[] => {
  const bookmarksJSON = localStorage.getItem('quran-bookmarks');
  return bookmarksJSON ? JSON.parse(bookmarksJSON) : [];
};

// Helper function to save bookmarks to localStorage
const saveBookmarks = (bookmarks: Bookmark[]) => {
  localStorage.setItem('quran-bookmarks', JSON.stringify(bookmarks));
};

// Helper function to get reading position from localStorage
const getReadingPosition = (): ReadingPosition | null => {
  const positionJSON = localStorage.getItem('quran-reading-position');
  return positionJSON ? JSON.parse(positionJSON) : null;
};

// Helper function to save reading position to localStorage
const saveReadingPosition = (position: ReadingPosition) => {
  localStorage.setItem('quran-reading-position', JSON.stringify(position));
};

// Custom hook to manage bookmarks
export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    setBookmarks(getBookmarks());
  }, []);

  const addBookmark = (bookmark: Omit<Bookmark, 'id' | 'dateAdded'>) => {
    const newBookmark: Bookmark = {
      ...bookmark,
      id: `${bookmark.surahNumber}-${bookmark.verseNumber}-${Date.now()}`,
      dateAdded: Date.now()
    };
    
    const updatedBookmarks = [...bookmarks, newBookmark];
    setBookmarks(updatedBookmarks);
    saveBookmarks(updatedBookmarks);
    
    return newBookmark;
  };

  const removeBookmark = (id: string) => {
    const updatedBookmarks = bookmarks.filter(bookmark => bookmark.id !== id);
    setBookmarks(updatedBookmarks);
    saveBookmarks(updatedBookmarks);
  };

  const updateBookmarkNotes = (id: string, notes: string) => {
    const updatedBookmarks = bookmarks.map(bookmark => 
      bookmark.id === id ? { ...bookmark, notes } : bookmark
    );
    setBookmarks(updatedBookmarks);
    saveBookmarks(updatedBookmarks);
  };

  return {
    bookmarks,
    addBookmark,
    removeBookmark,
    updateBookmarkNotes
  };
};

// Custom hook to manage reading position
export const useReadingPosition = () => {
  const [readingPosition, setReadingPosition] = useState<ReadingPosition | null>(null);

  useEffect(() => {
    setReadingPosition(getReadingPosition());
  }, []);

  const updateReadingPosition = (position: ReadingPosition) => {
    setReadingPosition(position);
    saveReadingPosition(position);
  };

  return {
    readingPosition,
    updateReadingPosition
  };
};
