import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from "recharts";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

const dailySalesData = [
  { date: "03-24", amount: 385000, orders: 8 },
  { date: "03-25", amount: 420000, orders: 12 },
  { date: "03-26", amount: 290000, orders: 6 },
  { date: "03-27", amount: 510000, orders: 15 },
  { date: "03-28", amount: 380000, orders: 9 },
  { date: "03-29", amount: 620000, orders: 18 },
  { date: "03-30", amount: 450000, orders: 11 },
];

const trafficData = [
  { date: "03-24", visitors: 403, pageviews: 1250 },
  { date: "03-25", visitors: 375, pageviews: 1180 },
  { date: "03-26", visitors: 376, pageviews: 1090 },
  { date: "03-27", visitors: 352, pageviews: 1020 },
  { date: "03-28", visitors: 332, pageviews: 980 },
  { date: "03-29", visitors: 359, pageviews: 1150 },
  { date: "03-30", visitors: 355, pageviews: 1200 },
];

const topPages = [
  { page: "/", name: "메인", views: 4520 },
  { page: "/store", name: "스토어", views: 3210 },
  { page: "/book/1", name: "유튜브 알고리즘 마스터", views: 1890 },
  { page: "/book/3", name: "ChatGPT 자동화 파이프라인", views: 1450 },
  { page: "/book/2", name: "인스타 릴스로 월 500만원", views: 1120 },
];

const sourceData = [
  { name: "직접 접속", value: 35 },
  { name: "네이버", value: 28 },
  { name: "카카오", value: 18 },
  { name: "구글", value: 12 },
  { name: "기타", value: 7 },
];

const COLORS = ["hsl(var(--primary))", "hsl(var(--primary) / 0.7)", "hsl(var(--primary) / 0.5)", "hsl(var(--primary) / 0.35)", "hsl(var(--primary) / 0.2)"];

interface AdminStatisticsProps {
  view: "sales" | "traffic" | "pages";
}

const AdminStatistics = ({ view }: AdminStatisticsProps) => {
  if (view === "sales") return <SalesStats />;
  if (view === "traffic") return <TrafficStats />;
  return <PageStats />;
};

const SalesStats = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-2 desktop:grid-cols-4 gap-3">
      {[
        { label: "오늘 매출", value: "₩450,000", change: "+12.3%", up: true },
        { label: "이번 주", value: "₩3,055,000", change: "+8.5%", up: true },
        { label: "이번 달", value: "₩12,450,000", change: "+18.2%", up: true },
        { label: "주문 건수", value: "79건", change: "-2.1%", up: false },
      ].map(s => (
        <div key={s.label} className="rounded-xl border border-border bg-background p-4">
          <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
          <p className="text-lg font-bold">{s.value}</p>
          <div className="flex items-center gap-1 mt-1">
            {s.up ? <ArrowUpRight className="h-3 w-3 text-green-500" /> : <ArrowDownRight className="h-3 w-3 text-red-500" />}
            <span className="text-xs text-muted-foreground">{s.change}</span>
          </div>
        </div>
      ))}
    </div>

    <div className="rounded-xl border border-border bg-background p-5">
      <h3 className="font-bold text-sm mb-4">일별 매출</h3>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={dailySalesData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
          <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" tickFormatter={v => `${(v / 10000).toFixed(0)}만`} />
          <Tooltip formatter={(v: number) => `₩${v.toLocaleString()}`} />
          <Area type="monotone" dataKey="amount" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.15)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>

    <div className="rounded-xl border border-border bg-background p-5">
      <h3 className="font-bold text-sm mb-4">일별 주문 수</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={dailySalesData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
          <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
          <Tooltip />
          <Bar dataKey="orders" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const TrafficStats = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-2 desktop:grid-cols-3 gap-3">
      {[
        { label: "오늘 방문자", value: "355명" },
        { label: "최근 7일 방문자", value: "2,552명" },
        { label: "이번 달 방문자", value: "17,382명" },
      ].map(s => (
        <div key={s.label} className="rounded-xl border border-border bg-background p-4">
          <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
          <p className="text-lg font-bold">{s.value}</p>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-1 desktop:grid-cols-2 gap-4">
      <div className="rounded-xl border border-border bg-background p-5">
        <h3 className="font-bold text-sm mb-4">일별 방문자</h3>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={trafficData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
            <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
            <Tooltip />
            <Area type="monotone" dataKey="visitors" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.15)" strokeWidth={2} name="방문자" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-xl border border-border bg-background p-5">
        <h3 className="font-bold text-sm mb-4">유입 경로</h3>
        <div className="flex items-center justify-center">
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={sourceData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name} ${value}%`}>
                {sourceData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => `${v}%`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  </div>
);

const PageStats = () => (
  <div className="space-y-6">
    <div className="rounded-xl border border-border bg-background p-5">
      <h3 className="font-bold text-sm mb-4">일별 페이지뷰</h3>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={trafficData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
          <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
          <Tooltip />
          <Bar dataKey="pageviews" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="페이지뷰" />
        </BarChart>
      </ResponsiveContainer>
    </div>

    <div className="rounded-xl border border-border bg-background p-5">
      <h3 className="font-bold text-sm mb-4">인기 페이지 TOP 5</h3>
      <div className="space-y-0">
        {topPages.map((p, i) => (
          <div key={p.page} className="flex items-center gap-3 py-3 border-b border-border last:border-0">
            <span className="text-lg font-bold text-muted-foreground w-6 text-center">{i + 1}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{p.name}</p>
              <p className="text-xs text-muted-foreground">{p.page}</p>
            </div>
            <span className="text-sm font-semibold">{p.views.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default AdminStatistics;
