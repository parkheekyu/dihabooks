import { useRef, useState } from "react";
import { ArrowLeft, ImagePlus, Upload, FileText, X, Globe, Link2, Copy, Check, AlertCircle, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import RichTextEditor, { type RichTextEditorHandle } from "@/components/RichTextEditor";
import PageResourceFields, { type ResourceLink, type ResourceFile } from "@/components/PageResourceFields";
import TocFields, { type TocChapter } from "@/components/TocFields";
import { applyOutline, findVersionProblem, suggestSlug, checkSlug, SHOP_ORIGIN } from "@/lib/ebookVersions";
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
  /** 상품 주소. dihabooks.com/book/{slug} */
  slug: string;
  /**
   * public: 스토어·검색·추천에 노출.
   * unlisted(일부공개): 목록과 검색에는 안 나오고, 주소를 아는 사람만 보고 살 수 있다.
   */
  visibility: "public" | "unlisted";
}

interface Props {
  onCancel: () => void;
  onSubmit: (book: NewEbook) => void;
  /** 이미 쓰이는 상품 주소. 겹치면 등록을 막는다. */
  takenSlugs?: string[];
}

const fieldLabel = "text-xs font-semibold";
const selectClass =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

/** 상품 페이지에 노출되는 값을 한 화면에서 모두 입력받는 등록 폼. */
const AdminEbookForm = ({ onCancel, onSubmit, takenSlugs = [] }: Props) => {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [visibility, setVisibility] = useState<NewEbook["visibility"]>("public");
  const [copied, setCopied] = useState(false);
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

  const slugState = checkSlug(slug, takenSlugs);
  const shopUrl = `https://${SHOP_ORIGIN}${slug}`;

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(shopUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("복사하지 못했습니다. 주소를 직접 선택해 복사해주세요.");
    }
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
    const slugState = checkSlug(slug, takenSlugs);
    if (!slugState.ok) return toast.error(`상품 주소: ${slugState.message}`);

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
      slug,
      visibility,
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

      {/* 공개 설정 — 상품 주소와 공개 범위. 등록 직전에 확인하는 값이라 맨 아래에 둔다. */}
      <section className="rounded-xl border border-border p-4 tablet:p-5 space-y-5">
        <h3 className="text-sm font-semibold">공개 설정</h3>

        {/* 상품 주소 */}
        <div className="space-y-1.5">
          <label htmlFor="pf-slug" className={fieldLabel}>
            상품 주소 <span className="text-destructive">*</span>
          </label>
          <div className="flex items-stretch gap-2">
            <div
              className={`flex flex-1 min-w-0 items-center rounded-md border bg-background focus-within:ring-2 focus-within:ring-ring ${
                slug && !slugState.ok ? "border-destructive" : "border-input"
              }`}
            >
              <span className="pl-3 pr-1 text-sm text-muted-foreground whitespace-nowrap select-none">{SHOP_ORIGIN}</span>
              <input
                id="pf-slug"
                value={slug}
                // 입력하는 대로 소문자로 바꾸고 공백은 하이픈으로 바꿔 규칙에 맞춰 준다.
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""))}
                placeholder="shorts-101"
                maxLength={60}
                className="h-10 min-w-0 flex-1 bg-transparent pr-3 text-sm outline-none"
              />
            </div>
            <Button
              type="button" variant="outline" size="sm" className="h-10 gap-1 text-xs shrink-0"
              onClick={() => setSlug(suggestSlug(title))}
            >
              <Wand2 className="h-3.5 w-3.5" /> 자동 생성
            </Button>
          </div>
          {slug ? (
            <p className={`flex items-center gap-1 text-[11px] ${slugState.ok ? "text-emerald-600" : "text-destructive"}`}>
              {slugState.ok ? <Check className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
              {slugState.message}
            </p>
          ) : (
            <p className="text-[11px] text-muted-foreground">
              영문 소문자·숫자·하이픈(-)만 쓸 수 있습니다. 한글 제목이면 &lsquo;자동 생성&rsquo;으로 짧은 주소를 만들 수 있습니다.
            </p>
          )}
        </div>

        {/* 공개 범위 */}
        <div className="space-y-2">
          <span className={fieldLabel}>공개 범위</span>
          <div role="radiogroup" className="grid grid-cols-1 tablet:grid-cols-2 gap-2">
            {([
              ["public", Globe, "공개", "스토어·검색·추천에 노출됩니다."],
              ["unlisted", Link2, "일부공개", "스토어와 검색에 나오지 않고, 주소를 아는 사람만 보고 구매할 수 있습니다."],
            ] as const).map(([value, Icon, label, desc]) => {
              const selected = visibility === value;
              return (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setVisibility(value)}
                  className={`flex items-start gap-3 rounded-lg border p-3 text-left transition-colors ${
                    selected ? "border-primary bg-primary/5" : "border-border hover:bg-secondary/50"
                  }`}
                >
                  <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${selected ? "text-primary" : "text-muted-foreground"}`} />
                  <span className="min-w-0">
                    <span className={`block text-sm font-semibold ${selected ? "text-primary" : ""}`}>{label}</span>
                    <span className="block text-xs text-muted-foreground mt-0.5 leading-relaxed">{desc}</span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* 일부공개면 공유할 주소를 바로 복사하게 한다. */}
          {visibility === "unlisted" && (
            <div className="flex items-center gap-2 rounded-lg bg-secondary/60 px-3 py-2.5">
              <Link2 className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              {slugState.ok ? (
                <>
                  <span className="min-w-0 flex-1 truncate text-xs">{shopUrl}</span>
                  <Button type="button" variant="outline" size="sm" className="h-7 gap-1 text-xs bg-background shrink-0" onClick={copyUrl}>
                    {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    {copied ? "복사됨" : "주소 복사"}
                  </Button>
                </>
              ) : (
                <span className="text-xs text-muted-foreground">상품 주소를 정하면 공유할 링크가 여기에 표시됩니다.</span>
              )}
            </div>
          )}
        </div>
      </section>

      <div className="flex items-center justify-end gap-2 pb-4">
        <Button variant="outline" size="sm" onClick={onCancel}>취소</Button>
        <Button size="sm" onClick={submit}>등록</Button>
      </div>
    </div>
  );
};

export default AdminEbookForm;
