import { useParams } from "react-router-dom";
import { useState } from "react";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";

const Reader = () => {
  const { id } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const totalPages = 85;

  // Mock user email for watermark
  const userEmail = "user@example.com";

  return (
    <div
      className="min-h-screen bg-foreground flex flex-col select-none"
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-foreground/95 border-b border-background/10">
        <a href="/library" className="text-background/70 text-sm hover:text-background transition-colors">
          ← 내 서재로
        </a>
        <span className="text-background/50 text-sm">
          {currentPage} / {totalPages} 페이지
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoom((z) => Math.max(50, z - 10))}
            className="p-1.5 rounded-lg text-background/50 hover:text-background hover:bg-background/10 transition-colors"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <span className="text-background/50 text-xs w-10 text-center">{zoom}%</span>
          <button
            onClick={() => setZoom((z) => Math.min(200, z + 10))}
            className="p-1.5 rounded-lg text-background/50 hover:text-background hover:bg-background/10 transition-colors"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Reader Area */}
      <div className="flex-1 relative flex items-center justify-center overflow-auto p-4">
        {/* Page content placeholder */}
        <div
          className="relative bg-background rounded-lg shadow-2xl"
          style={{
            width: `${(595 * zoom) / 100}px`,
            height: `${(842 * zoom) / 100}px`,
            maxWidth: "100%",
          }}
        >
          {/* Placeholder content */}
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
            <div className="text-center">
              <p className="text-lg font-bold mb-2">페이지 {currentPage}</p>
              <p className="text-xs">전자책 콘텐츠가 여기에 표시됩니다</p>
            </div>
          </div>

          {/* Watermark overlay */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-20 -rotate-45 opacity-[0.06]">
              {[...Array(20)].map((_, i) => (
                <span key={i} className="text-foreground text-sm whitespace-nowrap font-medium">
                  {userEmail}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-background/10 text-background/50 hover:bg-background/20 hover:text-background transition-all disabled:opacity-20"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-background/10 text-background/50 hover:bg-background/20 hover:text-background transition-all disabled:opacity-20"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* Bottom progress */}
      <div className="px-4 py-3 bg-foreground/95 border-t border-background/10">
        <div className="flex items-center gap-3">
          <span className="text-background/40 text-xs">{currentPage}</span>
          <input
            type="range"
            min={1}
            max={totalPages}
            value={currentPage}
            onChange={(e) => setCurrentPage(Number(e.target.value))}
            className="flex-1 h-1 accent-primary"
          />
          <span className="text-background/40 text-xs">{totalPages}</span>
        </div>
      </div>
    </div>
  );
};

export default Reader;
