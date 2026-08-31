import { useParams, Link, useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, List, X, CheckCircle2, Paperclip, Link2, FileText, Download, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockToc = [
  {
    title: "1. 이걸 모르고 돈을 벌겠다고? 돈벌기 10계명",
    items: [
      { id: "1-0", title: "1-0. 비밀문서에서 가장 중요한 부자되기 10계명", page: 1 },
      { id: "1-1", title: "1-1. <문제해결>을 못하고 부자가 된 사람은 없다.", page: 5, isNew: true },
      { id: "1-2", title: "1-2. <부자되는 뇌>모드로 세팅하기", page: 10 },
      { id: "1-3", title: "1-3. 돈을 움직이는 단 2가지의 공식 <수요와 공급>, <노출과...", page: 15 },
      { id: "1-4", title: "1-4. 사업이 절대 망하지 않는 방법 <확률 높이기>", page: 20 },
      { id: "1-5", title: "1-5. <돈 버는 운>을 끌어당기는 법", page: 25 },
      { id: "1-6", title: "1-6. 사람들이 지갑을 여는 이유 <이득>", page: 30 },
      { id: "1-7", title: "1-7. 사람들이 지갑을 여는 단계 <퍼널>", page: 35 },
      { id: "1-8", title: "1-8. 나만의 돈버는 틈새를 찾는 법 <경쟁 피하기>", page: 40 },
      { id: "1-9", title: "1-9. 자동화를 위해 꼭 필요한 것 <보아뱀 만들기>", page: 45 },
      { id: "1-10", title: "1-10. 월 100만원을 벌기 시작했다. 그 다음은?", page: 50, isNew: true },
    ],
  },
  {
    title: "2. 세가지만 할 줄 알면 무엇이든 팔 수 있습니다",
    items: [
      { id: "2-1", title: "2-1. 목표세우기, 기대치 조정하기 마케팅 자동화", page: 55 },
      { id: "2-2", title: "2-2. 고객을 이해하는 법", page: 60 },
      { id: "2-3", title: "2-3. 판매 전략 수립하기", page: 65 },
    ],
  },
];

/**
 * 페이지별 링크·첨부 자료. 본문(PDF/이미지)에서는 링크를 누를 수 없으므로
 * 해당 페이지에 걸린 링크와 내려받을 자료를 우측 패널로 따로 제공한다.
 * 키는 페이지 번호이며, 없는 페이지는 빈 상태로 표시된다.
 */
const mockResources: Record<number, {
  links: { label: string; url: string }[];
  files: { name: string; size: string; url: string }[];
}> = {
  1: {
    links: [
      { label: "부자되기 10계명 전체 요약본 (Notion)", url: "https://www.notion.so" },
      { label: "강의 참고 유튜브 영상", url: "https://www.youtube.com" },
    ],
    files: [
      { name: "돈벌기 10계명 체크리스트.pdf", size: "1.2 MB", url: "#" },
      { name: "실습 워크시트.xlsx", size: "340 KB", url: "#" },
    ],
  },
  5: {
    links: [
      { label: "문제해결 사례 모음 (구글 시트)", url: "https://docs.google.com/spreadsheets" },
    ],
    files: [
      { name: "문제해결 사례 30선.pdf", size: "820 KB", url: "#" },
    ],
  },
  10: {
    links: [
      { label: "부자되는 뇌 세팅 체크리스트", url: "https://example.com/checklist" },
    ],
    files: [],
  },
};

/** 쪽을 지정하지 않은 자료. 모든 페이지에서 함께 보인다. */
const commonResources: {
  links: { label: string; url: string }[];
  files: { name: string; size: string; url: string }[];
} = {
  links: [{ label: "디하클 카페 (질문·인증 게시판)", url: "https://cafe.naver.com/dinohighclass" }],
  files: [{ name: "전체 실습자료 모음.zip", size: "4.8 MB", url: "#" }],
};

const emptyResources = { links: [], files: [] };

const Reader = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  /**
   * 구매 전 미리보기. 로그인 없이 들어올 수 있고, from~to 밖으로는 넘어갈 수 없다.
   * 실제 서비스에서는 이 구간의 원고만 내려줘야 한다(전체를 보내고 화면에서만
   * 막으면 개발자 도구로 열람할 수 있음).
   */
  const isPreview = params.get("preview") === "1";
  const previewFrom = Math.max(1, Number(params.get("from")) || 1);
  const previewTo = Math.max(previewFrom, Number(params.get("to")) || previewFrom);

  const [currentPage, setCurrentPage] = useState(isPreview ? previewFrom : 1);
  const [zoom, setZoom] = useState(100);
  const [tocOpen, setTocOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [completedSections, setCompletedSections] = useState<string[]>(["1-0", "1-1", "1-2", "1-3", "1-4", "1-5", "1-6", "1-7", "1-8", "1-9"]);
  const totalPages = 85;
  // 미리보기에서는 허용 구간 밖으로 나가지 못하게 막는다.
  const minPage = isPreview ? previewFrom : 1;
  const maxPage = isPreview ? Math.min(previewTo, totalPages) : totalPages;
  const goPage = (p: number) => setCurrentPage(Math.min(maxPage, Math.max(minPage, p)));
  const atPreviewEnd = isPreview && currentPage >= maxPage;

  const userEmail = "belleba@naver.com";

  const handleTocClick = (page: number) => {
    goPage(page);
    // Close TOC on mobile after selecting
    if (window.innerWidth < 768) {
      setTocOpen(false);
    }
  };

  const toggleComplete = (sectionId: string) => {
    setCompletedSections((prev) =>
      prev.includes(sectionId) ? prev.filter((s) => s !== sectionId) : [...prev, sectionId]
    );
  };

  const currentContent = {
    chapterTitle: "스토어-2. 네이버 쇼핑 순위 올리는 원리",
    heading: "네이버쇼핑 순위 올리는 원리",
    updateNote: "<2025년 1월 업데이트>",
    updateText: '현재는 네이버 플러스 스토어 오픈 후, 네이버 쇼핑의 명칭이 "네이버 가격비교"로 변경되었습니다. 이해를 돕기 위해 기존 명칭인 "네이버쇼핑"이라고 명칭하도록 하겠습니다.',
    body: "우리가 스마트스토어를 하는 궁극적인 목표는 매출을 높이는 것입니다. 매출을 높이기 위해서는 내 상품의 네이버쇼핑 순위를 올려야합니다. 순위가 오르면 그만큼 많은 고객에게 내 상품이 노출되어 클릭이 생기고, 구매가 이루어지고, 리뷰가 쌓여 매출이 올라가니까요.",
    body2: "그렇다면 쇼핑검색 순위의 원리는 어떻게될까요?",
  };

  const pageResources = mockResources[currentPage] ?? emptyResources;
  // 쪽을 비워 등록한 자료는 어느 페이지에서든 함께 보여준다.
  const resources = {
    links: [...pageResources.links, ...commonResources.links],
    files: [...pageResources.files, ...commonResources.files],
  };
  const resourceCount = resources.links.length + resources.files.length;

  // TocContent와 마찬가지로 함수 호출식으로 쓴다. 본문 안에서 컴포넌트를
  // 선언하면 매 렌더마다 새 타입이 되어 서브트리가 통째로 다시 마운트된다.
  const ResourcePanel = () => (
    <div className="p-4">
      <p className="text-xs text-muted-foreground mb-4">
        {currentPage}페이지에 등록된 링크와 자료입니다. 전체 자료도 함께 표시됩니다.
      </p>

      {resourceCount === 0 ? (
        <p className="text-sm text-muted-foreground py-10 text-center">
          이 페이지에는 등록된 자료가 없습니다.
        </p>
      ) : (
        <>
          {resources.links.length > 0 && (
            <div className="mb-5">
              <p className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground mb-2">
                <Link2 className="h-3.5 w-3.5" /> 링크
              </p>
              <ul className="space-y-2">
                {resources.links.map((l) => (
                  <li key={l.url + l.label}>
                    {/* 본문에서는 링크를 누를 수 없어 여기서 새 탭으로 열어준다. */}
                    <a
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-2 rounded-lg border border-border px-3 py-2.5 hover:bg-muted transition-colors"
                    >
                      <Link2 className="h-3.5 w-3.5 mt-0.5 shrink-0 text-primary" />
                      <span className="text-sm text-foreground leading-snug">{l.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {resources.files.length > 0 && (
            <div>
              <p className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground mb-2">
                <FileText className="h-3.5 w-3.5" /> 첨부 자료
              </p>
              <ul className="space-y-2">
                {resources.files.map((f) => (
                  <li key={f.name}>
                    {/* 데모에는 실제 파일이 없어 주소는 비워 둔다. 연동 시 다운로드 URL로 교체. */}
                    <a
                      href={f.url}
                      download
                      className="flex items-center gap-2 rounded-lg border border-border px-3 py-2.5 hover:bg-muted transition-colors"
                    >
                      <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm text-foreground truncate">{f.name}</span>
                        <span className="block text-[11px] text-muted-foreground mt-0.5">{f.size}</span>
                      </span>
                      <Download className="h-4 w-4 shrink-0 text-muted-foreground" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );

  const TocContent = () => (
    <div className="p-4">
      {mockToc.map((chapter, ci) => (
        <div key={ci} className="mb-6">
          <h3 className="text-sm font-bold text-foreground mb-3 leading-snug">
            {chapter.title}
          </h3>
          <div className="space-y-1">
            {chapter.items.map((item) => {
              const isCompleted = completedSections.includes(item.id);
              const isActive = currentPage === item.page;
              return (
                <div
                  key={item.id}
                  className={`flex items-start gap-2 py-2.5 px-2 rounded-lg cursor-pointer transition-colors ${
                    isActive ? "bg-primary/10" : "hover:bg-muted"
                  }`}
                  onClick={() => handleTocClick(item.page)}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleComplete(item.id);
                    }}
                    className="mt-0.5 shrink-0"
                  >
                    <CheckCircle2
                      className={`h-4 w-4 ${
                        isCompleted ? "text-green-500 fill-green-500" : "text-border"
                      }`}
                    />
                  </button>
                  <span
                    className={`text-sm leading-snug flex-1 ${
                      isActive ? "text-primary font-medium" : "text-foreground/80"
                    }`}
                  >
                    {item.title}
                  </span>
                  {item.isNew && (
                    <span className="text-[11px] font-bold text-destructive bg-destructive/10 px-1.5 py-0.5 rounded shrink-0">
                      N
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div
      className="h-screen bg-background flex flex-col select-none overflow-hidden"
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-3 tablet:px-4 py-2.5 tablet:py-3 bg-card border-b border-border shrink-0">
        <div className="flex items-center gap-2 tablet:gap-3">
          <Link
            to={isPreview ? `/book/${id}` : "/library"}
            className="text-muted-foreground text-xs tablet:text-sm hover:text-foreground transition-colors"
          >
            ← {isPreview ? "상품" : "서재"}
          </Link>
          {isPreview && (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-primary/10 text-primary whitespace-nowrap">
              미리보기
            </span>
          )}
          <button
            onClick={() => setTocOpen(!tocOpen)}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <List className="h-4 w-4" />
          </button>
        </div>
        <span className="text-muted-foreground text-xs tablet:text-sm">
          {currentPage} / {isPreview ? maxPage : totalPages}
        </span>
        <div className="flex items-center gap-1 tablet:gap-2">
          <button
            onClick={() => setZoom((z) => Math.max(70, z - 10))}
            aria-label="글자 작게"
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <span className="text-muted-foreground text-[11px] tablet:text-xs w-8 tablet:w-10 text-center">{zoom}%</span>
          <button
            onClick={() => setZoom((z) => Math.min(200, z + 10))}
            aria-label="글자 크게"
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            onClick={() => setPanelOpen((v) => !v)}
            aria-label="링크 · 자료"
            className={`relative p-2 rounded-lg transition-colors ${
              panelOpen ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <Paperclip className="h-4 w-4" />
            {resourceCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
                {resourceCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Mobile TOC overlay */}
        {tocOpen && (
          <>
            <div
              className="tablet:hidden fixed inset-0 bg-foreground/40 z-40"
              onClick={() => setTocOpen(false)}
            />
            <div className="tablet:hidden fixed inset-y-0 left-0 w-[85vw] max-w-[340px] bg-card z-50 overflow-y-auto shadow-2xl animate-in slide-in-from-left duration-200">
              <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-card z-10">
                <h2 className="text-sm font-bold">목차</h2>
                <button onClick={() => setTocOpen(false)} className="p-1 rounded-lg hover:bg-muted">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <TocContent />
            </div>
          </>
        )}

        {/* Desktop TOC Sidebar */}
        {tocOpen && (
          <div className="hidden tablet:block w-[340px] shrink-0 bg-card border-r border-border overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-card z-10">
              <h2 className="text-sm font-bold">목차</h2>
              <button onClick={() => setTocOpen(false)} className="p-1 rounded-lg hover:bg-muted">
                <X className="h-4 w-4" />
              </button>
            </div>
            <TocContent />
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 relative overflow-auto">
          {/* Sizes below are in `em` so the zoom control on the top bar actually
              cascades. Fixed `text-sm`-style classes would override the parent's
              percentage font-size and leave the zoom buttons doing nothing. */}
          <div className="max-w-3xl mx-auto px-4 tablet:px-8 py-6 tablet:py-10" style={{ fontSize: `${zoom}%` }}>
            <h2 className="text-[1.2em] font-bold text-foreground mb-6 tablet:mb-8">
              {currentContent.chapterTitle}
            </h2>
            <h1 className="text-[1.45em] font-bold text-primary mb-4 tablet:mb-6">
              {currentContent.heading}
            </h1>
            <div className="mb-4 tablet:mb-6">
              <p className="text-primary font-medium text-[0.85em] mb-2">
                {currentContent.updateNote}
              </p>
              <p className="text-primary text-[0.85em] leading-relaxed">
                {currentContent.updateText}
              </p>
            </div>
            <div className="space-y-3 tablet:space-y-4 text-foreground/90 text-[1em] leading-relaxed">
              <p>{currentContent.body}</p>
              <p>{currentContent.body2}</p>
            </div>
          </div>

          {/* 미리보기 마지막 쪽에서 더 못 넘어간다는 걸 알리고 구매로 이어 준다. */}
          {atPreviewEnd && (
            <div className="max-w-3xl mx-auto px-4 tablet:px-8 pb-10">
              <div className="rounded-xl border border-border bg-card p-5 text-center">
                <Lock className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm font-bold">미리보기는 여기까지입니다</p>
                <p className="text-xs text-muted-foreground mt-1 mb-4">
                  나머지 내용은 구매 후 보실 수 있습니다.
                </p>
                <Button
                  className="w-full max-w-xs h-11 rounded-xl text-sm font-bold bg-brand text-white hover:bg-brand/90"
                  onClick={() => navigate(`/book/${id}`)}
                >
                  지금 바로 구매하기
                </Button>
              </div>
            </div>
          )}

          {/* Watermark overlay */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-16 tablet:gap-32 -rotate-[30deg] opacity-[0.07]">
              {[...Array(30)].map((_, i) => (
                <span key={i} className="text-muted-foreground text-sm tablet:text-lg whitespace-nowrap font-medium">
                  {userEmail}
                </span>
              ))}
            </div>
          </div>

          {/* Navigation arrows - hidden on mobile (use swipe/progress bar) */}
          <button
            onClick={() => goPage(currentPage - 1)}
            disabled={currentPage <= minPage}
            className="hidden tablet:block absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground transition-all disabled:opacity-20"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => goPage(currentPage + 1)}
            disabled={currentPage >= maxPage}
            className="hidden tablet:block absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground transition-all disabled:opacity-20"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* 모바일 자료 패널 */}
        {panelOpen && (
          <>
            <div
              className="tablet:hidden fixed inset-0 bg-foreground/40 z-40"
              onClick={() => setPanelOpen(false)}
            />
            <div className="tablet:hidden fixed inset-y-0 right-0 w-[85vw] max-w-[340px] bg-card z-50 overflow-y-auto shadow-2xl animate-in slide-in-from-right duration-200">
              <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-card z-20">
                <h2 className="text-sm font-bold flex items-center gap-1.5">
                  <Paperclip className="h-4 w-4" /> 링크 · 자료
                </h2>
                <button onClick={() => setPanelOpen(false)} className="p-1 rounded-lg hover:bg-muted">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <ResourcePanel />
            </div>
          </>
        )}

        {/* 데스크톱 자료 패널 */}
        {panelOpen && (
          <div className="hidden tablet:block w-[320px] shrink-0 bg-card border-l border-border overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-card z-20">
              <h2 className="text-sm font-bold flex items-center gap-1.5">
                <Paperclip className="h-4 w-4" /> 링크 · 자료
              </h2>
              <button onClick={() => setPanelOpen(false)} className="p-1 rounded-lg hover:bg-muted">
                <X className="h-4 w-4" />
              </button>
            </div>
            <ResourcePanel />
          </div>
        )}
      </div>

      {/* Bottom progress + mobile nav */}
      <div className="px-3 tablet:px-4 py-2.5 tablet:py-3 bg-card border-t border-border shrink-0">
        {/* Mobile prev/next buttons */}
        <div className="flex tablet:hidden items-center gap-2 mb-2">
          <button
            onClick={() => goPage(currentPage - 1)}
            disabled={currentPage <= minPage}
            className="flex-1 py-2 rounded-lg bg-muted text-sm font-medium text-foreground disabled:opacity-30 active:bg-muted/70 transition-colors"
          >
            ← 이전
          </button>
          <button
            onClick={() => goPage(currentPage + 1)}
            disabled={currentPage >= maxPage}
            className="flex-1 py-2 rounded-lg bg-muted text-sm font-medium text-foreground disabled:opacity-30 active:bg-muted/70 transition-colors"
          >
            다음 →
          </button>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-muted-foreground text-xs">{currentPage}</span>
          <input
            type="range"
            min={minPage}
            max={maxPage}
            value={currentPage}
            onChange={(e) => goPage(Number(e.target.value))}
            className="flex-1 h-1 accent-primary"
          />
          <span className="text-muted-foreground text-xs">{maxPage}</span>
        </div>
      </div>
    </div>
  );
};

export default Reader;
