import { useState, useCallback } from "react";
import { Navigation } from "@/components/navigation";
import { type Language } from "@/components/language-toggle";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import "./CalendarViewer.css";

const TOTAL_PAGES = 13; // Cover + 12 months

const MONTHS = [
  { label: "Cover", shortLabel: "2026" },
  { label: "January", shortLabel: "JAN" },
  { label: "February", shortLabel: "FEB" },
  { label: "March", shortLabel: "MAR" },
  { label: "April", shortLabel: "APR" },
  { label: "May", shortLabel: "MAY" },
  { label: "June", shortLabel: "JUN" },
  { label: "July", shortLabel: "JUL" },
  { label: "August", shortLabel: "AUG" },
  { label: "September", shortLabel: "SEP" },
  { label: "October", shortLabel: "OCT" },
  { label: "November", shortLabel: "NOV" },
  { label: "December", shortLabel: "DEC" },
];

const Calendar = () => {
  const [language, setLanguage] = useState<Language>("en");
  const [currentPage, setCurrentPage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationDirection, setAnimationDirection] = useState<"forward" | "backward" | null>(null);
  const [displayedPage, setDisplayedPage] = useState(0);

  const goToPage = useCallback((pageIndex: number) => {
    if (isAnimating || pageIndex === currentPage || pageIndex < 0 || pageIndex >= TOTAL_PAGES) {
      return;
    }

    const direction = pageIndex > currentPage ? "forward" : "backward";
    setAnimationDirection(direction);
    setIsAnimating(true);

    // After animation completes, update the displayed page
    setTimeout(() => {
      setDisplayedPage(pageIndex);
      setCurrentPage(pageIndex);
      setIsAnimating(false);
      setAnimationDirection(null);
    }, 600);
  }, [currentPage, isAnimating]);

  const goNext = useCallback(() => {
    if (currentPage < TOTAL_PAGES - 1) {
      goToPage(currentPage + 1);
    }
  }, [currentPage, goToPage]);

  const goPrevious = useCallback(() => {
    if (currentPage > 0) {
      goToPage(currentPage - 1);
    }
  }, [currentPage, goToPage]);

  const getPageImageSrc = (pageIndex: number) => {
    return `/calendar/page-${pageIndex}.jpg`;
  };

  const getAnimationClass = () => {
    if (!isAnimating || !animationDirection) return "";
    return animationDirection === "forward" ? "page-exit-forward" : "page-exit-backward";
  };

  const getEnterAnimationClass = () => {
    if (!isAnimating || !animationDirection) return "";
    return animationDirection === "forward" ? "page-enter-forward" : "page-enter-backward";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation language={language} onLanguageChange={setLanguage} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-neon mb-2">
            {language === "ta" ? "2026 நாட்காட்டி" : "2026 Calendar"}
          </h1>
          <p className="text-muted-foreground">
            {MONTHS[currentPage].label}
          </p>
        </div>

        {/* Calendar Viewer */}
        <div className="flex flex-col items-center gap-6">
          {/* Navigation Arrows + Calendar */}
          <div className="flex items-center gap-4 w-full max-w-4xl justify-center">
            {/* Previous Button */}
            <Button
              variant="outline"
              size="lg"
              onClick={goPrevious}
              disabled={isAnimating || currentPage === 0}
              className="flex-shrink-0 h-12 w-12 rounded-full bg-card/50 backdrop-blur-sm border-glass-border hover:bg-card-hover hover:border-neon/30 disabled:opacity-30"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>

            {/* Calendar Display */}
            <div className="calendar-container relative w-full max-w-2xl aspect-[3/4] rounded-2xl overflow-hidden shadow-elevated bg-card border border-glass-border">
              {/* Current page (exits during animation) */}
              <div
                className={cn(
                  "calendar-page absolute inset-0",
                  isAnimating && getAnimationClass()
                )}
              >
                <img
                  src={getPageImageSrc(displayedPage)}
                  alt={`Calendar - ${MONTHS[displayedPage].label}`}
                  className="w-full h-full object-contain bg-background"
                />
                <div className="page-shadow" />
                <div className="page-curl" />
              </div>

              {/* Next page (enters during animation) */}
              {isAnimating && (
                <div
                  className={cn(
                    "calendar-page absolute inset-0",
                    getEnterAnimationClass()
                  )}
                >
                  <img
                    src={getPageImageSrc(animationDirection === "forward" ? currentPage + 1 : currentPage - 1)}
                    alt={`Calendar - ${MONTHS[animationDirection === "forward" ? currentPage + 1 : currentPage - 1]?.label}`}
                    className="w-full h-full object-contain bg-background"
                  />
                </div>
              )}

              {/* Page indicator */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm px-4 py-2 rounded-full border border-glass-border">
                <span className="text-sm font-medium">
                  {currentPage + 1} / {TOTAL_PAGES}
                </span>
              </div>
            </div>

            {/* Next Button */}
            <Button
              variant="outline"
              size="lg"
              onClick={goNext}
              disabled={isAnimating || currentPage === TOTAL_PAGES - 1}
              className="flex-shrink-0 h-12 w-12 rounded-full bg-card/50 backdrop-blur-sm border-glass-border hover:bg-card-hover hover:border-neon/30 disabled:opacity-30"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>

          {/* Month Quick Jump Buttons */}
          <div className="w-full max-w-4xl">
            <div className="flex flex-wrap justify-center gap-2">
              {MONTHS.map((month, index) => (
                <Button
                  key={index}
                  variant={currentPage === index ? "default" : "outline"}
                  size="sm"
                  onClick={() => goToPage(index)}
                  disabled={isAnimating}
                  className={cn(
                    "min-w-[50px] text-xs font-medium transition-all duration-200",
                    currentPage === index
                      ? "bg-neon text-neon-foreground shadow-neon"
                      : "bg-card/50 backdrop-blur-sm border-glass-border hover:bg-card-hover hover:border-neon/30",
                    isAnimating && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {month.shortLabel}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Calendar;
