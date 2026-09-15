import { useRef, useState } from "react";
import { ArrowLeft, ImagePlus, Upload, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import RichTextEditor, { type RichTextEditorHandle } from "@/components/RichTextEditor";
import PageResourceFields, { type ResourceLink, type ResourceFile } from "@/components/PageResourceFields";
import TocFields, { type TocChapter } from "@/components/TocFields";
import { applyOutline, findVersionProblem } from "@/lib/ebookVersions";
import EbookFileFields, { type EbookVersion } from "@/components/EbookFileFields";
import { categories } from "@/data/mockData";
import { toast } from "sonner";

export interface NewEbook {
  title: string;
  author: string;
  category: string;
  price: number;
  originalPrice?: number;
  badge?: "BEST" | "NEW" | "TOP";
  pageCount?: number;
  image: string;
  /** 글자 크기별 판본. base로 지정한 판본이 쪽수 기준이 된다. */
  versions: EbookVersion[];
  description: string;
  /**
   * 목차 구조는 한 벌, 시작 쪽은 판본 id별. 끝 쪽은 같은 판본의 다음 소제목 직전으로 본다.
   * preview를 켠 소제목은 본문 앞 30%까지 무료로 공개된다.
   */
  toc: {
    chapter: string;
    subtopics: { title: string; pages: Record<string, number>; preview: boolean }[];
  }[];
  /** 뷰어 오른쪽 '링크 · 자료' 탭에 페이지별로 노출된다. */
  links: ResourceLink[];
  files: ResourceFile[];
}

interface Props {
  onCancel: () => void;
  onSubmit: (book: NewEbook) => void;
}

const fieldLabel = "text-xs font-semibold";
const selectClass =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

/** 상품 페이지에 노출되는 값을 한 화면에서 모두 입력받는 등록 폼. */
const AdminEbookForm = ({ onCancel, onSubmit }: Props) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [badge, setBadge] = useState("");
  const [pageCount, setPageCount] = useState("");
  const [thumb, setThumb] = useState("");
  const [versions, setVersions] = useState<EbookVersion[]>([{ id: "base", label: "기본", fileName: "", size: "", base: true }]);
  const [toc, setToc] = useState<TocChapter[]>([{ chapter: "", subtopics: [{ title: "", pages: {}, preview: false }] }]);
  // 목차와 링크·자료가 같은 판본 탭을 보도록 한곳에서 쥔다.
  const [activeVersion, setActiveVersion] = useState("base");
  const [links, setLinks] = useState<ResourceLink[]>([]);
  const [files, setFiles] = useState<ResourceFile[]>([]);

  const editorRef = useRef<RichTextEditorHandle>(null);
  const thumbInputRef = useRef<HTMLInputElement>(null);

  const numeric = (v: string) => v.replace(/[^0-9]/g, "");
  const discount =
    originalPrice && price && Number(originalPrice) > Number(price)
      ? Math.round((1 - Number(price) / Number(originalPrice)) * 100)
      : null;

  const pickThumb = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (thumb.startsWith("blob:")) URL.revokeObjectURL(thumb);
    setThumb(URL.createObjectURL(file));
  };

  /** 고른 판본 PDF의 북마크에서 소제목별 시작 쪽을 읽어 채운다. 파싱은 서버 몫. */
  const importOutline = (versionId: string) => {
    const idx = versions.findIndex((v) => v.id === versionId);
    const v = versions[idx];
    if (!v?.fileName) return toast.error(`'${v?.label.trim() || "이"}' 판본 PDF를 먼저 올려주세요.`);
    setToc((prev) => applyOutline(prev, versionId, idx));
    toast.success(`'${v.label.trim() || `판본 ${idx + 1}`}' PDF 북마크에서 시작 쪽을 불러왔습니다.`);
  };

  const submit = () => {
    if (!thumb) return toast.error("썸네일 이미지를 선택해주세요.");
    if (!title.trim()) return toast.error("상품명을 입력해주세요.");
    if (!author.trim()) return toast.error("작가명을 입력해주세요.");
    if (!category) return toast.error("카테고리를 선택해주세요.");
    if (price === "") return toast.error("판매가를 입력해주세요.");
    if (originalPrice && Number(originalPrice) < Number(price)) {
      return toast.error("정가는 판매가보다 낮을 수 없습니다.");
    }
    const description = editorRef.current?.getHTML() ?? "";
    if (!description.replace(/<[^>]*>/g, "").trim()) {
      return toast.error("상세 설명을 입력해주세요.");
    }
    if (versions.some((v) => !v.label.trim())) {
      return toast.error("판본 이름을 입력해주세요.");
    }
    if (versions.some((v) => !v.fileName)) {
      return toast.error("판본마다 PDF 파일을 올려주세요.");
    }
    if (!versions.some((v) => v.base)) {
      return toast.error("쪽수 기준이 될 판본을 지정해주세요.");
    }
    if (links.some((l) => !l.label.trim() || !l.url.trim())) {
      return toast.error("링크는 이름과 주소를 입력해주세요.");
    }
    // 판본별 쪽수가 비었거나 순서가 어긋나면 그 판본 탭으로 옮겨 바로 고치게 한다.
    const problem = findVersionProblem(versions, toc, links, files);
    if (problem) {
      setActiveVersion(problem.versionId);
      return toast.error(problem.message);
    }

    onSubmit({
      title: title.trim(),
      author: author.trim(),
      category,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      badge: (badge || undefined) as NewEbook["badge"],
      pageCount: pageCount ? Number(pageCount) : undefined,
      image: thumb,
      versions,
      description,
      toc: toc
        .filter((r) => r.chapter.trim())
        .map((r) => ({
          chapter: r.chapter.trim(),
          subtopics: r.subtopics
            .filter((sub) => sub.title.trim())
            .map((sub) => ({
              title: sub.title.trim(),
              pages: Object.fromEntries(
                Object.entries(sub.pages).filter(([, p]) => p).map(([id, p]) => [id, Number(p)])
              ),
              preview: sub.preview,
            })),
        })),
      links,
      files,
    });
  };

  return (
    <div className="space-y-5 max-w-4xl">
      <div className="flex items-center gap-2">
        <button onClick={onCancel} className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <h2 className="text-lg font-bold">상품 등록</h2>
      </div>
      <p className="text-xs text-muted-foreground -mt-3">
        여기서 입력한 값이 스토어 카드와 상품 상세 페이지에 그대로 반영됩니다.
      </p>

      {/* 썸네일 */}
      <section className="rounded-xl border border-border p-4 tablet:p-5">
        <h3 className="text-sm font-semibold mb-3">썸네일 <span className="text-destructive">*</span></h3>
        <div className="flex items-center gap-4">
          {thumb ? (
            <img src={thumb} alt="" className="w-28 h-[158px] rounded-lg object-cover border border-border" />
          ) : (
            <div className="w-28 h-[158px] rounded-lg border border-dashed border-border flex flex-col items-center justify-center gap-1.5">
              <ImagePlus className="h-5 w-5 text-muted-foreground" />
              <span className="text-[11px] text-muted-foreground">미선택</span>
            </div>
          )}
          <div className="space-y-2">
            <input ref={thumbInputRef} type="file" accept="image/*" onChange={pickThumb} className="hidden" />
            <Button variant="outline" size="sm" className="text-xs" onClick={() => thumbInputRef.current?.click()}>
              이미지 {thumb ? "변경" : "선택"}
            </Button>
            {thumb && (
              <button
                onClick={() => { if (thumb.startsWith("blob:")) URL.revokeObjectURL(thumb); setThumb(""); }}
                className="block text-xs text-muted-foreground hover:text-destructive transition-colors"
              >
                제거
              </button>
            )}
            <p className="text-[11px] text-muted-foreground">세로형(2:3) 표지 이미지를 권장합니다.</p>
          </div>
        </div>
      </section>

      {/* 기본 정보 */}
      <section className="rounded-xl border border-border p-4 tablet:p-5 space-y-3">
        <h3 className="text-sm font-semibold">기본 정보</h3>
        <div className="grid grid-cols-1 tablet:grid-cols-2 gap-3">
          <div className="space-y-1.5 tablet:col-span-2">
            <label htmlFor="pf-title" className={fieldLabel}>상품명 <span className="text-destructive">*</span></label>
            <Input id="pf-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="전자책 제목" className="text-sm" />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="pf-author" className={fieldLabel}>작가 <span className="text-destructive">*</span></label>
            <Input id="pf-author" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="작가명" className="text-sm" />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="pf-category" className={fieldLabel}>카테고리 <span className="text-destructive">*</span></label>
            <select id="pf-category" value={category} onChange={(e) => setCategory(e.target.value)} className={selectClass}>
              <option value="">카테고리 선택</option>
              {categories.filter((c) => c.id !== "all").map((c) => (
                <option key={c.id} value={c.label}>{c.label}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="pf-badge" className={fieldLabel}>배지</label>
            <select id="pf-badge" value={badge} onChange={(e) => setBadge(e.target.value)} className={selectClass}>
              <option value="">없음</option>
              <option value="BEST">BEST</option>
              <option value="NEW">NEW</option>
              <option value="TOP">TOP</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="pf-pages" className={fieldLabel}>페이지 수</label>
            <Input id="pf-pages" inputMode="numeric" value={pageCount}
              onChange={(e) => setPageCount(numeric(e.target.value))} placeholder="168" className="text-sm" />
          </div>
        </div>
      </section>

      {/* 가격 */}
      <section className="rounded-xl border border-border p-4 tablet:p-5 space-y-3">
        <h3 className="text-sm font-semibold">가격</h3>
        <div className="grid grid-cols-1 tablet:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label htmlFor="pf-price" className={fieldLabel}>판매가 <span className="text-destructive">*</span></label>
            <Input id="pf-price" inputMode="numeric" value={price}
              onChange={(e) => setPrice(numeric(e.target.value))} placeholder="0" className="text-sm" />
            <p className="text-[11px] text-muted-foreground">0으로 두면 무료 상품으로 등록됩니다.</p>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="pf-original" className={fieldLabel}>정가 (할인 표시용)</label>
            <Input id="pf-original" inputMode="numeric" value={originalPrice}
              onChange={(e) => setOriginalPrice(numeric(e.target.value))} placeholder="비워두면 할인 표시 없음" className="text-sm" />
            {discount !== null && (
              <p className="text-[11px] text-primary">상세 페이지에 {discount}% 할인으로 표시됩니다.</p>
            )}
          </div>
        </div>
      </section>

      {/* 상세 설명 */}
      <section className="rounded-xl border border-border p-4 tablet:p-5">
        <h3 className="text-sm font-semibold mb-1">상세 설명 <span className="text-destructive">*</span></h3>
        <p className="text-xs text-muted-foreground mb-3">상품 상세 페이지의 &lsquo;상세 설명&rsquo; 영역에 들어갑니다.</p>
        <RichTextEditor ref={editorRef} minHeight="240px" placeholder="상품 소개를 작성해주세요. 이미지도 넣을 수 있습니다." />
      </section>

      <EbookFileFields value={versions} onChange={setVersions} />

      <TocFields
        value={toc}
        onChange={setToc}
        versions={versions}
        activeVersion={activeVersion}
        onActiveVersionChange={setActiveVersion}
        onImportOutline={importOutline}
      />

      <PageResourceFields
        links={links}
        files={files}
        onLinksChange={setLinks}
        onFilesChange={setFiles}
        versions={versions}
        activeVersion={activeVersion}
        onActiveVersionChange={setActiveVersion}
      />

      <div className="flex items-center justify-end gap-2 pb-4">
        <Button variant="outline" size="sm" onClick={onCancel}>취소</Button>
        <Button size="sm" onClick={submit}>등록</Button>
      </div>
    </div>
  );
};

export default AdminEbookForm;
