import {
  Users, BookOpen, DollarSign, ShieldCheck,
  ArrowUpRight, CheckCircle2, Ban, TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from "recharts";

import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";

const stats = [
  { label: "전체 회원", value: "4,821", change: "+124", icon: Users },
  { label: "전체 전자책", value: "38", change: "+5", icon: BookOpen },
  { label: "이번 달 매출", value: "₩12,450,000", change: "+18.2%", icon: DollarSign },
  { label: "활성 강사", value: "12", change: "+2", icon: ShieldCheck },
];

const chartData = [
  { name: "1주", 매출: 2400000, 판매: 12 },
  { name: "2주", 매출: 3200000, 판매: 18 },
  { name: "3주", 매출: 2800000, 판매: 15 },
  { name: "4주", 매출: 4000000, 판매: 22 },
];

const mockUsers = [
  { id: "1", name: "김민수", email: "kim@example.com", role: "회원", joinDate: "2026-01-15" },
  { id: "2", name: "이수진", email: "lee@example.com", role: "강사", joinDate: "2025-11-02" },
  { id: "3", name: "박영호", email: "park@example.com", role: "회원", joinDate: "2026-03-10" },
  { id: "4", name: "최지은", email: "choi@example.com", role: "회원", joinDate: "2026-02-28" },
];

const pendingEbooks = [
  { id: "3", title: "제휴마케팅 완전 가이드", author: "마케터 박", image: hero1 },
  { id: "4", title: "퇴사 후 월 300만원 비결", author: "프리랜서 후기", image: hero2 },
];

const RoleBadge = ({ role }: { role: string }) => (
  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
    role === "강사" ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
  }`}>{role}</span>
);

const AdminOverview = () => (
  <div className="space-y-6">
    {/* Welcome */}
    <div className="rounded-xl border border-border bg-background p-5">
      <p className="text-muted-foreground text-sm">안녕하세요,</p>
      <p className="text-lg font-bold mt-0.5">관리자님 👋</p>
      <p className="text-xs text-muted-foreground mt-1">2026.3.30 요약</p>
    </div>

    {/* Stats */}
    <div className="grid grid-cols-2 desktop:grid-cols-4 gap-3">
      {stats.map(s => (
        <div key={s.label} className="rounded-xl border border-border bg-background p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">{s.label}</span>
            <s.icon className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-lg font-bold">{s.value}</p>
          <div className="flex items-center gap-1 mt-1">
            <ArrowUpRight className="h-3 w-3 text-green-500" />
            <span className="text-xs text-muted-foreground">이번 달 {s.change}</span>
          </div>
        </div>
      ))}
    </div>

    {/* Charts */}
    <div className="grid grid-cols-1 desktop:grid-cols-2 gap-4">
      <div className="rounded-xl border border-border bg-background p-5">
        <h3 className="font-bold text-sm mb-4">주간 매출</h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
            <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" tickFormatter={v => `${(v / 10000).toFixed(0)}만`} />
            <Tooltip formatter={(v: number) => `₩${v.toLocaleString()}`} />
            <Area type="monotone" dataKey="매출" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.15)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-xl border border-border bg-background p-5">
        <h3 className="font-bold text-sm mb-4">주간 판매 수</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
            <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
            <Tooltip />
            <Bar dataKey="판매" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>

    {/* Bottom panels */}
    <div className="grid grid-cols-1 desktop:grid-cols-2 gap-4">
      {/* Recent members */}
      <div className="rounded-xl border border-border bg-background p-5">
        <h3 className="font-bold text-sm mb-3">최근 가입 회원</h3>
        <div className="space-y-3">
          {mockUsers.map(u => (
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
      <div className="rounded-xl border border-border bg-background p-5">
        <h3 className="font-bold text-sm mb-3">심사 대기 전자책</h3>
        <div className="space-y-3">
          {pendingEbooks.map(book => (
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

export default AdminOverview;
