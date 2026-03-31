import { Plus, MoreVertical, Tag, Percent, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

const mockCoupons = [
  { id: "C-001", name: "신규 가입 10% 할인", code: "WELCOME10", type: "percent", value: 10, minPurchase: 10000, used: 124, total: 500, startDate: "2026-01-01", endDate: "2026-06-30", status: "활성" },
  { id: "C-002", name: "봄맞이 3000원 할인", code: "SPRING3K", type: "fixed", value: 3000, minPurchase: 15000, used: 89, total: 200, startDate: "2026-03-01", endDate: "2026-04-30", status: "활성" },
  { id: "C-003", name: "VIP 20% 할인", code: "VIP20", type: "percent", value: 20, minPurchase: 20000, used: 15, total: 50, startDate: "2026-02-01", endDate: "2026-12-31", status: "활성" },
  { id: "C-004", name: "설날 이벤트", code: "NEWYEAR", type: "percent", value: 15, minPurchase: 10000, used: 300, total: 300, startDate: "2026-01-25", endDate: "2026-02-10", status: "만료" },
];

const AdminPromotions = () => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <p className="text-sm text-muted-foreground">총 {mockCoupons.length}개</p>
      <Button size="sm" className="gap-1.5 text-xs bg-foreground text-background hover:bg-foreground/90">
        <Plus className="h-3.5 w-3.5" /> 쿠폰 생성
      </Button>
    </div>

    <div className="hidden tablet:block rounded-xl border border-border bg-background overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-secondary/50">
            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">쿠폰명</th>
            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">코드</th>
            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">할인</th>
            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">사용</th>
            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">기간</th>
            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">상태</th>
            <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {mockCoupons.map(c => (
            <tr key={c.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
              <td className="px-4 py-3 text-sm font-medium">{c.name}</td>
              <td className="px-4 py-3">
                <code className="px-1.5 py-0.5 rounded bg-secondary text-xs font-mono">{c.code}</code>
              </td>
              <td className="px-4 py-3 text-sm">
                {c.type === "percent" ? `${c.value}%` : `₩${c.value.toLocaleString()}`}
              </td>
              <td className="px-4 py-3 text-sm text-muted-foreground">{c.used}/{c.total}</td>
              <td className="px-4 py-3 text-xs text-muted-foreground">{c.startDate} ~ {c.endDate}</td>
              <td className="px-4 py-3">
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                  c.status === "활성" ? "bg-green-100 text-green-700" : "bg-secondary text-muted-foreground"
                }`}>{c.status}</span>
              </td>
              <td className="px-4 py-3 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-1 rounded-lg hover:bg-secondary"><MoreVertical className="h-4 w-4 text-muted-foreground" /></button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="text-sm">편집</DropdownMenuItem>
                    <DropdownMenuItem className="text-sm">복제</DropdownMenuItem>
                    <DropdownMenuItem className="text-sm text-destructive">삭제</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <div className="tablet:hidden space-y-3">
      {mockCoupons.map(c => (
        <div key={c.id} className="rounded-xl border border-border bg-background p-4 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium flex-1 truncate mr-2">{c.name}</p>
            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${
              c.status === "활성" ? "bg-green-100 text-green-700" : "bg-secondary text-muted-foreground"
            }`}>{c.status}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <code className="px-1.5 py-0.5 rounded bg-secondary font-mono">{c.code}</code>
            <span>·</span>
            <span>{c.type === "percent" ? `${c.value}%` : `₩${c.value.toLocaleString()}`} 할인</span>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border">
            <span>{c.startDate} ~ {c.endDate}</span>
            <span>사용 {c.used}/{c.total}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default AdminPromotions;
