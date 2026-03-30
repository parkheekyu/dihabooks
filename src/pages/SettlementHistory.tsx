import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AccountSidebar from "@/components/AccountSidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const mockSettlements = [
  { id: "S-2026-0301", date: "2026.03.01", bookTitle: "인스타그램 마케팅 완전정복", sales: 12, amount: 156000, fee: 23400, net: 132600, status: "완료" as const },
  { id: "S-2026-0201", date: "2026.02.01", bookTitle: "유튜브 수익화 전략", sales: 8, amount: 104000, fee: 15600, net: 88400, status: "완료" as const },
  { id: "S-2026-0101", date: "2026.01.01", bookTitle: "제휴마케팅 입문 가이드", sales: 5, amount: 49500, fee: 7425, net: 42075, status: "완료" as const },
  { id: "S-2025-1201", date: "2025.12.01", bookTitle: "AI 자동화로 월 100만원", sales: 20, amount: 396000, fee: 59400, net: 336600, status: "완료" as const },
  { id: "S-2025-1101", date: "2025.11.01", bookTitle: "인스타그램 마케팅 완전정복", sales: 3, amount: 39000, fee: 5850, net: 33150, status: "완료" as const },
];

const SettlementHistory = () => {
  const totalNet = mockSettlements.reduce((sum, s) => sum + s.net, 0);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container px-4 py-6 tablet:py-10">
        <div className="flex gap-10">
          <AccountSidebar />
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold mb-1">정산 내역</h1>
            <p className="text-sm text-muted-foreground mb-6">
              판매 수익 정산 내역을 확인하세요.
            </p>

            {/* Summary card */}
            <div className="rounded-xl border border-border bg-secondary/30 p-5 mb-6 flex flex-col tablet:flex-row tablet:items-center gap-4">
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-1">누적 정산 금액</p>
                <p className="text-2xl font-bold">{totalNet.toLocaleString()}원</p>
              </div>
              <div className="flex gap-6">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">총 판매 건수</p>
                  <p className="text-lg font-semibold">{mockSettlements.reduce((s, x) => s + x.sales, 0)}건</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">총 수수료</p>
                  <p className="text-lg font-semibold">{mockSettlements.reduce((s, x) => s + x.fee, 0).toLocaleString()}원</p>
                </div>
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
                    <TableHead className="text-xs text-right">수수료</TableHead>
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
                      <TableCell className="text-sm text-right text-muted-foreground">{s.fee.toLocaleString()}원</TableCell>
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
                      {s.sales}건 · 수수료 {s.fee.toLocaleString()}원
                    </div>
                    <p className="text-sm font-semibold">{s.net.toLocaleString()}원</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SettlementHistory;
