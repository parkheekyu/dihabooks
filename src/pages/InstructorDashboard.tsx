import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BookOpen, TrendingUp, DollarSign, Plus, MoreVertical,
  Eye, Edit, Trash2, BarChart3, ArrowUpRight, ArrowDownRight,
  LayoutDashboard, FileText, ShoppingBag, Receipt
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";

import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";

const stats = [
  { label: "총 판매 수익", value: "₩3,240,000", change: "+12.5%", up: true, icon: DollarSign },
  { label: "총 판매량", value: "162권", change: "+8.3%", up: true, icon: TrendingUp },
  { label: "등록 전자책", value: "5권", change: "0", up: true, icon: BookOpen },
];

const mockBooks = [
  { id: "1", title: "유튜브 알고리즘 마스터", price: 19000, sales: 67, revenue: 1273000, status: "판매중", category: "유튜브", image: hero1 },
  { id: "2", title: "인스타 릴스로 월 500만원", price: 15000, sales: 52, revenue: 780000, status: "판매중", category: "인스타그램", image: hero2 },
  { id: "3", title: "ChatGPT 자동화 파이프라인", price: 39000, sales: 31, revenue: 1209000, status: "판매중", category: "AI/자동화", image: hero3 },
  { id: "4", title: "제휴마케팅 완전 가이드", price: 12000, sales: 12, revenue: 144000, status: "심사 대기", category: "제휴마케팅", image: hero1 },
  { id: "5", title: "퇴사 후 월 300만원 비결", price: 25000, sales: 0, revenue: 0, status: "반려", category: "재테크", image: hero2 },
];

const recentSales = [
  { buyer: "김**", book: "유튜브 알고리즘 마스터", date: "2026-03-30", amount: 19000 },
  { buyer: "이**", book: "ChatGPT 자동화 파이프라인", date: "2026-03-30", amount: 39000 },
  { buyer: "박**", book: "인스타 릴스로 월 500만원", date: "2026-03-29", amount: 15000 },
  { buyer: "최**", book: "유튜브 알고리즘 마스터", date: "2026-03-29", amount: 19000 },
  { buyer: "정**", book: "ChatGPT 자동화 파이프라인", date: "2026-03-28", amount: 39000 },
];

const monthlySales = [
  { month: "10월", amount: 180000 },
  { month: "11월", amount: 320000 },
  { month: "12월", amount: 450000 },
  { month: "1월", amount: 520000 },
  { month: "2월", amount: 680000 },
  { month: "3월", amount: 1090000 },
];

const maxSales = Math.max(...monthlySales.map(m => m.amount));

type Tab = "overview" | "books" | "sales" | "settlements";

const sidebarItems: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "overview", label: "대시보드", icon: LayoutDashboard },
  { id: "books", label: "전자책 관리", icon: FileText },
  { id: "sales", label: "판매 내역", icon: ShoppingBag },
  { id: "settlements", label: "정산 내역", icon: Receipt },
];

