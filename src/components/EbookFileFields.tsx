import { Upload, FileText, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/**
 * 같은 원고를 글자 크기만 다르게 만든 판본. 독자가 뷰어에서 골라 읽는다.
 * base는 목차·미리보기·링크 자료의 쪽수 기준이 되는 판본이며 하나만 지정한다.
 */
export type EbookVersion = {
  label: string;
  fileName: string;
  size: string;
  base: boolean;
};

const newVersion = (label = ""): EbookVersion => ({
  label,
  fileName: "",
  size: "",
  base: false,
});

const formatMb = (bytes: number) =>
  bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;

interface Props {
  value: EbookVersion[];
  onChange: (v: EbookVersion[]) => void;
  framed?: boolean;
}

const EbookFileFields = ({ value, onChange, framed = true }: Props) => {
  const setAt = (i: number, patch: Partial<EbookVersion>) =>
    onChange(value.map((v, idx) => (idx === i ? { ...v, ...patch } : v)));

  // 기준은 하나만. 다른 것을 고르면 기존 기준은 해제된다.
  const setBase = (i: number) =>
    onChange(value.map((v, idx) => ({ ...v, base: idx === i })));

  const pick = (i: number, file?: File) => {
    if (!file) return;
    if (!/\.pdf$/i.test(file.name)) return;
    setAt(i, { fileName: file.name, size: formatMb(file.size) });
  };

  return (
    <section className={framed ? "rounded-xl border border-border p-4 tablet:p-5 space-y-3" : "space-y-3"}>
      <div className="flex items-start justify-between gap-3">
        <div>
          {framed && (
            <h3 className="text-sm font-semibold">전자책 파일 <span className="text-destructive">*</span></h3>
          )}
          <p className="text-xs text-muted-foreground mt-0.5">
            글자 크기가 다른 판본을 여러 개 올리면 독자가 뷰어에서 골라 읽습니다. PDF만 올릴 수 있습니다.
            목차·미리보기·링크 자료의 쪽수는 <span className="font-semibold">기준</span>으로 지정한 판본을 따릅니다.
          </p>
        </div>
        <Button
          variant="outline" size="sm" className="text-xs gap-1 shrink-0"
          onClick={() => onChange([...value, newVersion()])}
        >
          <Plus className="h-3 w-3" /> 판본 추가
        </Button>
      </div>

      {value.map((v, i) => (
        <div key={i} className="rounded-lg border border-border p-3 space-y-2">
          <div className="flex items-center gap-2">
            <Input
              value={v.label}
              onChange={(e) => setAt(i, { label: e.target.value })}
              placeholder={i === 0 ? "기본" : "예: 큰글씨"}
              aria-label="판본 이름"
              className="text-sm flex-1 min-w-0"
            />
            <label className="flex items-center gap-1.5 text-xs cursor-pointer select-none shrink-0">
              <input
                type="radio"
                name="ebook-base-version"
                checked={v.base}
                onChange={() => setBase(i)}
                className="h-3.5 w-3.5 accent-primary"
              />
              기준
            </label>
            {value.length > 1 && (
              <button
                onClick={() => onChange(value.filter((_, idx) => idx !== i))}
                aria-label="판본 삭제"
                className="p-1.5 rounded-md hover:bg-secondary shrink-0"
              >
                <X className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            )}
          </div>

          {v.fileName ? (
            <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary/30 p-2.5">
              <FileText className="h-6 w-6 text-primary shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{v.fileName}</p>
                <p className="text-xs text-muted-foreground">{v.size}</p>
              </div>
              <button
                onClick={() => setAt(i, { fileName: "", size: "" })}
                aria-label="파일 제거"
                className="p-1.5 rounded-md hover:bg-secondary shrink-0"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center h-20 rounded-lg border-2 border-dashed border-border hover:border-primary/50 cursor-pointer transition-colors">
              <Upload className="h-5 w-5 text-muted-foreground mb-1" />
              <span className="text-xs text-muted-foreground">클릭해서 PDF 파일 선택</span>
              <input
                type="file"
                accept="application/pdf,.pdf"
                onChange={(e) => { pick(i, e.target.files?.[0]); e.target.value = ""; }}
                className="hidden"
              />
            </label>
          )}
        </div>
      ))}
    </section>
  );
};

export default EbookFileFields;
