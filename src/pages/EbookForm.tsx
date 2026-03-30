import { useState, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft, Upload, X, ImagePlus, FileText, ChevronDown, ChevronUp, Info,
  Bold, Italic, Underline, List, ListOrdered, AlignLeft, AlignCenter, Image as ImageIcon, Link2, Heading2, Minus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { categories } from "@/data/mockData";
import { toast } from "sonner";

const EbookForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("id");
  const isEdit = !!editId;

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [tags, setTags] = useState("");

  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  // Rich editor ref
  const editorRef = useRef<HTMLDivElement>(null);

  const [sections, setSections] = useState({
    basic: true,
    thumbnail: true,
    content: true,
    price: true,
    file: true,
  });

  const toggleSection = (key: keyof typeof sections) => {
    setSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setCoverPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
    } else {
      toast.error("PDF 파일만 업로드 가능합니다.");
    }
  };

  // Editor commands
  const execCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  }, []);

  const handleEditorImageUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          execCommand("insertImage", reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleSubmit = (submitForReview: boolean) => {
    if (!title.trim()) {
      toast.error("전자책 제목을 입력해주세요.");
      return;
    }
    if (!category) {
      toast.error("카테고리를 선택해주세요.");
      return;
    }
    if (!price || Number(price) <= 0) {
      toast.error("판매 가격을 입력해주세요.");
      return;
    }

    const editorContent = editorRef.current?.innerHTML || "";

    if (submitForReview) {
      if (!coverPreview) {
        toast.error("대표 이미지를 등록해주세요.");
        return;
      }
      if (!editorContent.trim() || editorContent === "<br>") {
        toast.error("전자책 소개를 작성해주세요.");
        return;
      }
      if (!pdfFile) {
        toast.error("PDF 파일을 업로드해주세요.");
        return;
      }
      toast.success("심사 요청이 완료되었습니다. 검토 후 승인됩니다.");
    } else {
      toast.success(isEdit ? "전자책이 수정되었습니다." : "전자책이 임시 저장되었습니다.");
    }

    navigate("/instructor");
  };

  const filteredCategories = categories.filter(c => c.id !== "all");

  const toolbarButtons = [
    { icon: Bold, command: "bold", label: "굵게" },
    { icon: Italic, command: "italic", label: "기울임" },
    { icon: Underline, command: "underline", label: "밑줄" },
    { icon: Heading2, command: "formatBlock", value: "h2", label: "제목" },
    { divider: true },
    { icon: List, command: "insertUnorderedList", label: "목록" },
    { icon: ListOrdered, command: "insertOrderedList", label: "번호 목록" },
    { divider: true },
    { icon: AlignLeft, command: "justifyLeft", label: "왼쪽 정렬" },
    { icon: AlignCenter, command: "justifyCenter", label: "가운데 정렬" },
    { divider: true },
    { icon: Minus, command: "insertHorizontalRule", label: "구분선" },
  ] as const;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 bg-secondary/30">
        {/* Top bar */}
        <div className="border-b border-border bg-background">
          <div className="container px-4 py-3 flex items-center gap-3">
            <button onClick={() => navigate("/instructor")} className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </button>
            <h1 className="text-sm font-bold">{isEdit ? "전자책 수정" : "새 전자책 등록"}</h1>
          </div>
        </div>

        <div className="container px-4 py-4 tablet:py-6 max-w-3xl mx-auto space-y-4">

          {/* ── 기본 정보 ── */}
          <FormSection title="기본 정보" required open={sections.basic} onToggle={() => toggleSection("basic")}>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-semibold">전자책 제목 <span className="text-destructive">*</span></Label>
                <Input
                  className="mt-1.5"
                  placeholder="전자책 제목을 입력해주세요."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={100}
                />
                <p className="text-xs text-muted-foreground mt-1 text-right">{title.length} / 100</p>
              </div>

              <div>
                <Label className="text-sm font-semibold">카테고리 <span className="text-destructive">*</span></Label>
                <p className="text-xs text-muted-foreground mt-0.5">판매 카테고리와 관련이 없는 상품의 부적절하게 판매한 경우 강제 판매 중지될 수 있습니다.</p>
                <select
                  className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">카테고리 선택</option>
                  {filteredCategories.map(c => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </FormSection>

          {/* ── 대표 이미지 ── */}
          <FormSection title="대표 이미지" open={sections.thumbnail} onToggle={() => toggleSection("thumbnail")}>
            <div>
              <Label className="text-sm font-semibold">대표 이미지 <span className="text-destructive">*</span></Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                상세 페이지 상단에 노출되는 이미지입니다. (권장: 가로 1280px · 세로 720px, 16:9 비율)
              </p>
              <div className="mt-2">
                {coverPreview ? (
                  <div className="relative w-full max-w-md aspect-video rounded-xl overflow-hidden border border-border">
                    <img src={coverPreview} alt="커버" className="w-full h-full object-cover" />
                    <button
                      onClick={() => setCoverPreview(null)}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-background/80 hover:bg-background transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full max-w-md aspect-video rounded-xl border-2 border-dashed border-border hover:border-primary/50 cursor-pointer transition-colors">
                    <ImagePlus className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">이미지를 업로드해주세요</span>
                    <span className="text-xs text-muted-foreground mt-0.5">16:9 비율 권장</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
                  </label>
                )}
              </div>
            </div>
          </FormSection>

          {/* ── 콘텐츠 소개 (Rich Editor) ── */}
          <FormSection title="콘텐츠 소개" required open={sections.content} onToggle={() => toggleSection("content")}>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-semibold">전자책 소개 <span className="text-destructive">*</span></Label>
                <p className="text-xs text-muted-foreground mt-0.5">구매자에게 보여질 전자책 소개글을 작성해주세요.</p>

                {/* Toolbar */}
                <div className="mt-1.5 rounded-t-xl border border-border bg-secondary/30 px-2 py-1.5 flex items-center gap-0.5 flex-wrap">
                  {toolbarButtons.map((btn, i) => {
                    if ('divider' in btn) {
                      return <div key={i} className="w-px h-5 bg-border mx-1" />;
                    }
                    const Icon = btn.icon;
                    return (
                      <button
                        key={i}
                        type="button"
                        title={btn.label}
                        onClick={() => execCommand(btn.command, 'value' in btn ? btn.value : undefined)}
                        className="p-1.5 rounded-md hover:bg-secondary transition-colors"
                      >
                        <Icon className="h-4 w-4 text-foreground" />
                      </button>
                    );
                  })}
                  <div className="w-px h-5 bg-border mx-1" />
                  <button
                    type="button"
                    title="이미지 삽입"
                    onClick={handleEditorImageUpload}
                    className="p-1.5 rounded-md hover:bg-secondary transition-colors"
                  >
                    <ImageIcon className="h-4 w-4 text-foreground" />
                  </button>
                  <button
                    type="button"
                    title="링크 삽입"
                    onClick={() => {
                      const url = prompt("URL을 입력해주세요:");
                      if (url) execCommand("createLink", url);
                    }}
                    className="p-1.5 rounded-md hover:bg-secondary transition-colors"
                  >
                    <Link2 className="h-4 w-4 text-foreground" />
                  </button>
                </div>

                {/* Editable area */}
                <div
                  ref={editorRef}
                  contentEditable
                  className="min-h-[280px] rounded-b-xl border border-t-0 border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring prose prose-sm max-w-none [&_img]:max-w-full [&_img]:rounded-lg [&_img]:my-2"
                  style={{ wordBreak: "break-word" }}
                  data-placeholder="전자책의 내용, 대상 독자, 기대 효과 등을 자세히 소개해주세요."
                  suppressContentEditableWarning
                />
                <p className="text-xs text-muted-foreground mt-1 text-right flex items-center justify-end gap-1">
                  <ImageIcon className="h-3 w-3" /> 이미지 삽입 가능
                </p>
              </div>

              <div>
                <Label className="text-sm font-semibold">태그</Label>
                <p className="text-xs text-muted-foreground mt-0.5">쉼표(,)로 구분하여 입력해주세요. 검색 노출에 도움이 됩니다.</p>
                <Input
                  className="mt-1.5"
                  placeholder="예: 유튜브, 알고리즘, 구독자 늘리기"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>
            </div>
          </FormSection>

          {/* ── 판매 가격 ── */}
          <FormSection title="판매 가격" required open={sections.price} onToggle={() => toggleSection("price")}>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-semibold">판매가 <span className="text-destructive">*</span></Label>
                <div className="flex items-center gap-2 mt-1.5">
                  <Input
                    type="number"
                    className="max-w-[200px]"
                    placeholder="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    min={0}
                  />
                  <span className="text-sm text-muted-foreground">원</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  결제 수수료를 제외한 금액이 정산됩니다. (최소 1,000원)
                </p>
              </div>
              <div>
                <Label className="text-sm font-semibold">할인가</Label>
                <div className="flex items-center gap-2 mt-1.5">
                  <Input
                    type="number"
                    className="max-w-[200px]"
                    placeholder="0"
                    value={discountPrice}
                    onChange={(e) => setDiscountPrice(e.target.value)}
                    min={0}
                  />
                  <span className="text-sm text-muted-foreground">원</span>
                </div>
                {price && discountPrice && Number(discountPrice) > 0 && Number(discountPrice) < Number(price) && (
                  <p className="text-xs text-primary mt-1 font-medium">
                    {Math.round((1 - Number(discountPrice) / Number(price)) * 100)}% 할인 적용
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  할인가를 입력하면 판매가에 취소선이 표시되고 할인가로 판매됩니다.
                </p>
              </div>
            </div>
          </FormSection>

          {/* ── PDF 파일 ── */}
          <FormSection title="콘텐츠 파일 (PDF)" required open={sections.file} onToggle={() => toggleSection("file")}>
            <div>
              <Label className="text-sm font-semibold">PDF 파일 업로드 <span className="text-destructive">*</span></Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                구매자에게 제공될 PDF 파일을 업로드해주세요. 웹 뷰어로만 열람 가능하며 다운로드는 불가합니다.
              </p>

              {pdfFile ? (
                <div className="mt-2 flex items-center gap-3 rounded-xl border border-border bg-secondary/30 p-3">
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
                <label className="mt-2 flex flex-col items-center justify-center h-28 rounded-xl border-2 border-dashed border-border hover:border-primary/50 cursor-pointer transition-colors">
                  <Upload className="h-6 w-6 text-muted-foreground mb-1" />
                  <span className="text-sm text-muted-foreground">PDF 파일을 선택해주세요</span>
                  <span className="text-xs text-muted-foreground mt-0.5">최대 200MB</span>
                  <input type="file" accept=".pdf" className="hidden" onChange={handlePdfUpload} />
                </label>
              )}
            </div>
          </FormSection>

          {/* ── 안내 ── */}
          <div className="rounded-xl border border-border bg-primary/5 p-4 flex gap-3">
            <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <div className="text-xs text-muted-foreground space-y-1">
              <p>부적절한 콘텐츠는 심사에서 반려될 수 있습니다.</p>
              <p>심사 요청 후에는 승인 전까지 수정이 제한됩니다.</p>
            </div>
          </div>

          {/* ── Submit buttons ── */}
          <div className="flex gap-3 pb-6">
            <Button variant="outline" className="flex-1 h-12 rounded-xl" onClick={() => navigate("/instructor")}>
              취소
            </Button>
            <Button variant="secondary" className="flex-1 h-12 rounded-xl" onClick={() => handleSubmit(false)}>
              임시 저장
            </Button>
            <Button className="flex-1 h-12 rounded-xl" onClick={() => handleSubmit(true)}>
              심사 요청
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

/* ── Collapsible Section ── */
const FormSection = ({
  title, required, open, onToggle, children,
}: {
  title: string; required?: boolean; open: boolean; onToggle: () => void; children: React.ReactNode;
}) => (
  <div className="rounded-xl border border-border bg-background overflow-hidden">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between px-5 py-4 hover:bg-secondary/30 transition-colors"
    >
      <span className="text-sm font-bold flex items-center gap-1.5">
        {title}
        {required && <span className="text-destructive">*</span>}
      </span>
      {open ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
    </button>
    {open && <div className="px-5 pb-5">{children}</div>}
  </div>
);

export default EbookForm;
