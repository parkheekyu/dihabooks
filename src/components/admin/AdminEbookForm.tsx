import { useRef, useState } from "react";
import { ArrowLeft, ImagePlus, Plus, X, Upload, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import RichTextEditor, { type RichTextEditorHandle } from "@/components/RichTextEditor";
import PageResourceFields, { type ResourceLink, type ResourceFile } from "@/components/PageResourceFields";
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
  /** 업로드된 전자책 원고 파일명. */
  pdfName: string;
  description: string;
  toc: { chapter: string; subtopics: string[] }[];
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
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [toc, setToc] = useState([{ chapter: "", subtopics: "" }]);
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

  const pickPdf = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      return toast.error("PDF 파일만 업로드할 수 있습니다.");
    }
    setPdfFile(file);
  };

  const updateToc = (i: number, key: "chapter" | "subtopics", v: string) =>
    setToc((prev) => prev.map((row, idx) => (idx === i ? { ...row, [key]: v } : row)));

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
    if (!pdfFile) return toast.error("전자책 PDF 파일을 업로드해주세요.");
    if (links.some((l) => !l.label.trim() || !l.url.trim())) {
      return toast.error("링크는 이름과 주소를 입력해주세요.");
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
      pdfName: pdfFile.name,
      description,
      toc: toc
        .filter((r) => r.chapter.trim())
        .map((r) => ({
          chapter: r.chapter.trim(),
          subtopics: r.subtopics.split("\n").map((s) => s.trim()).filter(Boolean),
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

      {/* 전자책 파일 */}
      <section className="rounded-xl border border-border p-4 tablet:p-5">
        <h3 className="text-sm font-semibold mb-1">전자책 파일 <span className="text-destructive">*</span></h3>
        <p className="text-xs text-muted-foreground mb-3">구매자가 뷰어에서 읽게 될 원고입니다. PDF만 업로드할 수 있습니다.</p>

        {pdfFile ? (
          <div className="flex items-center gap-3 rounded-xl border border-border bg-secondary/30 p-3">
            <FileText className="h-8 w-8 text-primary shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{pdfFile.name}</p>
              <p className="text-xs text-muted-foreground">{(pdfFile.size / 1024 / 1024).toFixed(1)} MB</p>
            </div>
            <button onClick={() => setPdfFile(null)} className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center h-28 rounded-xl border-2 border-dashed border-border hover:border-primary/50 cursor-pointer transition-colors">
            <Upload className="h-6 w-6 text-muted-foreground mb-1" />
            <span className="text-sm text-muted-foreground">클릭해서 PDF 파일 선택</span>
            <input type="file" accept="application/pdf,.pdf" onChange={pickPdf} className="hidden" />
          </label>
        )}
      </section>

      {/* 상세 설명 */}
      <section className="rounded-xl border border-border p-4 tablet:p-5">
        <h3 className="text-sm font-semibold mb-1">상세 설명 <span className="text-destructive">*</span></h3>
        <p className="text-xs text-muted-foreground mb-3">상품 상세 페이지의 &lsquo;상세 설명&rsquo; 영역에 들어갑니다.</p>
        <RichTextEditor ref={editorRef} minHeight="240px" placeholder="상품 소개를 작성해주세요. 이미지도 넣을 수 있습니다." />
      </section>

      {/* 목차 */}
      <section className="rounded-xl border border-border p-4 tablet:p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold">목차</h3>
            <p className="text-xs text-muted-foreground mt-0.5">상세 페이지 &lsquo;전체목차&rsquo;에 표시됩니다.</p>
          </div>
          <Button variant="outline" size="sm" className="text-xs gap-1"
            onClick={() => setToc((p) => [...p, { chapter: "", subtopics: "" }])}>
            <Plus className="h-3 w-3" /> 챕터 추가
          </Button>
        </div>

        {/* 자동 생성은 미구현. PDF 북마크(outline)를 읽어 채우는 방식으로 붙일 예정. */}
        <p className="rounded-lg bg-secondary/60 px-3 py-2.5 text-xs text-muted-foreground">
          PDF를 첨부하면 목차가 자동 생성됩니다. 자동 생성된 목차는 아래에서 수정할 수 있습니다.
        </p>

        {toc.map((row, i) => (
          <div key={i} className="rounded-lg border border-border p-3 space-y-2">
            <div className="flex items-center gap-2">
              <Input value={row.chapter} onChange={(e) => updateToc(i, "chapter", e.target.value)}
                placeholder={`챕터 ${i + 1} 제목`} className="text-sm" />
              {toc.length > 1 && (
                <button onClick={() => setToc((p) => p.filter((_, idx) => idx !== i))}
                  className="p-1.5 rounded-md hover:bg-secondary shrink-0">
                  <X className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              )}
            </div>
            <textarea
              value={row.subtopics}
              onChange={(e) => updateToc(i, "subtopics", e.target.value)}
              placeholder="소제목을 한 줄에 하나씩 입력"
              className="w-full min-h-[72px] rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        ))}
      </section>

      <PageResourceFields
        links={links}
        files={files}
        onLinksChange={setLinks}
        onFilesChange={setFiles}
      />

      <div className="flex items-center justify-end gap-2 pb-4">
        <Button variant="outline" size="sm" onClick={onCancel}>취소</Button>
        <Button size="sm" onClick={submit}>등록</Button>
      </div>
    </div>
  );
};

export default AdminEbookForm;
