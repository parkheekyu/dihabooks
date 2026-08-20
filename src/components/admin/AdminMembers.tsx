import { useState } from "react";
import { Search, MoreVertical, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

type Member = {
  id: string; name: string; nickname: string; phone: string; email: string;
  role: string; joinDate: string; purchases: number; totalSpent: number;
  status: string; lastLogin: string; recentOrders: { id: string; product: string; date: string; amount: number }[];
};

const mockMembers: Member[] = [
  { id: "1", name: "김민수", nickname: "민수쓰", phone: "010-2841-1063", email: "kim@example.com", role: "일반회원", joinDate: "2026-01-15", purchases: 3, totalSpent: 63000, status: "활성", lastLogin: "2026-03-30",
    recentOrders: [
      { id: "ORD-2026-0512", product: "유튜브 알고리즘 마스터", date: "2026-03-30", amount: 19000 },
      { id: "ORD-2026-0421", product: "제휴마케팅 완전 가이드", date: "2026-02-18", amount: 12000 },
      { id: "ORD-2026-0388", product: "퇴사 후 월 300만원 비결", date: "2026-01-20", amount: 32000 },
    ] },
  { id: "2", name: "이수진", nickname: "수진작가", phone: "010-7712-4408", email: "lee@example.com", role: "작가", joinDate: "2025-11-02", purchases: 0, totalSpent: 0, status: "활성", lastLogin: "2026-03-29", recentOrders: [] },
  { id: "3", name: "박영호", nickname: "영호형", phone: "010-3355-9021", email: "park@example.com", role: "일반회원", joinDate: "2026-03-10", purchases: 1, totalSpent: 12000, status: "활성", lastLogin: "2026-03-28",
    recentOrders: [{ id: "ORD-2026-0509", product: "제휴마케팅 완전 가이드", date: "2026-03-29", amount: 12000 }] },
  { id: "4", name: "최지은", nickname: "지은지은", phone: "010-9084-2277", email: "choi@example.com", role: "일반회원", joinDate: "2026-02-28", purchases: 5, totalSpent: 91000, status: "정지", lastLogin: "2026-02-20",
    recentOrders: [{ id: "ORD-2026-0508", product: "유튜브 알고리즘 마스터", date: "2026-03-28", amount: 19000 }] },
  { id: "5", name: "정하나", nickname: "하나TV", phone: "010-5520-8814", email: "jung@example.com", role: "작가", joinDate: "2025-09-20", purchases: 0, totalSpent: 0, status: "활성", lastLogin: "2026-03-30", recentOrders: [] },
  { id: "6", name: "오진우", nickname: "진우진우", phone: "010-6641-3390", email: "oh@example.com", role: "일반회원", joinDate: "2026-03-25", purchases: 2, totalSpent: 54000, status: "활성", lastLogin: "2026-03-30",
    recentOrders: [{ id: "ORD-2026-0511", product: "ChatGPT 자동화 파이프라인", date: "2026-03-30", amount: 39000 }] },
];

const RoleBadge = ({ role }: { role: string }) => (
  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
    role === "작가" ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
  }`}>{role}</span>
);

const StatusBadge = ({ status }: { status: string }) => (
  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
    status === "활성" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
  }`}>{status}</span>
);

const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex items-start gap-3 py-2 border-b border-border last:border-0">
    <span className="w-24 shrink-0 text-xs text-muted-foreground">{label}</span>
    <span className="text-sm">{value}</span>
  </div>
);

