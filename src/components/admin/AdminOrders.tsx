import { useState } from "react";
import { Search, Filter, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type Order = {
  id: string; customer: string; nickname: string; phone: string; email: string;
  product: string; date: string; amount: number; status: string; payment: string;
  paidAt: string; receiptEmail: string; note?: string;
  /** 구매자가 뷰어에 처음 접근한 시각. 접근하는 즉시 기록되며, 없으면 미열람. */
  viewedAt?: string;
};

const mockOrders: Order[] = [
  { id: "ORD-2026-0512", customer: "김민수", nickname: "민수쓰", phone: "010-2841-1063", email: "kim@example.com",
    product: "유튜브 알고리즘 마스터", date: "2026-03-30", amount: 19000, status: "완료", payment: "카카오페이",
    paidAt: "2026-03-30 14:32", receiptEmail: "kim@example.com", viewedAt: "2026-03-30 14:35" },
  { id: "ORD-2026-0511", customer: "오진우", nickname: "진우진우", phone: "010-6641-3390", email: "oh@example.com",
    product: "ChatGPT 자동화 파이프라인", date: "2026-03-30", amount: 39000, status: "완료", payment: "신용카드",
    paidAt: "2026-03-30 09:15", receiptEmail: "oh@example.com", viewedAt: "2026-03-30 21:02" },
  { id: "ORD-2026-0510", customer: "한서연", nickname: "서연", phone: "010-4417-2250", email: "han@example.com",
    product: "인스타 릴스로 월 500만원", date: "2026-03-29", amount: 15000, status: "완료", payment: "카카오페이",
    paidAt: "2026-03-29 21:04", receiptEmail: "han@example.com" },
  { id: "ORD-2026-0509", customer: "박영호", nickname: "영호형", phone: "010-3355-9021", email: "park@example.com",
    product: "제휴마케팅 완전 가이드", date: "2026-03-29", amount: 12000, status: "환불요청", payment: "신용카드",
    paidAt: "2026-03-29 11:48", receiptEmail: "park@example.com", viewedAt: "2026-03-29 12:10", note: "내용이 기대와 달라 환불 요청합니다." },
  { id: "ORD-2026-0508", customer: "최지은", nickname: "지은지은", phone: "010-9084-2277", email: "choi@example.com",
    product: "유튜브 알고리즘 마스터", date: "2026-03-28", amount: 19000, status: "취소", payment: "카카오페이",
    paidAt: "2026-03-28 16:20", receiptEmail: "choi@example.com" },
];
/** 열람 여부는 환불 판단의 근거가 되므로 목록에서 바로 보이게 둔다. */
const ViewedBadge = ({ viewedAt }: { viewedAt?: string }) => (
  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${
    viewedAt ? "bg-blue-100 text-blue-700" : "bg-secondary text-muted-foreground"
  }`}>
    {viewedAt ? "열람" : "미열람"}
  </span>
);

const statusColor: Record<string, string> = {
  "완료": "bg-green-100 text-green-700",
  "환불요청": "bg-yellow-100 text-yellow-700",
  "취소": "bg-red-100 text-red-700",
  "환불완료": "bg-secondary text-muted-foreground",
};

interface AdminOrdersProps {
  filter?: "all" | "refund";
}

const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex items-start gap-3 py-2 border-b border-border last:border-0">
    <span className="w-24 shrink-0 text-xs text-muted-foreground">{label}</span>
    <span className="text-sm">{value}</span>
  </div>
);

const AdminOrders = ({ filter = "all" }: AdminOrdersProps) => {
  const [detail, setDetail] = useState<Order | null>(null);
  // 데모라 화면 상태만 바꾼다. 실제로는 PG 결제 취소와 열람 권한 회수가 함께 돌아야 한다.
  const [refunded, setRefunded] = useState<string[]>([]);
  // 환불은 되돌릴 수 없어 한 번 더 확인받는다.
  const [confirming, setConfirming] = useState(false);

  const statusOf = (o: Order) => (refunded.includes(o.id) ? "환불완료" : o.status);
  const closeDetail = () => { setDetail(null); setConfirming(false); };
  const doRefund = (o: Order) => {
    setRefunded((prev) => (prev.includes(o.id) ? prev : [...prev, o.id]));
    setConfirming(false);
  };
  const filtered = filter === "refund"
    ? mockOrders.filter(o => o.status === "환불요청" || o.status === "취소" || o.status === "환불완료")
    : mockOrders;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="주문번호, 고객명, 이메일 검색..." className="pl-9 rounded-lg bg-background" />
        </div>
        <Button variant="outline" size="sm" className="gap-1.5 text-xs">
          <Filter className="h-3.5 w-3.5" /> 필터
        </Button>
        <p className="text-sm text-muted-foreground ml-auto">{filtered.length}건</p>
      </div>

      <div className="hidden tablet:block rounded-xl border border-border bg-background overflow-x-auto">
        <table className="w-full min-w-[1330px]">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 whitespace-nowrap">주문번호</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 whitespace-nowrap">구매자</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 whitespace-nowrap">연락처</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 whitespace-nowrap">이메일</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 whitespace-nowrap">상품</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 whitespace-nowrap">결제</th>
              <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">금액</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 whitespace-nowrap">날짜</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 whitespace-nowrap">열람</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 whitespace-nowrap">상태</th>
              <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(o => (
              <tr key={o.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{o.id}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <p className="text-sm">{o.customer}</p>
                  <p className="text-xs text-muted-foreground">{o.nickname}</p>
                </td>
                <td className="px-4 py-3 text-sm tabular-nums whitespace-nowrap">{o.phone}</td>
                <td className="px-4 py-3 text-sm whitespace-nowrap" title={o.email}>{o.email}</td>
                <td className="px-4 py-3 text-sm font-medium max-w-[180px] truncate">{o.product}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{o.payment}</td>
                <td className="px-4 py-3 text-sm text-right font-semibold">₩{o.amount.toLocaleString()}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">{o.date}</td>
                <td className="px-4 py-3 whitespace-nowrap"><ViewedBadge viewedAt={o.viewedAt} /></td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[statusOf(o)] || "bg-secondary text-muted-foreground"}`}>{statusOf(o)}</span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex gap-1.5 justify-end">
                    <Button size="sm" variant="outline" className="h-7 px-2 text-xs" onClick={() => setDetail(o)}>상세</Button>
                    {o.status === "환불요청" && (
                      <>
                        <Button size="sm" variant="outline" className="h-7 px-2 text-xs">승인</Button>
                        <Button size="sm" variant="outline" className="h-7 px-2 text-xs text-destructive">거절</Button>
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
        {filtered.map(o => (
          <div key={o.id} className="rounded-xl border border-border bg-background p-4 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium flex-1 truncate mr-2">{o.product}</p>
              <span className="flex items-center gap-1.5 shrink-0">
                <ViewedBadge viewedAt={o.viewedAt} />
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[statusOf(o)] || "bg-secondary text-muted-foreground"}`}>{statusOf(o)}</span>
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="truncate mr-2">{o.id} · {o.customer} · {o.phone}</span>
              <span className="shrink-0">{o.date}</span>
            </div>
            <p className="text-xs text-muted-foreground truncate">{o.email}</p>
            <div className="flex items-center justify-between pt-1 border-t border-border">
              <span className="text-xs text-muted-foreground">{o.payment}</span>
              <p className="text-sm font-semibold">₩{o.amount.toLocaleString()}</p>
            </div>
            <div className="flex gap-2 pt-1">
              <Button size="sm" variant="outline" className="flex-1 h-7 text-xs" onClick={() => setDetail(o)}>상세 보기</Button>
              {o.status === "환불요청" && (
                <>
                  <Button size="sm" variant="outline" className="flex-1 h-7 text-xs">환불 승인</Button>
                  <Button size="sm" variant="outline" className="flex-1 h-7 text-xs text-destructive">거절</Button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 주문 상세 */}
      <Dialog open={!!detail} onOpenChange={(o) => !o && closeDetail()}>
        <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>주문 상세</DialogTitle></DialogHeader>
          {detail && (
            <div className="space-y-5">
              <div>
                <h4 className="text-xs font-semibold mb-1">구매자</h4>
                <Row label="실명" value={detail.customer} />
                <Row label="닉네임" value={detail.nickname} />
                <Row label="연락처" value={<span className="tabular-nums">{detail.phone}</span>} />
                <Row label="이메일" value={detail.email} />
              </div>
              <div>
                <h4 className="text-xs font-semibold mb-1">주문 정보</h4>
                <Row label="주문번호" value={detail.id} />
                <Row label="상품" value={detail.product} />
                <Row label="결제수단" value={detail.payment} />
                <Row label="결제금액" value={`₩${detail.amount.toLocaleString()}`} />
                <Row label="결제일시" value={detail.paidAt} />
                <Row label="영수증 발송" value={detail.receiptEmail} />
                <Row label="열람" value={
                  detail.viewedAt
                    ? <span className="flex items-center gap-2"><ViewedBadge viewedAt={detail.viewedAt} /><span className="text-xs text-muted-foreground">{detail.viewedAt} 최초 열람</span></span>
                    : <ViewedBadge />
                } />
                <Row label="상태" value={
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[statusOf(detail)] || "bg-secondary text-muted-foreground"}`}>{statusOf(detail)}</span>
                } />
              </div>
              {detail.note && (
                <div>
                  <h4 className="text-xs font-semibold mb-2">요청 사유</h4>
                  <p className="rounded-lg bg-secondary/60 px-3 py-2.5 text-sm">{detail.note}</p>
                </div>
              )}

              {/* 환불 처리 */}
              <div className="border-t border-border pt-4">
                {statusOf(detail) === "환불완료" ? (
                  <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    환불이 완료된 주문입니다.
                  </p>
                ) : confirming ? (
                  <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-3">
                    <p className="flex items-start gap-1.5 text-sm text-foreground">
                      <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0 text-destructive" />
                      <span>
                        ₩{detail.amount.toLocaleString()}을 환불합니다. 결제가 취소되고 구매자의
                        열람 권한이 회수되며, 되돌릴 수 없습니다.
                      </span>
                    </p>
                    <div className="flex justify-end gap-2 mt-3">
                      <Button size="sm" variant="outline" className="text-xs" onClick={() => setConfirming(false)}>
                        취소
                      </Button>
                      <Button size="sm" className="text-xs bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => doRefund(detail)}>
                        환불 확정
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs text-muted-foreground">
                      결제를 취소하고 구매자의 열람 권한을 회수합니다.
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs text-destructive border-destructive/40 hover:bg-destructive/10 shrink-0"
                      onClick={() => setConfirming(true)}
                    >
                      환불 처리
                    </Button>
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

export default AdminOrders;
