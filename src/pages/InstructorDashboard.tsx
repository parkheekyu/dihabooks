import { useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen, TrendingUp, DollarSign, Users, Plus, MoreVertical,
  Eye, Edit, Trash2, BarChart3, ArrowUpRight, ArrowDownRight, ChevronLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";

const stats = [
  { label: "총 판매 수익", value: "₩3,240,000", change: "+12.5%", up: true, icon: DollarSign },
  { label: "총 판매량", value: "162권", change: "+8.3%", up: true, icon: TrendingUp },
  { label: "등록 전자책", value: "5권", change: "0", up: true, icon: BookOpen },
  { label: "구독자 수", value: "1,247", change: "+3.1%", up: true, icon: Users },
];

const mockBooks = [
  { id: "1", title: "유튜브 알고리즘 마스터", price: 19000, sales: 67, revenue: 1273000, status: "판매중", image: hero1 },
  { id: "2", title: "인스타 릴스로 월 500만원", price: 15000, sales: 52, revenue: 780000, status: "판매중", image: hero2 },
  { id: "3", title: "ChatGPT 자동화 파이프라인", price: 39000, sales: 31, revenue: 1209000, status: "판매중", image: hero3 },
  { id: "4", title: "제휴마케팅 완전 가이드", price: 12000, sales: 12, revenue: 144000, status: "심사중", image: hero1 },
  { id: "5", title: "퇴사 후 월 300만원 비결", price: 25000, sales: 0, revenue: 0, status: "작성중", image: hero2 },
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

type Tab = "overview" | "books" | "sales";

const InstructorDashboard = () => {
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "대시보드" },
    { id: "books", label: "전자책 관리" },
    { id: "sales", label: "판매 내역" },
  ];

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="container flex h-14 tablet:h-16 items-center gap-3 px-4">
          <Link to="/" className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">D</div>
            <span className="font-bold text-sm tablet:text-base">강사 대시보드</span>
          </div>
          <div className="ml-auto">
            <Button size="sm" className="rounded-full gap-1.5 text-xs">
              <Plus className="h-3.5 w-3.5" /> 새 전자책
            </Button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-border bg-background">
        <div className="container px-4">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="container px-4 py-4 tablet:py-6">
        {activeTab === "overview" && <OverviewTab />}
        {activeTab === "books" && <BooksTab />}
        {activeTab === "sales" && <SalesTab />}
      </main>
    </div>
  );
};

/* ─── Overview ─── */
const OverviewTab = () => (
  <div className="space-y-4 tablet:space-y-6">
    {/* Stats */}
    <div className="grid grid-cols-2 desktop:grid-cols-4 gap-3 tablet:gap-4">
      {stats.map(s => (
        <div key={s.label} className="rounded-xl border border-border bg-background p-4 tablet:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">{s.label}</span>
            <s.icon className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-lg tablet:text-xl font-bold">{s.value}</p>
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

    <div className="grid grid-cols-1 desktop:grid-cols-5 gap-4 tablet:gap-6">
      {/* Chart */}
      <div className="desktop:col-span-3 rounded-xl border border-border bg-background p-4 tablet:p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-sm">월별 매출 추이</h3>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex items-end gap-2 tablet:gap-3 h-40 tablet:h-48">
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
      <div className="desktop:col-span-2 rounded-xl border border-border bg-background p-4 tablet:p-5">
        <h3 className="font-bold text-sm mb-3">최근 판매</h3>
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
    </div>

    {/* Top books */}
    <div className="rounded-xl border border-border bg-background p-4 tablet:p-5">
      <h3 className="font-bold text-sm mb-3">인기 전자책</h3>
      <div className="space-y-3">
        {mockBooks.filter(b => b.sales > 0).sort((a,b) => b.sales - a.sales).slice(0,3).map((book, i) => (
          <div key={book.id} className="flex items-center gap-3">
            <span className="text-lg font-bold text-muted-foreground w-6 text-center">{i+1}</span>
            <img src={book.image} alt="" className="w-10 h-14 tablet:w-12 tablet:h-16 rounded-lg object-cover" />
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
const BooksTab = () => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <p className="text-sm text-muted-foreground">총 {mockBooks.length}권의 전자책</p>
      <Button size="sm" className="rounded-full gap-1.5 text-xs">
        <Plus className="h-3.5 w-3.5" /> 새 전자책
      </Button>
    </div>

    {/* Mobile: Card layout / Desktop: Table */}
    <div className="hidden tablet:block rounded-xl border border-border bg-background overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-secondary/50">
            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">전자책</th>
            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">가격</th>
            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">판매량</th>
            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">수익</th>
            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">상태</th>
            <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {mockBooks.map(book => (
            <tr key={book.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <img src={book.image} alt="" className="w-10 h-14 rounded-lg object-cover" />
                  <span className="text-sm font-medium">{book.title}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-sm">₩{book.price.toLocaleString()}</td>
              <td className="px-4 py-3 text-sm">{book.sales}권</td>
              <td className="px-4 py-3 text-sm font-medium">₩{book.revenue.toLocaleString()}</td>
              <td className="px-4 py-3">
                <StatusBadge status={book.status} />
              </td>
              <td className="px-4 py-3 text-right">
                <BookActions />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Mobile cards */}
    <div className="tablet:hidden space-y-3">
      {mockBooks.map(book => (
        <div key={book.id} className="rounded-xl border border-border bg-background p-4">
          <div className="flex gap-3">
            <img src={book.image} alt="" className="w-14 h-20 rounded-lg object-cover shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium truncate">{book.title}</p>
                <BookActions />
              </div>
              <p className="text-sm text-primary font-semibold mt-1">₩{book.price.toLocaleString()}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-xs text-muted-foreground">{book.sales}권 판매</span>
                <span className="text-xs text-muted-foreground">₩{book.revenue.toLocaleString()}</span>
              </div>
              <div className="mt-2">
                <StatusBadge status={book.status} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

/* ─── Sales History ─── */
const SalesTab = () => (
  <div className="space-y-4">
    <p className="text-sm text-muted-foreground">최근 판매 내역</p>

    <div className="hidden tablet:block rounded-xl border border-border bg-background overflow-hidden">
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
    <div className="tablet:hidden space-y-3">
      {recentSales.map((sale, i) => (
        <div key={i} className="rounded-xl border border-border bg-background p-4">
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

/* ─── Helpers ─── */
const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    "판매중": "bg-green-100 text-green-700",
    "심사중": "bg-yellow-100 text-yellow-700",
    "작성중": "bg-secondary text-muted-foreground",
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${styles[status] || styles["작성중"]}`}>
      {status}
    </span>
  );
};

const BookActions = () => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <button className="p-1 rounded-lg hover:bg-secondary transition-colors">
        <MoreVertical className="h-4 w-4 text-muted-foreground" />
      </button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem className="gap-2 text-sm"><Eye className="h-3.5 w-3.5" /> 미리보기</DropdownMenuItem>
      <DropdownMenuItem className="gap-2 text-sm"><Edit className="h-3.5 w-3.5" /> 수정</DropdownMenuItem>
      <DropdownMenuItem className="gap-2 text-sm text-destructive"><Trash2 className="h-3.5 w-3.5" /> 삭제</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

export default InstructorDashboard;
