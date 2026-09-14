import { Plus, X, ListTree } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type TocSub = { title: string; page: string; preview: boolean };
export type TocChapter = { chapter: string; subtopics: TocSub[] };

const emptyChapter = (): TocChapter => ({
  chapter: "",
  subtopics: [{ title: "", page: "", preview: false }],
});

interface Props {
  value: TocChapter[];
  onChange: (v: TocChapter[]) => void;
  /** 전체 페이지 수. 마지막 소제목의 끝 쪽을 잡는 데 쓴다. */
  pageCount?: string;
  framed?: boolean;
  /** 기준 판본 PDF의 북마크에서 목차를 읽어 채운다. 파일이 없으면 넘기지 않는다. */
  onImportOutline?: () => void;
}

const numeric = (v: string) => v.replace(/[^0-9]/g, "");

/**
 * 목차 편집기. 애드민 상품 등록과 작가 전자책 등록이 같은 규격을 쓰도록 한곳에 뒀다.
 * 소제목마다 시작 쪽만 받고 끝 쪽은 다음 소제목 직전으로 계산해 보여준다.
 */
const TocFields = ({ value, onChange, pageCount, framed = true, onImportOutline }: Props) => {
  const setChapter = (ci: number, chapter: string) =>
    onChange(value.map((row, i) => (i === ci ? { ...row, chapter } : row)));

  const setSub = (ci: number, si: number, patch: Partial<TocSub>) =>
    onChange(
      value.map((row, i) =>
        i === ci
          ? { ...row, subtopics: row.subtopics.map((sub, j) => (j === si ? { ...sub, ...patch } : sub)) }
          : row
      )
    );

  const addSub = (ci: number) =>
    onChange(
      value.map((row, i) =>
        i === ci ? { ...row, subtopics: [...row.subtopics, { title: "", page: "", preview: false }] } : row
      )
    );

  const removeSub = (ci: number, si: number) =>
    onChange(
      value.map((row, i) => (i === ci ? { ...row, subtopics: row.subtopics.filter((_, j) => j !== si) } : row))
    );

  // 끝 쪽은 뒤에 오는 첫 번째 시작 쪽에서 1을 뺀 값. 마지막은 전체 쪽수까지.
  const rangeLabel = (ci: number, si: number) => {
    const flat = value.flatMap((row, i) => row.subtopics.map((sub, j) => ({ i, j, page: sub.page })));
    const at = flat.findIndex((x) => x.i === ci && x.j === si);
    const start = flat[at]?.page;
    if (!start) return "";
    const next = flat.slice(at + 1).find((x) => x.page);
    const end = next ? Number(next.page) - 1 : pageCount ? Number(pageCount) : null;
    // 전체 쪽수를 모르면 마지막 항목은 끝까지로 본다.
    if (end === null) return "~ 끝";
    if (end < Number(start)) return "~ ?";
    return `~ ${end}쪽`;
  };

  return (
    <section className={framed ? "rounded-xl border border-border p-4 tablet:p-5 space-y-3" : "space-y-3"}>
      <div className="flex items-center justify-between">
        <div>
          {framed && <h3 className="text-sm font-semibold">목차</h3>}
          <p className="text-xs text-muted-foreground mt-0.5">
            상세 페이지 &lsquo;전체목차&rsquo;에 표시됩니다. 소제목마다 시작 쪽만 넣으면 끝 쪽은 자동으로 잡힙니다.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {onImportOutline && (
            <Button variant="outline" size="sm" className="text-xs gap-1" onClick={onImportOutline}>
              <ListTree className="h-3 w-3" /> PDF 목차 불러오기
            </Button>
          )}
          <Button
            variant="outline" size="sm" className="text-xs gap-1"
            onClick={() => onChange([...value, emptyChapter()])}
          >
            <Plus className="h-3 w-3" /> 챕터 추가
          </Button>
        </div>
      </div>

      {/* 실제 구현은 기준 판본 PDF의 북마크(outline)를 읽어 챕터·소제목·시작 쪽을 채운다.
          여기서는 데모라 표본 값을 넣는다. */}
      <p className="rounded-lg bg-secondary/60 px-3 py-2.5 text-xs text-muted-foreground">
        기준 판본 PDF를 올린 뒤 &lsquo;PDF 목차 불러오기&rsquo;를 누르면 북마크에서 목차와 시작 쪽을 읽어옵니다.
        불러온 목차는 아래에서 수정할 수 있습니다.
      </p>

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

          {/* 소제목 — 체크한 항목만 상세 페이지 목차에 미리보기 버튼이 붙는다. */}
          <div className="space-y-2 pt-1">
            {row.subtopics.map((sub, j) => (
              <div key={j} className="flex items-center gap-2">
                <Input
                  value={sub.page}
                  inputMode="numeric"
                  aria-label="시작 쪽"
                  onChange={(e) => setSub(i, j, { page: numeric(e.target.value) })}
                  placeholder="쪽"
                  className="w-[68px] shrink-0 text-sm text-center"
                />
                <Input
                  value={sub.title}
                  onChange={(e) => setSub(i, j, { title: e.target.value })}
                  placeholder={`소제목 ${j + 1}`}
                  className="text-sm flex-1 min-w-0"
                />
                <span className="w-16 shrink-0 text-right text-xs text-muted-foreground tabular-nums">
                  {rangeLabel(i, j)}
                </span>
                <label className="flex items-center gap-1.5 text-xs cursor-pointer select-none shrink-0">
                  <input
                    type="checkbox"
                    checked={sub.preview}
                    onChange={(e) => setSub(i, j, { preview: e.target.checked })}
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
            ))}
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
