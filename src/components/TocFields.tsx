import { Plus, X, ListTree } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import VersionTabs, { type VersionTab } from "@/components/VersionTabs";
import { countMissingPages } from "@/lib/ebookVersions";

/**
 * 목차 구조(챕터·소제목·미리보기)는 판본끼리 같고 쪽수만 다르다.
 * 그래서 구조는 한 벌만 두고, 쪽수는 판본 id별로 따로 담는다.
 */
export type TocSub = { title: string; pages: Record<string, string>; preview: boolean };
export type TocChapter = { chapter: string; subtopics: TocSub[] };

const emptySub = (): TocSub => ({ title: "", pages: {}, preview: false });
const emptyChapter = (): TocChapter => ({ chapter: "", subtopics: [emptySub()] });

interface Props {
  value: TocChapter[];
  onChange: (v: TocChapter[]) => void;
  versions: VersionTab[];
  /** 지금 쪽수를 편집 중인 판본. 제출 때 빈 판본으로 옮길 수 있게 바깥에서 쥔다. */
  activeVersion: string;
  onActiveVersionChange: (id: string) => void;
  framed?: boolean;
  /** 해당 판본 PDF의 북마크에서 쪽수를 읽어 채운다. */
  onImportOutline?: (versionId: string) => void;
}

const numeric = (v: string) => v.replace(/[^0-9]/g, "");

/**
 * 목차 편집기. 애드민 상품 등록과 작가 전자책 등록이 같은 규격을 쓴다.
 * 제목과 미리보기는 모든 판본에 함께 적용되고, 쪽수만 탭에서 고른 판본에 저장된다.
 */
