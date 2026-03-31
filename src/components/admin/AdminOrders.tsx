import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const mockOrders = [
  { id: "ORD-2026-0512", customer: "김민수", product: "유튜브 알고리즘 마스터", date: "2026-03-30", amount: 19000, status: "완료", payment: "카카오페이" },
  { id: "ORD-2026-0511", customer: "오진우", product: "ChatGPT 자동화 파이프라인", date: "2026-03-30", amount: 39000, status: "완료", payment: "신용카드" },
  { id: "ORD-2026-0510", customer: "한서연", product: "인스타 릴스로 월 500만원", date: "2026-03-29", amount: 15000, status: "완료", payment: "카카오페이" },
  { id: "ORD-2026-0509", customer: "박영호", product: "제휴마케팅 완전 가이드", date: "2026-03-29", amount: 12000, status: "환불요청", payment: "신용카드" },
  { id: "ORD-2026-0508", customer: "최지은", product: "유튜브 알고리즘 마스터", date: "2026-03-28", amount: 19000, status: "취소", payment: "카카오페이" },
];

const statusColor: Record<string, string> = {
  "완료": "bg-green-100 text-green-700",
  "환불요청": "bg-yellow-100 text-yellow-700",
  "취소": "bg-red-100 text-red-700",
  "환불완료": "bg-secondary text-muted-foreground",
};

interface AdminOrdersProps {
  filter?: "all" | "refund";
}

const AdminOrders = ({ filter = "all" }: AdminOrdersProps) => {
  const filtered = filter === "refund"
    ? mockOrders.filter(o => o.status === "환불요청" || o.status === "취소" || o.status === "환불완료")
    : mockOrders;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="주문번호, 고객명 검색..." className="pl-9 rounded-lg bg-background" />
        </div>
        <Button variant="outline" size="sm" className="gap-1.5 text-xs">
          <Filter className="h-3.5 w-3.5" /> 필터
        </Button>
        <p className="text-sm text-muted-foreground ml-auto">{filtered.length}건</p>
      </div>

      <div className="hidden tablet:block rounded-xl border border-border bg-background overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">주문번호</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">고객</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">상품</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">결제</th>
              <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">금액</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">날짜</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">상태</th>
              <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(o => (
              <tr key={o.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                <td className="px-4 py-3 text-xs text-muted-foreground">{o.id}</td>
                <td className="px-4 py-3 text-sm">{o.customer}</td>
                <td className="px-4 py-3 text-sm font-medium max-w-[180px] truncate">{o.product}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{o.payment}</td>
                <td className="px-4 py-3 text-sm text-right font-semibold">₩{o.amount.toLocaleString()}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{o.date}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[o.status] || "bg-secondary text-muted-foreground"}`}>{o.status}</span>
                </td>
                <td className="px-4 py-3 text-right">
                  {o.status === "환불요청" && (
                    <div className="flex gap-1.5 justify-end">
                      <Button size="sm" variant="outline" className="h-7 px-2 text-xs">승인</Button>
                      <Button size="sm" variant="outline" className="h-7 px-2 text-xs text-destructive">거절</Button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="tablet:hidden space-y-3">
        {filtered.map(o => (
          <div key={o.id} className="rounded-xl border border-border bg-background p-4 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium flex-1 truncate mr-2">{o.product}</p>
              <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${statusColor[o.status] || "bg-secondary text-muted-foreground"}`}>{o.status}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{o.id} · {o.customer}</span>
              <span>{o.date}</span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-border">
              <span className="text-xs text-muted-foreground">{o.payment}</span>
              <p className="text-sm font-semibold">₩{o.amount.toLocaleString()}</p>
            </div>
            {o.status === "환불요청" && (
              <div className="flex gap-2 pt-1">
                <Button size="sm" variant="outline" className="flex-1 h-7 text-xs">환불 승인</Button>
                <Button size="sm" variant="outline" className="flex-1 h-7 text-xs text-destructive">거절</Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOrders;