const InstructorDashboard = () => {
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container px-4 py-6 tablet:py-10">
          <div className="flex gap-10 max-w-5xl mx-auto">
            {/* Desktop sidebar */}
            <aside className="hidden desktop:block w-52 shrink-0">
              <div className="sticky top-24">
                <h2 className="text-lg font-bold mb-4">판매자 대시보드</h2>
                <nav className="space-y-0.5">
                  {sidebarItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={cn(
                        "flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors w-full",
                        activeTab === item.id
                          ? "text-foreground font-medium bg-secondary"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                      )}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {item.label}
                    </button>
                  ))}
                </nav>
                <div className="mt-4 pt-4 border-t border-border">
                  <Button size="sm" variant="outline" className="w-full rounded-md gap-1.5 text-xs bg-foreground text-background hover:bg-foreground/90 hover:text-background border-foreground" asChild>
                    <Link to="/instructor/ebook/new"><Plus className="h-3.5 w-3.5" /> 새 전자책</Link>
                  </Button>
                </div>
              </div>
            </aside>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Mobile title */}
              <h1 className="text-lg font-bold mb-6 desktop:hidden">판매자 대시보드</h1>

              {/* Mobile horizontal nav */}
              <div className="desktop:hidden border-b border-border bg-background -mx-4 px-4 mb-6">
                <div className="flex gap-1 overflow-x-auto scrollbar-hide">
                  {sidebarItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={cn(
                        "px-3 py-3 text-sm whitespace-nowrap border-b-2 transition-colors",
                        activeTab === item.id
                          ? "border-primary text-primary font-medium"
                          : "border-transparent text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {activeTab === "overview" && <OverviewContent />}
              {activeTab === "books" && <BooksContent />}
              {activeTab === "sales" && <SalesContent />}
              {activeTab === "settlements" && <SettlementsContent />}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

/* ─── Overview ─── */
const OverviewContent = () => (
  <div className="space-y-6">
    <h2 className="hidden desktop:block text-lg font-bold">대시보드</h2>

    {/* Stats */}
    <div className="grid grid-cols-1 tablet:grid-cols-3 gap-3">
      {stats.map(s => (
        <div key={s.label} className="rounded-xl border border-border p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">{s.label}</span>
            <s.icon className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-xl font-bold">{s.value}</p>
          <div className="flex items-center gap-1 mt-1">
            {s.up ? (
              <ArrowUpRight className="h-3 w-3 text-green-500" />
            ) : (
              <ArrowDownRight className="h-3 w-3 text-red-500" />
            )}
            <span className="text-xs text-muted-foreground">전월 대비 {s.change}</span>
          </div>
        </div>
      ))}
    </div>

    {/* Chart */}
    <div className="border-b border-border pb-6">
      <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
        <BarChart3 className="h-4 w-4 text-muted-foreground" /> 월별 매출 추이
      </h3>
      <div className="flex items-end gap-3 h-40 tablet:h-48">
        {monthlySales.map(m => (
          <div key={m.month} className="flex-1 flex flex-col items-center gap-1.5">
            <div
              className="w-full rounded-t-md bg-primary/80 hover:bg-primary transition-colors min-h-[4px]"
              style={{ height: `${(m.amount / maxSales) * 100}%` }}
            />
            <span className="text-[10px] tablet:text-xs text-muted-foreground">{m.month}</span>
          </div>
        ))}
      </div>
    </div>

    {/* Recent Sales */}
    <div className="border-b border-border pb-6">
      <h3 className="text-sm font-semibold mb-3">최근 판매</h3>
      <div className="space-y-3">
        {recentSales.slice(0, 5).map((sale, i) => (
          <div key={i} className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{sale.book}</p>
              <p className="text-xs text-muted-foreground">{sale.buyer} · {sale.date}</p>
            </div>
            <span className="text-sm font-semibold shrink-0">₩{sale.amount.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>

    {/* Top books */}
    <div>
      <h3 className="text-sm font-semibold mb-3">인기 전자책</h3>
      <div className="space-y-3">
        {mockBooks.filter(b => b.sales > 0).sort((a, b) => b.sales - a.sales).slice(0, 3).map((book, i) => (
          <div key={book.id} className="flex items-center gap-3">
            <span className="text-lg font-bold text-muted-foreground w-6 text-center">{i + 1}</span>
            <img src={book.image} alt="" className="w-10 h-10 rounded-md object-cover" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{book.title}</p>
              <p className="text-xs text-muted-foreground">{book.sales}권 판매 · ₩{book.revenue.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ─── Books Management ─── */
const bookStatuses = ["전체", "판매중", "심사 대기", "반려"] as const;

const BooksContent = () => {
  const [statusFilter, setStatusFilter] = useState<string>("전체");
  const navigate = useNavigate();

  const filteredBooks = statusFilter === "전체"
    ? mockBooks
    : mockBooks.filter(b => b.status === statusFilter);

  const getCount = (status: string) =>
    status === "전체" ? mockBooks.length : mockBooks.filter(b => b.status === status).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="hidden desktop:block text-lg font-bold">전자책 관리</h2>
        <Button size="sm" className="rounded-md gap-1.5 text-xs bg-foreground text-background hover:bg-foreground/90 desktop:hidden" asChild>
          <Link to="/instructor/ebook/new"><Plus className="h-3.5 w-3.5" /> 새 전자책</Link>
        </Button>
      </div>

      {/* Status filter tabs */}
      <div className="border-b border-border">
        <div className="flex gap-0 overflow-x-auto scrollbar-hide">
          {bookStatuses.map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={cn(
                "px-4 py-2.5 text-sm whitespace-nowrap border-b-2 transition-colors",
                statusFilter === status
                  ? "border-foreground text-foreground font-medium"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {status} {getCount(status)}
            </button>
          ))}
        </div>
      </div>

      {/* Book list */}
      {filteredBooks.length === 0 ? (
        <div className="py-16 text-center text-sm text-muted-foreground">
          해당 상태의 전자책이 없습니다.
        </div>
      ) : (
        <div className="space-y-0">
          {filteredBooks.map(book => (
            <div key={book.id} className="py-4 border-b border-border last:border-0">
              <div className="flex gap-4">
                <img src={book.image} alt="" className="w-16 h-16 tablet:w-20 tablet:h-20 rounded-md object-cover aspect-square shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <StatusBadge status={book.status} />
                      <p className="text-sm font-semibold mt-1.5 truncate">{book.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{book.category}</p>
                    </div>
                    <BookActions bookId={book.id} />
                  </div>
                  <div className="flex items-center gap-4 mt-3">
                    <span className="text-sm font-semibold">₩{book.price.toLocaleString()}</span>
                    {book.sales > 0 && (
                      <span className="text-xs text-muted-foreground">{book.sales}권 판매</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ─── Sales History ─── */
const SalesContent = () => (
  <div className="space-y-6">
    <h2 className="hidden desktop:block text-lg font-bold">판매 내역</h2>
    <p className="text-sm text-muted-foreground">최근 판매 내역</p>

    {/* Desktop table */}
    <div className="hidden tablet:block rounded-xl border border-border overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-secondary/50">
            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">구매자</th>
            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">전자책</th>
            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">날짜</th>
            <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">금액</th>
          </tr>
        </thead>
        <tbody>
          {recentSales.map((sale, i) => (
            <tr key={i} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
              <td className="px-4 py-3 text-sm">{sale.buyer}</td>
              <td className="px-4 py-3 text-sm font-medium">{sale.book}</td>
              <td className="px-4 py-3 text-sm text-muted-foreground">{sale.date}</td>
              <td className="px-4 py-3 text-sm font-semibold text-right">₩{sale.amount.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Mobile cards */}
    <div className="tablet:hidden space-y-0">
      {recentSales.map((sale, i) => (
        <div key={i} className="py-4 border-b border-border last:border-0">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">{sale.book}</p>
            <span className="text-sm font-semibold">₩{sale.amount.toLocaleString()}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">{sale.buyer} · {sale.date}</p>
        </div>
      ))}
    </div>
  </div>
);

/* ─── Settlements ─── */
const mockSettlements = [
  { id: "S-2026-0301", date: "2026.03.01", bookTitle: "인스타그램 마케팅 완전정복", sales: 12, amount: 156000, fee: 23400, net: 132600, status: "완료" as const },
  { id: "S-2026-0201", date: "2026.02.01", bookTitle: "유튜브 수익화 전략", sales: 8, amount: 104000, fee: 15600, net: 88400, status: "완료" as const },
  { id: "S-2026-0101", date: "2026.01.01", bookTitle: "제휴마케팅 입문 가이드", sales: 5, amount: 49500, fee: 7425, net: 42075, status: "완료" as const },
  { id: "S-2025-1201", date: "2025.12.01", bookTitle: "AI 자동화로 월 100만원", sales: 20, amount: 396000, fee: 59400, net: 336600, status: "완료" as const },
  { id: "S-2025-1101", date: "2025.11.01", bookTitle: "인스타그램 마케팅 완전정복", sales: 3, amount: 39000, fee: 5850, net: 33150, status: "완료" as const },
];

const SettlementsContent = () => {
  const totalNet = mockSettlements.reduce((sum, s) => sum + s.net, 0);
  return (
    <div className="space-y-6">
      <h2 className="hidden desktop:block text-lg font-bold">정산 내역</h2>
      <p className="text-sm text-muted-foreground">판매 수익 정산 내역을 확인하세요.</p>

      {/* Summary card */}
      <div className="rounded-xl border border-border bg-secondary/30 p-5 flex flex-col tablet:flex-row tablet:items-center gap-4">
        <div className="flex-1">
          <p className="text-xs text-muted-foreground mb-1">누적 정산 금액</p>
          <p className="text-2xl font-bold">{totalNet.toLocaleString()}원</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">총 판매 건수</p>
          <p className="text-lg font-semibold">{mockSettlements.reduce((s, x) => s + x.sales, 0)}건</p>
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden tablet:block rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/50">
              <TableHead className="text-xs">정산번호</TableHead>
              <TableHead className="text-xs">정산일</TableHead>
              <TableHead className="text-xs">전자책</TableHead>
              <TableHead className="text-xs text-right">판매 건</TableHead>
              <TableHead className="text-xs text-right">매출액</TableHead>
              
              <TableHead className="text-xs text-right">정산액</TableHead>
              <TableHead className="text-xs text-center">상태</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockSettlements.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="text-xs text-muted-foreground">{s.id}</TableCell>
                <TableCell className="text-sm">{s.date}</TableCell>
                <TableCell className="text-sm font-medium max-w-[200px] truncate">{s.bookTitle}</TableCell>
                <TableCell className="text-sm text-right">{s.sales}건</TableCell>
                <TableCell className="text-sm text-right">{s.amount.toLocaleString()}원</TableCell>
                
                <TableCell className="text-sm text-right font-semibold">{s.net.toLocaleString()}원</TableCell>
                <TableCell className="text-center">
                  <Badge variant="secondary" className="text-xs">{s.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile card list */}
      <div className="tablet:hidden space-y-3">
        {mockSettlements.map((s) => (
          <div key={s.id} className="rounded-xl border border-border p-4 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium truncate flex-1 mr-2">{s.bookTitle}</p>
              <Badge variant="secondary" className="text-xs shrink-0">{s.status}</Badge>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{s.id}</span>
              <span>{s.date}</span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-border">
              <div className="text-xs text-muted-foreground">
                {s.sales}건
              </div>
              <p className="text-sm font-semibold">{s.net.toLocaleString()}원</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── Helpers ─── */
const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    "판매중": "bg-green-100 text-green-700",
    "심사 대기": "bg-yellow-100 text-yellow-700",
    "반려": "bg-red-100 text-red-700",
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${styles[status] || "bg-secondary text-muted-foreground"}`}>
      {status}
    </span>
  );
};

const BookActions = ({ bookId }: { bookId: string }) => {
  const navigate = useNavigate();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-1.5 rounded-md hover:bg-secondary transition-colors shrink-0">
          <MoreVertical className="h-4 w-4 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem className="gap-2 text-sm"><Eye className="h-3.5 w-3.5" /> 미리보기</DropdownMenuItem>
        <DropdownMenuItem className="gap-2 text-sm" onClick={() => navigate(`/instructor/ebook/edit?id=${bookId}`)}><Edit className="h-3.5 w-3.5" /> 편집</DropdownMenuItem>
        <DropdownMenuItem className="gap-2 text-sm text-destructive"><Trash2 className="h-3.5 w-3.5" /> 삭제</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default InstructorDashboard;
