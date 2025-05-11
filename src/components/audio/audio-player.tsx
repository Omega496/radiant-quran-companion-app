
import { useState, useEffect, useRef } from "react";
import { Play, Pause, SkipForward, SkipBack, Repeat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language-context";
import { cn } from "@/lib/utils";

interface AudioPlayerProps {
  audioUrls: string[];
  onVerseChange?: (verseIndex: number) => void;
  currentVerseIndex?: number;
  className?: string;
}

export function AudioPlayer({
  audioUrls,
  onVerseChange,
  currentVerseIndex = 0,
  className,
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudioIndex, setCurrentAudioIndex] = useState(currentVerseIndex);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isRepeat, setIsRepeat] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { t } = useLanguage();

  // Create audio element on mount
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", () => {
      setDuration(audio.duration);
    });
    audio.addEventListener("ended", handleAudioEnd);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", () => {});
      audio.removeEventListener("ended", handleAudioEnd);
      audio.pause();
    };
  }, []);

  // Update audio source when currentAudioIndex changes
  useEffect(() => {
    if (audioRef.current && audioUrls.length > 0) {
      const audio = audioRef.current;
      audio.src = audioUrls[currentAudioIndex];
      audio.load();
      
      if (isPlaying) {
        audio.play().catch(error => {
          console.error("Error playing audio:", error);
          setIsPlaying(false);
        });
      }
      
      if (onVerseChange) {
        onVerseChange(currentAudioIndex);
      }
    }
  }, [currentAudioIndex, audioUrls]);

  // Handle play/pause
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(error => {
          console.error("Error playing audio:", error);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Handle external currentVerseIndex changes
  useEffect(() => {
    if (currentVerseIndex !== currentAudioIndex) {
      setCurrentAudioIndex(currentVerseIndex);
    }
  }, [currentVerseIndex]);

  const updateProgress = () => {
    if (audioRef.current) {
      const currentProgress =
        (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(currentProgress);
    }
  };

  const handleAudioEnd = () => {
    if (isRepeat) {
      // Repeat current verse
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(console.error);
      }
    } else if (currentAudioIndex < audioUrls.length - 1) {
      // Move to next verse
      setCurrentAudioIndex(currentAudioIndex + 1);
    } else {
      // End of playlist
      setIsPlaying(false);
      setProgress(0);
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handlePrevious = () => {
    if (currentAudioIndex > 0) {
      setCurrentAudioIndex(currentAudioIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentAudioIndex < audioUrls.length - 1) {
      setCurrentAudioIndex(currentAudioIndex + 1);
    }
  };

  const toggleRepeat = () => {
    setIsRepeat(!isRepeat);
  };

  return (
    <div className={cn("bg-white dark:bg-gray-800 rounded-lg shadow-md p-4", className)}>
      <div className="audio-progress mb-3">
        <div className="audio-progress-bar" style={{ width: `${progress}%` }} />
      </div>
      
      <div className="audio-controls">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleRepeat}
          className={cn(
            "rounded-full",
            isRepeat && "text-quran-primary bg-quran-light dark:bg-quran-dark/30"
          )}
        >
          <Repeat className="h-5 w-5" />
          <span className="sr-only">Repeat</span>
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePrevious}
          disabled={currentAudioIndex === 0}
          className="rounded-full"
        >
          <SkipBack className="h-5 w-5" />
          <span className="sr-only">{t("previous")}</span>
        </Button>
        
        <Button
          variant="default"
          size="icon"
          onClick={togglePlayPause}
          className="rounded-full bg-quran-primary hover:bg-quran-secondary text-white h-10 w-10"
        >
          {isPlaying ? (
            <>
              <Pause className="h-5 w-5" />
              <span className="sr-only">{t("pause")}</span>
            </>
          ) : (
            <>
              <Play className="h-5 w-5" />
              <span className="sr-only">{t("play")}</span>
            </>
          )}
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={handleNext}
          disabled={currentAudioIndex === audioUrls.length - 1}
          className="rounded-full"
        >
          <SkipForward className="h-5 w-5" />
          <span className="sr-only">{t("next")}</span>
        </Button>
        
        <div className="text-sm text-gray-500 dark:text-gray-400 ml-2">
          {currentAudioIndex + 1}/{audioUrls.length}
        </div>
      </div>
    </div>
  );
}
