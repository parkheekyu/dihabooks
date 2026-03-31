import { Search, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const mockInquiries = [
  { id: "Q-001", customer: "김민수", email: "kim@example.com", subject: "환불 요청 관련 문의", date: "2026-03-30", status: "대기" },
  { id: "Q-002", customer: "박영호", email: "park@example.com", subject: "전자책 열람 오류", date: "2026-03-29", status: "답변완료" },
  { id: "Q-003", customer: "최지은", email: "choi@example.com", subject: "결제 수단 변경 문의", date: "2026-03-28", status: "대기" },
  { id: "Q-004", customer: "오진우", email: "oh@example.com", subject: "계정 비밀번호 분실", date: "2026-03-27", status: "답변완료" },
  { id: "Q-005", customer: "한서연", email: "han@example.com", subject: "쿠폰 적용 안됨", date: "2026-03-26", status: "처리중" },
];

const statusColor: Record<string, string> = {
  "대기": "bg-yellow-100 text-yellow-700",
  "처리중": "bg-blue-100 text-blue-700",
  "답변완료": "bg-green-100 text-green-700",
};

const AdminCustomers = () => (
  <div className="space-y-4">
    <div className="flex items-center gap-3 flex-wrap">
      <div className="relative flex-1 min-w-[200px] max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="고객 문의 검색..." className="pl-9 rounded-lg bg-background" />
      </div>
      <p className="text-sm text-muted-foreground ml-auto">
        대기 {mockInquiries.filter(i => i.status === "대기").length}건
      </p>
    </div>

    <div className="hidden tablet:block rounded-xl border border-border bg-background overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-secondary/50">
            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">번호</th>
            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">고객</th>
            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">제목</th>
            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">날짜</th>
            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">상태</th>
            <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {mockInquiries.map(q => (
            <tr key={q.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
              <td className="px-4 py-3 text-xs text-muted-foreground">{q.id}</td>
              <td className="px-4 py-3">
                <p className="text-sm font-medium">{q.customer}</p>
                <p className="text-xs text-muted-foreground">{q.email}</p>
              </td>
              <td className="px-4 py-3 text-sm">{q.subject}</td>
              <td className="px-4 py-3 text-sm text-muted-foreground">{q.date}</td>
              <td className="px-4 py-3">
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[q.status]}`}>{q.status}</span>
              </td>
              <td className="px-4 py-3 text-right">
                <Button size="sm" variant="outline" className="h-7 px-2 text-xs gap-1">
                  <MessageSquare className="h-3 w-3" /> 답변
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <div className="tablet:hidden space-y-3">
      {mockInquiries.map(q => (
        <div key={q.id} className="rounded-xl border border-border bg-background p-4 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium flex-1 truncate mr-2">{q.subject}</p>
            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${statusColor[q.status]}`}>{q.status}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{q.customer} ({q.email})</span>
            <span>{q.date}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default AdminCustomers;
