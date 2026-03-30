import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Users, BookOpen, DollarSign, ShieldCheck, ChevronLeft,
  TrendingUp, ArrowUpRight, Search, MoreVertical, Ban, CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";

const stats = [
  { label: "전체 회원", value: "4,821", change: "+124", icon: Users },
  { label: "전체 전자책", value: "38", change: "+5", icon: BookOpen },
  { label: "이번 달 매출", value: "₩12,450,000", change: "+18.2%", icon: DollarSign },
  { label: "활성 강사", value: "12", change: "+2", icon: ShieldCheck },
];

const mockUsers = [
  { id: "1", name: "김민수", email: "kim@example.com", role: "회원", joinDate: "2026-01-15", purchases: 3, status: "활성" },
  { id: "2", name: "이수진", email: "lee@example.com", role: "강사", joinDate: "2025-11-02", purchases: 0, status: "활성" },
  { id: "3", name: "박영호", email: "park@example.com", role: "회원", joinDate: "2026-03-10", purchases: 1, status: "활성" },
  { id: "4", name: "최지은", email: "choi@example.com", role: "회원", joinDate: "2026-02-28", purchases: 5, status: "정지" },
  { id: "5", name: "정하나", email: "jung@example.com", role: "강사", joinDate: "2025-09-20", purchases: 0, status: "활성" },
];

const mockEbooks = [
  { id: "1", title: "유튜브 알고리즘 마스터", author: "크리에이터 김", price: 19000, sales: 67, status: "승인", image: hero1 },
  { id: "2", title: "인스타 릴스로 월 500만원", author: "인스타 마스터", price: 15000, sales: 52, status: "승인", image: hero2 },
  { id: "3", title: "제휴마케팅 완전 가이드", author: "마케터 박", price: 12000, sales: 12, status: "심사대기", image: hero1 },
  { id: "4", title: "퇴사 후 월 300만원 비결", author: "프리랜서 후기", price: 25000, sales: 0, status: "심사대기", image: hero2 },
];

type Tab = "overview" | "users" | "ebooks";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "대시보드" },
    { id: "users", label: "회원 관리" },
    { id: "ebooks", label: "전자책 관리" },
  ];

  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="container flex h-14 tablet:h-16 items-center gap-3 px-4">
          <Link to="/" className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-destructive text-destructive-foreground flex items-center justify-center text-xs font-bold">A</div>
            <span className="font-bold text-sm tablet:text-base">관리자 대시보드</span>
          </div>
        </div>
      </header>

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
        {activeTab === "overview" && <AdminOverview />}
        {activeTab === "users" && <UsersTab />}
        {activeTab === "ebooks" && <EbooksTab />}
      </main>
    </div>
  );
};