const AdminMembers = () => {
  const [detail, setDetail] = useState<Member | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="이름, 닉네임, 연락처로 검색..." className="pl-9 rounded-lg bg-background" />
        </div>
        <Button variant="outline" size="sm" className="gap-1.5 text-xs">
          <Filter className="h-3.5 w-3.5" /> 필터
        </Button>
        <p className="text-sm text-muted-foreground ml-auto">총 {mockMembers.length}명</p>
      </div>

      {/* Desktop table */}
      <div className="hidden tablet:block rounded-xl border border-border bg-background overflow-x-auto">
        <table className="w-full min-w-[880px]">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">이름 (실명)</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">닉네임</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">연락처</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">역할</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">가입일</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">구매</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">상태</th>
              <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {mockMembers.map((u) => (
              <tr key={u.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold shrink-0">{u.name[0]}</div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{u.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">{u.nickname}</td>
                <td className="px-4 py-3 text-sm tabular-nums">{u.phone}</td>
                <td className="px-4 py-3"><RoleBadge role={u.role} /></td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{u.joinDate}</td>
                <td className="px-4 py-3 text-sm">{u.purchases}건</td>
                <td className="px-4 py-3"><StatusBadge status={u.status} /></td>
                <td className="px-4 py-3 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-1 rounded-lg hover:bg-secondary"><MoreVertical className="h-4 w-4 text-muted-foreground" /></button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="text-sm" onClick={() => setDetail(u)}>상세 보기</DropdownMenuItem>
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

      {/* Mobile cards */}
      <div className="tablet:hidden space-y-3">
        {mockMembers.map((u) => (
          <button key={u.id} onClick={() => setDetail(u)}
            className="w-full text-left rounded-xl border border-border bg-background p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center text-sm font-bold shrink-0">{u.name[0]}</div>
                <div className="min-w-0">
                  <p className="text-sm font-medium">{u.name} <span className="text-muted-foreground font-normal">({u.nickname})</span></p>
                  <p className="text-xs text-muted-foreground tabular-nums">{u.phone}</p>
                </div>
              </div>
              <RoleBadge role={u.role} />
            </div>
            <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
              <span>가입: {u.joinDate}</span>
              <span>구매: {u.purchases}건</span>
              <span className={u.status === "활성" ? "text-green-600" : "text-red-600"}>{u.status}</span>
            </div>
          </button>
        ))}
      </div>

      {/* 상세 보기 */}
      <Dialog open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>회원 상세</DialogTitle>
          </DialogHeader>
          {detail && (
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center text-base font-bold">{detail.name[0]}</div>
                <div>
                  <p className="text-sm font-bold">{detail.name} <span className="text-muted-foreground font-normal">({detail.nickname})</span></p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <RoleBadge role={detail.role} />
                    <StatusBadge status={detail.status} />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold mb-1">기본 정보</h4>
                <Row label="실명" value={detail.name} />
                <Row label="닉네임" value={detail.nickname} />
                <Row label="연락처" value={<span className="tabular-nums">{detail.phone}</span>} />
                <Row label="이메일" value={detail.email} />
                <Row label="가입일" value={detail.joinDate} />
                <Row label="최근 로그인" value={detail.lastLogin} />
              </div>

              <div>
                <h4 className="text-xs font-semibold mb-1">구매 정보</h4>
                <Row label="구매 횟수" value={`${detail.purchases}건`} />
                <Row label="총 결제액" value={`₩${detail.totalSpent.toLocaleString()}`} />
              </div>

              <div>
                <h4 className="text-xs font-semibold mb-2">최근 주문</h4>
                {detail.recentOrders.length === 0 ? (
                  <p className="rounded-lg bg-secondary/60 px-3 py-2.5 text-xs text-muted-foreground">구매 내역이 없습니다.</p>
                ) : (
                  <div className="rounded-lg border border-border divide-y divide-border">
                    {detail.recentOrders.map((o) => (
                      <div key={o.id} className="flex items-center justify-between gap-3 px-3 py-2.5">
                        <div className="min-w-0">
                          <p className="text-sm truncate">{o.product}</p>
                          <p className="text-[11px] text-muted-foreground">{o.date} · #{o.id}</p>
                        </div>
                        <span className="text-sm font-semibold shrink-0">₩{o.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminMembers;
