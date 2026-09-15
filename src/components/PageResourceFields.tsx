import { useRef } from "react";
import { Plus, X, Link2, FileText, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import VersionTabs, { type VersionTab } from "@/components/VersionTabs";
import { countMissingResourcePages } from "@/lib/ebookVersions";

/**
 * 뷰어 우측 '링크 · 자료' 패널에 노출되는 값. 판본마다 쪽이 달라지므로
 * 쪽수는 판본 id별로 담는다. 모든 판본에서 비워 두면 전체 페이지에 표시된다.
 */
export type ResourceLink = { pages: Record<string, string>; label: string; url: string };
export type ResourceFile = { pages: Record<string, string>; name: string; size: string };

type Paged = { pages: Record<string, string> };

interface Props {
  links: ResourceLink[];
  files: ResourceFile[];
  onLinksChange: (v: ResourceLink[]) => void;
  onFilesChange: (v: ResourceFile[]) => void;
  versions: VersionTab[];
  activeVersion: string;
  onActiveVersionChange: (id: string) => void;
  /** 이미 테두리가 있는 영역 안에 넣을 때는 false로 둬 테두리가 겹치지 않게 한다. */
  framed?: boolean;
}

const formatFileSize = (bytes: number) =>
  bytes >= 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;

const numeric = (v: string) => v.replace(/[^0-9]/g, "");

/**
 * 페이지별 링크·첨부 자료 입력. 목차와 같은 판본 탭을 쓰며, 이름·주소·파일은
 * 모든 판본에 공통이고 쪽수만 고른 판본에 저장된다.
 */
const PageResourceFields = ({
  links, files, onLinksChange, onFilesChange, versions, activeVersion, onActiveVersionChange, framed = true,
}: Props) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const ids = versions.map((v) => v.id);
  const active = ids.includes(activeVersion) ? activeVersion : ids[0] ?? "";
  const activeLabel = versions.find((v) => v.id === active)?.label.trim() || "기본";

  const setLink = (i: number, patch: Partial<ResourceLink>) =>
    onLinksChange(links.map((l, idx) => (idx === i ? { ...l, ...patch } : l)));
  const setLinkPage = (i: number, v: string) =>
    onLinksChange(links.map((l, idx) => (idx === i ? { ...l, pages: { ...l.pages, [active]: v } } : l)));
  const setFilePage = (i: number, v: string) =>
    onFilesChange(files.map((f, idx) => (idx === i ? { ...f, pages: { ...f.pages, [active]: v } } : f)));

  // 업로드 백엔드가 없어 파일명과 용량만 받아 둔다. 실제 연동 시 여기서 업로드하고
  // 내려받을 주소를 함께 저장해야 한다.
  const addFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? []);
    if (!picked.length) return;
    onFilesChange([...files, ...picked.map((f) => ({ pages: {}, name: f.name, size: formatFileSize(f.size) }))]);
    e.target.value = "";
  };

  const missing = Object.fromEntries(
    ids.map((id) => [id, countMissingResourcePages([...links, ...files], ids, id)])
  );

  // 쪽 칸 하나. 다른 판본엔 넣고 이 판본만 비었으면 표시하고, 전부 비었으면 '전체'로 보여준다.
  const pageField = (item: Paged, onChange: (v: string) => void) => {
    const value = item.pages[active] ?? "";
    const anySet = ids.some((id) => item.pages[id]);
    const needsPage = anySet && !value;
    return (
      <Input
        value={value}
        onChange={(e) => onChange(numeric(e.target.value))}
        placeholder={anySet ? "쪽수" : "전체"}
        inputMode="numeric"
        aria-label={`${activeLabel} 쪽수 (모든 판본에서 비우면 전체)`}
        title={needsPage ? "다른 판본에는 쪽수가 있습니다. 이 판본 쪽수도 넣어주세요." : "모든 판본에서 비워두면 전체 페이지에 표시됩니다"}
        className={`w-[68px] shrink-0 text-sm text-center ${
          needsPage ? "border-amber-400 bg-amber-50 focus-visible:ring-amber-400" : ""
        }`}
      />
    );
  };

  return (
    <section className={framed ? "rounded-xl border border-border p-4 tablet:p-5 space-y-4" : "space-y-4"}>
      <div className="space-y-3">
        <div>
          {framed && <h3 className="text-sm font-semibold">페이지별 링크 · 자료</h3>}
          <p className="text-xs text-muted-foreground mt-0.5">
            뷰어 오른쪽 &lsquo;링크 · 자료&rsquo; 탭에 표시됩니다. 쪽수를 적으면 그 페이지에서만 보이고,
            모든 판본에서 비워두면 전체 페이지에 표시됩니다.
          </p>
        </div>
        <VersionTabs versions={versions} active={active} onChange={onActiveVersionChange} missing={missing} />
        {versions.length > 1 && (
          <p className="rounded-lg bg-secondary/60 px-3 py-2.5 text-xs text-muted-foreground">
            지금 <span className="font-semibold text-foreground">&lsquo;{activeLabel}&rsquo;</span> 판본의 쪽수를 편집 중입니다.
            이름·주소·파일은 모든 판본에 함께 적용됩니다.
          </p>
        )}
      </div>

      {/* 링크 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <Link2 className="h-3.5 w-3.5" /> 링크
          </p>
          <Button
            variant="outline" size="sm" className="text-xs gap-1"
            onClick={() => onLinksChange([...links, { pages: {}, label: "", url: "" }])}
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
              {pageField(l, (v) => setLinkPage(i, v))}
              <Input
                value={l.label}
                onChange={(e) => setLink(i, { label: e.target.value })}
                placeholder="표시할 이름"
                className="text-sm flex-1 min-w-0"
              />
              <Input
                value={l.url}
                onChange={(e) => setLink(i, { url: e.target.value })}
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
          <input ref={fileRef} type="file" multiple onChange={addFiles} className="hidden" />
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
              {pageField(f, (v) => setFilePage(i, v))}
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