const AdminOverview = () => (
  <div className="space-y-4 tablet:space-y-6">
    <div className="grid grid-cols-2 desktop:grid-cols-4 gap-3 tablet:gap-4">
      {stats.map(s => (
        <div key={s.label} className="rounded-xl border border-border bg-background p-4 tablet:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">{s.label}</span>
            <s.icon className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-lg tablet:text-xl font-bold">{s.value}</p>
          <div className="flex items-center gap-1 mt-1">
            <ArrowUpRight className="h-3 w-3 text-green-500" />
            <span className="text-xs text-muted-foreground">이번 달 {s.change}</span>
          </div>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-1 desktop:grid-cols-2 gap-4 tablet:gap-6">
      {/* Recent users */}
      <div className="rounded-xl border border-border bg-background p-4 tablet:p-5">
        <h3 className="font-bold text-sm mb-3">최근 가입 회원</h3>
        <div className="space-y-3">
          {mockUsers.slice(0, 4).map(u => (
            <div key={u.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold">
                  {u.name[0]}
                </div>
                <div>
                  <p className="text-sm font-medium">{u.name}</p>
                  <p className="text-xs text-muted-foreground">{u.email}</p>
                </div>
              </div>
              <RoleBadge role={u.role} />
            </div>
          ))}
        </div>
      </div>

      {/* Pending ebooks */}
      <div className="rounded-xl border border-border bg-background p-4 tablet:p-5">
        <h3 className="font-bold text-sm mb-3">심사 대기 전자책</h3>
        <div className="space-y-3">
          {mockEbooks.filter(e => e.status === "심사대기").map(book => (
            <div key={book.id} className="flex items-center gap-3">
              <img src={book.image} alt="" className="w-10 h-14 rounded-lg object-cover" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{book.title}</p>
                <p className="text-xs text-muted-foreground">{book.author}</p>
              </div>
              <div className="flex gap-1.5">
                <Button size="sm" variant="outline" className="h-7 w-7 p-0">
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                </Button>
                <Button size="sm" variant="outline" className="h-7 w-7 p-0">
                  <Ban className="h-3.5 w-3.5 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const UsersTab = () => (
  <div className="space-y-4">
    <div className="flex items-center gap-3">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="회원 검색..." className="pl-9 rounded-full bg-background" />
      </div>
      <p className="text-sm text-muted-foreground hidden tablet:block">총 {mockUsers.length}명</p>
    </div>

    <div className="hidden tablet:block rounded-xl border border-border bg-background overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-secondary/50">
            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">회원</th>
            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">역할</th>
            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">가입일</th>
            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">구매</th>
            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">상태</th>
            <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {mockUsers.map(u => (
            <tr key={u.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold">{u.name[0]}</div>
                  <div>
                    <p className="text-sm font-medium">{u.name}</p>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3"><RoleBadge role={u.role} /></td>
              <td className="px-4 py-3 text-sm text-muted-foreground">{u.joinDate}</td>
              <td className="px-4 py-3 text-sm">{u.purchases}건</td>
              <td className="px-4 py-3">
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                  u.status === "활성" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}>{u.status}</span>
              </td>
              <td className="px-4 py-3 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-1 rounded-lg hover:bg-secondary"><MoreVertical className="h-4 w-4 text-muted-foreground" /></button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="text-sm">상세 보기</DropdownMenuItem>
                    <DropdownMenuItem className="text-sm">역할 변경</DropdownMenuItem>
                    <DropdownMenuItem className="text-sm text-destructive">계정 정지</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <div className="tablet:hidden space-y-3">
      {mockUsers.map(u => (
        <div key={u.id} className="rounded-xl border border-border bg-background p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center text-sm font-bold">{u.name[0]}</div>
              <div>
                <p className="text-sm font-medium">{u.name}</p>
                <p className="text-xs text-muted-foreground">{u.email}</p>
              </div>
            </div>
            <RoleBadge role={u.role} />
          </div>
          <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
            <span>가입: {u.joinDate}</span>
            <span>구매: {u.purchases}건</span>
            <span className={u.status === "활성" ? "text-green-600" : "text-red-600"}>{u.status}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const EbooksTab = () => (
  <div className="space-y-4">
    <p className="text-sm text-muted-foreground">전체 {mockEbooks.length}권</p>
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
          {mockEbooks.map(book => (
            <tr key={book.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <img src={book.image} alt="" className="w-10 h-14 rounded-lg object-cover" />
                  <span className="text-sm font-medium">{book.title}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-sm">{book.author}</td>
              <td className="px-4 py-3 text-sm">₩{book.price.toLocaleString()}</td>
              <td className="px-4 py-3 text-sm">{book.sales}권</td>
              <td className="px-4 py-3">
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                  book.status === "승인" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                }`}>{book.status}</span>
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex gap-1.5 justify-end">
                  {book.status === "심사대기" && (
                    <>
                      <Button size="sm" variant="outline" className="h-7 px-2 text-xs gap-1"><CheckCircle2 className="h-3 w-3" /> 승인</Button>
                      <Button size="sm" variant="outline" className="h-7 px-2 text-xs gap-1 text-destructive"><Ban className="h-3 w-3" /> 반려</Button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <div className="tablet:hidden space-y-3">
      {mockEbooks.map(book => (
        <div key={book.id} className="rounded-xl border border-border bg-background p-4">
          <div className="flex gap-3">
            <img src={book.image} alt="" className="w-14 h-20 rounded-lg object-cover shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{book.title}</p>
              <p className="text-xs text-muted-foreground">{book.author}</p>
              <p className="text-sm font-semibold mt-1">₩{book.price.toLocaleString()} · {book.sales}권</p>
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

const RoleBadge = ({ role }: { role: string }) => (
  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
    role === "강사" ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
  }`}>{role}</span>
);

export default AdminDashboard;
