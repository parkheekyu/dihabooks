import { useState } from "react";
import { CheckCircle2, Ban, Plus, FileText, Link2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import AdminEbookForm, { type NewEbook } from "@/components/admin/AdminEbookForm";
import { toast } from "sonner";

import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";

/** 심사에 필요한 값까지 담는다. 관리자가 승인 전에 내용을 확인할 수 있어야 한다. */
type Ebook = {
  id: string; title: string; author: string; price: number;
  sales: number; status: string; image: string; description?: string;
  pdfName?: string;
  toc?: { chapter: string; subtopics: { title: string; page?: number; preview: boolean }[] }[];
  links?: { page: string; label: string; url: string }[];
  files?: { page: string; name: string; size: string }[];
};

const initialEbooks: Ebook[] = [
  { id: "1", title: "유튜브 알고리즘 마스터", author: "크리에이터 김", price: 19000, sales: 67, status: "승인", image: hero1 },
  { id: "2", title: "인스타 릴스로 월 500만원", author: "인스타 마스터", price: 15000, sales: 52, status: "승인", image: hero2 },
  {
    id: "3", title: "제휴마케팅 완전 가이드", author: "마케터 박", price: 12000, sales: 12,
    status: "심사대기", image: hero1, pdfName: "제휴마케팅_완전가이드_v3.pdf",
    description: "제휴 링크 하나로 수익을 만드는 구조를 처음부터 끝까지 정리했습니다.",
    toc: [
      {
        chapter: "1. 시작하기",
        subtopics: [
          { title: "제휴마케팅이란", page: 1, preview: true },
          { title: "수익 구조 이해하기", page: 9, preview: false },
        ],
      },
      {
        chapter: "2. 실전",
        subtopics: [
          { title: "채널 고르기", page: 20, preview: false },
          { title: "전환율 높이는 글쓰기", page: 34, preview: true },
        ],
      },
    ],
    links: [{ page: "9", label: "제휴 플랫폼 비교표", url: "https://docs.google.com/spreadsheets" }],
    files: [{ page: "", name: "실습 워크시트.xlsx", size: "280 KB" }],
  },
  {
    id: "4", title: "퇴사 후 월 300만원 비결", author: "프리랜서 후기", price: 25000, sales: 0,
    status: "심사대기", image: hero2, pdfName: "퇴사후_월300_최종.pdf",
    description: "회사를 나오기 전에 준비해야 할 것들을 순서대로 담았습니다.",
    toc: [
      {
        chapter: "프롤로그",
        subtopics: [{ title: "퇴사 전에 확인할 것", page: 1, preview: true }],
      },
    ],
    links: [],
    files: [],
  },
];

interface AdminEbooksProps {
  filter?: "all" | "pending";
}

const AdminEbooks = ({ filter = "all" }: AdminEbooksProps) => {
  const [ebooks, setEbooks] = useState<Ebook[]>(initialEbooks);
  const [mode, setMode] = useState<"list" | "create">("list");
  const [detail, setDetail] = useState<Ebook | null>(null);

  const decide = (book: Ebook, approve: boolean) => {
    setEbooks((prev) =>
      prev.map((e) => (e.id === book.id ? { ...e, status: approve ? "승인" : "반려" } : e))
    );
    setDetail(null);
    toast.success(approve ? "승인 처리되었습니다." : "반려 처리되었습니다.");
  };

  const filtered = filter === "pending"
    ? ebooks.filter((e) => e.status === "심사대기")
    : ebooks;

  const addEbook = (b: NewEbook) => {
    setEbooks((prev) => [
      {
        id: String(Date.now()),
        title: b.title,
        author: b.author,
        price: b.price,
        sales: 0,
        status: "승인",
        image: b.image,
        description: b.description,
      },
      ...prev,
    ]);
    toast.success("상품이 등록되었습니다.");
    setMode("list");
  };

  const priceLabel = (p: number) => (p === 0 ? "무료" : `₩${p.toLocaleString()}`);

  if (mode === "create") {
    return <AdminEbookForm onCancel={() => setMode("list")} onSubmit={addEbook} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {filter === "pending" ? "심사 대기" : "전체"} {filtered.length}권
        </p>
        {filter !== "pending" && (
          <Button size="sm" className="h-8 text-xs gap-1.5" onClick={() => setMode("create")}>
            <Plus className="h-3.5 w-3.5" /> 상품 등록
          </Button>
        )}
      </div>

      {/* Desktop table */}
      <div className="hidden tablet:block rounded-xl border border-border bg-background overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">전자책</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">작가</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">가격</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">판매</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">상태</th>
              <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((book) => (
              <tr key={book.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={book.image} alt="" className="w-10 h-14 rounded-lg object-cover" />
                    <span className="text-sm font-medium">{book.title}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">{book.author}</td>
                <td className="px-4 py-3 text-sm">{priceLabel(book.price)}</td>
                <td className="px-4 py-3 text-sm">{book.sales}권</td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                    book.status === "승인" ? "bg-green-100 text-green-700"
                      : book.status === "반려" ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}>{book.status}</span>
                </td>
                <td className="px-4 py-3 text-right">
                  {book.status === "심사대기" && (
                    <div className="flex gap-1.5 justify-end">
                      <Button size="sm" variant="outline" className="h-7 px-2 text-xs" onClick={() => setDetail(book)}>상세</Button>
                      <Button size="sm" variant="outline" className="h-7 px-2 text-xs gap-1" onClick={() => decide(book, true)}><CheckCircle2 className="h-3 w-3" /> 승인</Button>
                      <Button size="sm" variant="outline" className="h-7 px-2 text-xs gap-1 text-destructive" onClick={() => decide(book, false)}><Ban className="h-3 w-3" /> 반려</Button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="tablet:hidden space-y-3">
        {filtered.map((book) => (
          <div key={book.id} className="rounded-xl border border-border bg-background p-4">
            <div className="flex gap-3">
              <img src={book.image} alt="" className="w-14 h-20 rounded-lg object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{book.title}</p>
                <p className="text-xs text-muted-foreground">{book.author}</p>
                <p className="text-sm font-semibold mt-1">{priceLabel(book.price)} · {book.sales}권</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                    book.status === "승인" ? "bg-green-100 text-green-700"
                      : book.status === "반려" ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}>{book.status}</span>
                  {book.status === "심사대기" && (
                    <div className="flex gap-1.5">
                      <Button size="sm" variant="outline" className="h-6 px-2 text-xs" onClick={() => setDetail(book)}>상세</Button>
                      <Button size="sm" variant="outline" className="h-6 px-2 text-xs" onClick={() => decide(book, true)}>승인</Button>
                      <Button size="sm" variant="outline" className="h-6 px-2 text-xs text-destructive" onClick={() => decide(book, false)}>반려</Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 심사 상세 — 승인 전에 목차·미리보기·자료·PDF를 확인한다. */}
      <Dialog open={!!detail} onOpenChange={(open) => !open && setDetail(null)}>
        <DialogContent className="sm:max-w-[620px] max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>심사 상세</DialogTitle></DialogHeader>
          {detail && (
            <div className="space-y-5">
              <div className="flex gap-4">
                <img src={detail.image} alt="" className="w-20 h-28 rounded-lg object-cover shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-bold">{detail.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{detail.author}</p>
                  <p className="text-sm font-semibold mt-2">{priceLabel(detail.price)}</p>
                  {detail.pdfName && (
                    <p className="flex items-center gap-1.5 text-xs text-muted-foreground mt-2">
                      <FileText className="h-3.5 w-3.5" /> {detail.pdfName}
                    </p>
                  )}
                </div>
              </div>

              {detail.description && (
                <div>
                  <h4 className="text-xs font-semibold mb-1.5">상세 설명</h4>
                  <p className="rounded-lg bg-secondary/60 px-3 py-2.5 text-sm">{detail.description}</p>
                </div>
              )}

              <div>
                <h4 className="text-xs font-semibold mb-1.5">목차</h4>
                {detail.toc?.length ? (
                  <div className="space-y-3">
                    {detail.toc.map((ch, i) => (
                      <div key={i}>
                        <p className="text-sm font-semibold">{ch.chapter}</p>
                        <ul className="mt-1 divide-y divide-border rounded-lg border border-border">
                          {ch.subtopics.map((sub, j) => (
                            <li key={j} className="flex items-center gap-2 px-3 py-2">
                              <span className="w-10 shrink-0 text-xs text-muted-foreground tabular-nums">
                                {sub.page ? `${sub.page}쪽` : "-"}
                              </span>
                              <span className="text-sm flex-1 min-w-0 truncate">{sub.title}</span>
                              {sub.preview && (
                                <span className="shrink-0 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-primary/10 text-primary">
                                  미리보기
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">등록된 목차가 없습니다.</p>
                )}
              </div>

              <div>
                <h4 className="text-xs font-semibold mb-1.5">페이지별 링크 · 자료</h4>
                {detail.links?.length || detail.files?.length ? (
                  <ul className="divide-y divide-border rounded-lg border border-border">
                    {detail.links?.map((l) => (
                      <li key={l.url + l.label} className="flex items-center gap-2 px-3 py-2">
                        <Link2 className="h-3.5 w-3.5 shrink-0 text-primary" />
                        <span className="w-10 shrink-0 text-xs text-muted-foreground">{l.page ? `${l.page}쪽` : "전체"}</span>
                        <span className="text-sm flex-1 min-w-0 truncate">{l.label}</span>
                        <span className="text-[11px] text-muted-foreground shrink-0 truncate max-w-[160px]">{l.url}</span>
                      </li>
                    ))}
                    {detail.files?.map((f) => (
                      <li key={f.name} className="flex items-center gap-2 px-3 py-2">
                        <FileText className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                        <span className="w-10 shrink-0 text-xs text-muted-foreground">{f.page ? `${f.page}쪽` : "전체"}</span>
                        <span className="text-sm flex-1 min-w-0 truncate">{f.name}</span>
                        <span className="text-[11px] text-muted-foreground shrink-0">{f.size}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">등록된 링크나 자료가 없습니다.</p>
                )}
              </div>

              {detail.status === "심사대기" && (
                <div className="flex justify-end gap-2 border-t border-border pt-4">
                  <Button variant="outline" size="sm" className="text-xs gap-1 text-destructive" onClick={() => decide(detail, false)}>
                    <Ban className="h-3.5 w-3.5" /> 반려
                  </Button>
                  <Button size="sm" className="text-xs gap-1" onClick={() => decide(detail, true)}>
                    <CheckCircle2 className="h-3.5 w-3.5" /> 승인
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminEbooks;
