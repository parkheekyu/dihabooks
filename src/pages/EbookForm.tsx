import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft, Upload, X, ImagePlus, FileText, ChevronDown, ChevronUp, Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { categories } from "@/data/mockData";
import { toast } from "sonner";

const saleStatuses = [
  { value: "draft", label: "작성중" },
  { value: "review", label: "심사 요청" },
];

const EbookForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("id");
  const isEdit = !!editId;

  // Form state
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [tags, setTags] = useState("");
  const [saleStatus, setSaleStatus] = useState("draft");

  // File states (mock)
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  // Section collapse
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

  const handleAdditionalUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && additionalImages.length < 5) {
      const reader = new FileReader();
      reader.onloadend = () => setAdditionalImages(prev => [...prev, reader.result as string]);
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

    if (submitForReview) {
      if (!coverPreview) {
        toast.error("대표 이미지를 등록해주세요.");
        return;
      }
      if (!description.trim()) {
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
          <FormSection
            title="기본 정보"
            required
            open={sections.basic}
            onToggle={() => toggleSection("basic")}
          >
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

              <div>
                <Label className="text-sm font-semibold">판매 상태</Label>
                <select
                  className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={saleStatus}
                  onChange={(e) => setSaleStatus(e.target.value)}
                >
                  {saleStatuses.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </FormSection>

          {/* ── 썸네일 이미지 ── */}
          <FormSection
            title="썸네일 이미지"
            open={sections.thumbnail}
            onToggle={() => toggleSection("thumbnail")}
          >
            <div className="space-y-5">
              <div>
                <Label className="text-sm font-semibold">대표 이미지 <span className="text-destructive">*</span></Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  대표 이미지는 상품 노출 및 상세 페이지에서 가장 먼저 노출되는 이미지입니다. (권장: 가로 1000px · 세로 1400px 이상)
                </p>
                <div className="mt-2">
                  {coverPreview ? (
                    <div className="relative w-32 h-44 rounded-xl overflow-hidden border border-border">
                      <img src={coverPreview} alt="커버" className="w-full h-full object-cover" />
                      <button
                        onClick={() => setCoverPreview(null)}
                        className="absolute top-1 right-1 p-1 rounded-full bg-background/80 hover:bg-background transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-32 h-44 rounded-xl border-2 border-dashed border-border hover:border-primary/50 cursor-pointer transition-colors">
                      <ImagePlus className="h-6 w-6 text-muted-foreground mb-1" />
                      <span className="text-xs text-muted-foreground">업로드</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
                    </label>
                  )}
                </div>
              </div>

              <div>
                <Label className="text-sm font-semibold">추가 이미지</Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  추가 이미지는 최대 5장까지 등록 가능합니다. (권장: 가로 1000px · 세로 1000px 이상)
                </p>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {additionalImages.map((img, i) => (
                    <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border border-border">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button
                        onClick={() => setAdditionalImages(prev => prev.filter((_, idx) => idx !== i))}
                        className="absolute top-1 right-1 p-0.5 rounded-full bg-background/80 hover:bg-background transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  {additionalImages.length < 5 && (
                    <label className="flex flex-col items-center justify-center w-24 h-24 rounded-xl border-2 border-dashed border-border hover:border-primary/50 cursor-pointer transition-colors">
                      <ImagePlus className="h-5 w-5 text-muted-foreground mb-0.5" />
                      <span className="text-[10px] text-muted-foreground">{additionalImages.length + 1}/5 업로드</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleAdditionalUpload} />
                    </label>
                  )}
                </div>
              </div>
            </div>
          </FormSection>

          {/* ── 콘텐츠 소개 ── */}
          <FormSection
            title="콘텐츠 소개"
            required
            open={sections.content}
            onToggle={() => toggleSection("content")}
          >
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-semibold">전자책 소개 <span className="text-destructive">*</span></Label>
                <p className="text-xs text-muted-foreground mt-0.5">구매자에게 보여질 전자책 소개글을 작성해주세요.</p>
                <Textarea
                  className="mt-1.5 min-h-[200px]"
                  placeholder="전자책의 내용, 대상 독자, 기대 효과 등을 자세히 소개해주세요."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={5000}
                />
                <p className="text-xs text-muted-foreground mt-1 text-right">{description.length} / 5,000</p>
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
          <FormSection
            title="판매 가격"
            required
            open={sections.price}
            onToggle={() => toggleSection("price")}
          >
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
          </FormSection>

          {/* ── PDF 파일 ── */}
          <FormSection
            title="콘텐츠 파일 (PDF)"
            required
            open={sections.file}
            onToggle={() => toggleSection("file")}
          >
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
            <Button
              variant="outline"
              className="flex-1 h-12 rounded-xl"
              onClick={() => navigate("/instructor")}
            >
              취소
            </Button>
            <Button
              variant="secondary"
              className="flex-1 h-12 rounded-xl"
              onClick={() => handleSubmit(false)}
            >
              임시 저장
            </Button>
            <Button
              className="flex-1 h-12 rounded-xl"
              onClick={() => handleSubmit(true)}
            >
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
  title,
  required,
  open,
  onToggle,
  children,
}: {
  title: string;
  required?: boolean;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
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
