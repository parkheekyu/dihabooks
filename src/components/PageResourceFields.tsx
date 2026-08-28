import { useRef } from "react";
import { Plus, X, Link2, FileText, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/** 뷰어 우측 '링크 · 자료' 패널에 그대로 노출되는 값. page 기준으로 묶인다. */
export type ResourceLink = { page: string; label: string; url: string };
export type ResourceFile = { page: string; name: string; size: string };

interface Props {
  links: ResourceLink[];
  files: ResourceFile[];
  onLinksChange: (v: ResourceLink[]) => void;
  onFilesChange: (v: ResourceFile[]) => void;
  /** 이미 테두리가 있는 영역 안에 넣을 때는 false로 둬 테두리가 겹치지 않게 한다. */
  framed?: boolean;
}

const formatFileSize = (bytes: number) =>
  bytes >= 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;

const pageInput = "w-16 shrink-0 text-sm text-center";

/**
 * 페이지별 링크·첨부 자료 입력. 등록 폼과 수정 폼이 같은 규격을 쓰도록
 * 한 곳에 모아 두었다. 여기서 넣은 값이 뷰어 오른쪽 탭에 그대로 뜬다.
 */
const PageResourceFields = ({ links, files, onLinksChange, onFilesChange, framed = true }: Props) => {
  const fileRef = useRef<HTMLInputElement>(null);

  const setLink = (i: number, key: keyof ResourceLink, v: string) =>
    onLinksChange(links.map((l, idx) => (idx === i ? { ...l, [key]: v } : l)));
  const setFilePage = (i: number, v: string) =>
    onFilesChange(files.map((f, idx) => (idx === i ? { ...f, page: v } : f)));

  // 업로드 백엔드가 없어 파일명과 용량만 받아 둔다. 실제 연동 시 여기서 업로드하고
  // 내려받을 주소를 함께 저장해야 한다.
  const addFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? []);
    if (!picked.length) return;
    onFilesChange([
      ...files,
      ...picked.map((f) => ({ page: "", name: f.name, size: formatFileSize(f.size) })),
    ]);
    e.target.value = "";
  };

  return (
    <section className={framed ? "rounded-xl border border-border p-4 tablet:p-5 space-y-4" : "space-y-4"}>
      <div>
        {framed && <h3 className="text-sm font-semibold">페이지별 링크 · 자료</h3>}
        <p className="text-xs text-muted-foreground mt-0.5">
          뷰어 오른쪽 &lsquo;링크 · 자료&rsquo; 탭에 표시됩니다. 페이지 번호를 적으면 그 페이지를 볼 때만 나옵니다.
        </p>
      </div>

      {/* 링크 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <Link2 className="h-3.5 w-3.5" /> 링크
          </p>
          <Button
            variant="outline" size="sm" className="text-xs gap-1"
            onClick={() => onLinksChange([...links, { page: "", label: "", url: "" }])}
          >
            <Plus className="h-3 w-3" /> 링크 추가
          </Button>
        </div>

        {links.length === 0 ? (
          <p className="rounded-lg bg-secondary/60 px-3 py-2.5 text-xs text-muted-foreground">
            등록된 링크가 없습니다.
          </p>
        ) : (
          links.map((l, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input
                value={l.page}
                onChange={(e) => setLink(i, "page", e.target.value.replace(/[^0-9]/g, ""))}
                placeholder="쪽"
                inputMode="numeric"
                aria-label="페이지 번호"
                className={pageInput}
              />
              <Input
                value={l.label}
                onChange={(e) => setLink(i, "label", e.target.value)}
                placeholder="표시할 이름"
                className="text-sm flex-1 min-w-0"
              />
              <Input
                value={l.url}
                onChange={(e) => setLink(i, "url", e.target.value)}
                placeholder="https://"
                type="url"
                className="text-sm flex-1 min-w-0"
              />
              <button
                onClick={() => onLinksChange(links.filter((_, idx) => idx !== i))}
                aria-label="링크 삭제"
                className="p-1.5 rounded-md hover:bg-secondary shrink-0"
              >
                <X className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* 첨부 자료 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <FileText className="h-3.5 w-3.5" /> 첨부 자료
          </p>
          <input
            ref={fileRef}
            type="file"
            multiple
            onChange={addFiles}
            className="hidden"
          />
          <Button variant="outline" size="sm" className="text-xs gap-1" onClick={() => fileRef.current?.click()}>
            <Upload className="h-3 w-3" /> 파일 추가
          </Button>
        </div>

        {files.length === 0 ? (
          <p className="rounded-lg bg-secondary/60 px-3 py-2.5 text-xs text-muted-foreground">
            첨부된 자료가 없습니다. 구매자가 뷰어에서 내려받을 수 있습니다.
          </p>
        ) : (
          files.map((f, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input
                value={f.page}
                onChange={(e) => setFilePage(i, e.target.value.replace(/[^0-9]/g, ""))}
                placeholder="쪽"
                inputMode="numeric"
                aria-label="페이지 번호"
                className={pageInput}
              />
              <div className="flex flex-1 min-w-0 items-center gap-2 rounded-md border border-input px-3 h-10">
                <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="text-sm truncate">{f.name}</span>
                <span className="text-xs text-muted-foreground shrink-0 ml-auto">{f.size}</span>
              </div>
              <button
                onClick={() => onFilesChange(files.filter((_, idx) => idx !== i))}
                aria-label="첨부 삭제"
                className="p-1.5 rounded-md hover:bg-secondary shrink-0"
              >
                <X className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default PageResourceFields;
