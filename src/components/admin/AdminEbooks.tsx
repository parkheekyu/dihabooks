import { useState } from "react";
import { CheckCircle2, Ban, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminEbookForm, { type NewEbook } from "@/components/admin/AdminEbookForm";
import { toast } from "sonner";

import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";

type Ebook = {
  id: string; title: string; author: string; price: number;
  sales: number; status: string; image: string; description?: string;
};

const initialEbooks: Ebook[] = [
  { id: "1", title: "유튜브 알고리즘 마스터", author: "크리에이터 김", price: 19000, sales: 67, status: "승인", image: hero1 },
  { id: "2", title: "인스타 릴스로 월 500만원", author: "인스타 마스터", price: 15000, sales: 52, status: "승인", image: hero2 },
  { id: "3", title: "제휴마케팅 완전 가이드", author: "마케터 박", price: 12000, sales: 12, status: "심사대기", image: hero1 },
  { id: "4", title: "퇴사 후 월 300만원 비결", author: "프리랜서 후기", price: 25000, sales: 0, status: "심사대기", image: hero2 },
];

interface AdminEbooksProps {
  filter?: "all" | "pending";
}

const AdminEbooks = ({ filter = "all" }: AdminEbooksProps) => {
  const [ebooks, setEbooks] = useState<Ebook[]>(initialEbooks);
  const [mode, setMode] = useState<"list" | "create">("list");

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
                    book.status === "승인" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                  }`}>{book.status}</span>
                </td>
                <td className="px-4 py-3 text-right">
                  {book.status === "심사대기" && (
                    <div className="flex gap-1.5 justify-end">
                      <Button size="sm" variant="outline" className="h-7 px-2 text-xs gap-1"><CheckCircle2 className="h-3 w-3" /> 승인</Button>
                      <Button size="sm" variant="outline" className="h-7 px-2 text-xs gap-1 text-destructive"><Ban className="h-3 w-3" /> 반려</Button>
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
                    book.status === "승인" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                  }`}>{book.status}</span>
                  {book.status === "심사대기" && (
                    <div className="flex gap-1.5">
                      <Button size="sm" variant="outline" className="h-6 px-2 text-xs">승인</Button>
                      <Button size="sm" variant="outline" className="h-6 px-2 text-xs text-destructive">반려</Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default AdminEbooks;