const TocFields = ({
  value, onChange, versions, activeVersion, onActiveVersionChange, framed = true, onImportOutline,
}: Props) => {
  const active = versions.some((v) => v.id === activeVersion) ? activeVersion : versions[0]?.id ?? "";
  const activeLabel = versions.find((v) => v.id === active)?.label.trim() || "기본";

  const setChapter = (ci: number, chapter: string) =>
    onChange(value.map((row, i) => (i === ci ? { ...row, chapter } : row)));

  const updateSub = (ci: number, si: number, fn: (s: TocSub) => TocSub) =>
    onChange(
      value.map((row, i) =>
        i === ci ? { ...row, subtopics: row.subtopics.map((sub, j) => (j === si ? fn(sub) : sub)) } : row
      )
    );

  const addSub = (ci: number) =>
    onChange(value.map((row, i) => (i === ci ? { ...row, subtopics: [...row.subtopics, emptySub()] } : row)));

  const removeSub = (ci: number, si: number) =>
    onChange(value.map((row, i) => (i === ci ? { ...row, subtopics: row.subtopics.filter((_, j) => j !== si) } : row)));

  // 끝 쪽은 같은 판본에서 뒤에 오는 첫 번째 시작 쪽 직전. 마지막은 끝까지로 본다.
  const rangeLabel = (ci: number, si: number) => {
    const flat = value.flatMap((row, i) => row.subtopics.map((sub, j) => ({ i, j, page: sub.pages[active] })));
    const at = flat.findIndex((x) => x.i === ci && x.j === si);
    const start = flat[at]?.page;
    if (!start) return "";
    const next = flat.slice(at + 1).find((x) => x.page);
    if (!next) return "~ 끝";
    const end = Number(next.page) - 1;
    return end < Number(start) ? "~ ?" : `~ ${end}쪽`;
  };

  const missing = Object.fromEntries(versions.map((v) => [v.id, countMissingPages(value, v.id)]));

  return (
    <section className={framed ? "rounded-xl border border-border p-4 tablet:p-5 space-y-3" : "space-y-3"}>
      <div className="flex items-start justify-between gap-3">
        <div>
          {framed && <h3 className="text-sm font-semibold">목차</h3>}
          <p className="text-xs text-muted-foreground mt-0.5">
            상세 페이지 &lsquo;전체목차&rsquo;에 표시됩니다. 소제목마다 시작 쪽만 넣으면 끝 쪽은 자동으로 잡힙니다.
          </p>
        </div>
        <Button
          variant="outline" size="sm" className="text-xs gap-1 shrink-0"
          onClick={() => onChange([...value, emptyChapter()])}
        >
          <Plus className="h-3 w-3" /> 챕터 추가
        </Button>
      </div>

      {/* 판본 탭 — 쪽수만 판본별로 바뀐다. */}
      <VersionTabs versions={versions} active={active} onChange={onActiveVersionChange} missing={missing} />

      <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-secondary/60 px-3 py-2.5">
        <p className="text-xs text-muted-foreground">
          {versions.length > 1 ? (
            <>
              지금 <span className="font-semibold text-foreground">&lsquo;{activeLabel}&rsquo;</span> 판본의 쪽수를 편집 중입니다.
              제목과 미리보기는 모든 판본에 함께 적용됩니다.
            </>
          ) : (
            <>판본 PDF를 올린 뒤 불러오면 북마크에서 소제목별 시작 쪽을 읽어옵니다.</>
          )}
        </p>
        {onImportOutline && (
          <Button variant="outline" size="sm" className="text-xs gap-1 bg-background" onClick={() => onImportOutline(active)}>
            <ListTree className="h-3 w-3" /> &lsquo;{activeLabel}&rsquo; PDF 목차 불러오기
          </Button>
        )}
      </div>

      {value.map((row, i) => (
        <div key={i} className="rounded-lg border border-border p-3 space-y-2">
          <div className="flex items-center gap-2">
            <Input
              value={row.chapter}
              onChange={(e) => setChapter(i, e.target.value)}
              placeholder={`챕터 ${i + 1} 제목`}
              className="text-sm"
            />
            {value.length > 1 && (
              <button
                onClick={() => onChange(value.filter((_, idx) => idx !== i))}
                aria-label="챕터 삭제"
                className="p-1.5 rounded-md hover:bg-secondary shrink-0"
              >
                <X className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            )}
          </div>

          <div className="space-y-2 pt-1">
            {row.subtopics.map((sub, j) => {
              const page = sub.pages[active] ?? "";
              // 제목은 있는데 이 판본 쪽수만 비었으면 눈에 띄게 한다.
              const needsPage = !!sub.title.trim() && !page;
              return (
                <div key={j} className="flex items-center gap-2">
                  <Input
                    value={page}
                    inputMode="numeric"
                    aria-label={`${activeLabel} 시작 쪽`}
                    onChange={(e) =>
                      updateSub(i, j, (s) => ({ ...s, pages: { ...s.pages, [active]: numeric(e.target.value) } }))
                    }
                    placeholder="쪽"
                    className={`w-[68px] shrink-0 text-sm text-center ${
                      needsPage ? "border-amber-400 bg-amber-50 focus-visible:ring-amber-400" : ""
                    }`}
                  />
                  <Input
                    value={sub.title}
                    onChange={(e) => updateSub(i, j, (s) => ({ ...s, title: e.target.value }))}
                    placeholder={`소제목 ${j + 1}`}
                    className="text-sm flex-1 min-w-0"
                  />
                  <span
                    className={`w-20 shrink-0 text-right text-xs tabular-nums ${
                      needsPage ? "text-amber-600" : "text-muted-foreground"
                    }`}
                  >
                    {needsPage ? "쪽수 필요" : rangeLabel(i, j)}
                  </span>
                  <label className="flex items-center gap-1.5 text-xs cursor-pointer select-none shrink-0">
                    <input
                      type="checkbox"
                      checked={sub.preview}
                      onChange={(e) => updateSub(i, j, (s) => ({ ...s, preview: e.target.checked }))}
                      className="h-3.5 w-3.5 accent-primary"
                    />
                    미리보기
                  </label>
                  {row.subtopics.length > 1 && (
                    <button
                      onClick={() => removeSub(i, j)}
                      aria-label="소제목 삭제"
                      className="p-1.5 rounded-md hover:bg-secondary shrink-0"
                    >
                      <X className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                  )}
                </div>
              );
            })}
            <Button variant="outline" size="sm" className="text-xs gap-1" onClick={() => addSub(i)}>
              <Plus className="h-3 w-3" /> 소제목 추가
            </Button>
          </div>
        </div>
      ))}
    </section>
  );
};

export default TocFields;
