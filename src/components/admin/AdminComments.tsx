import { MoreVertical, Flag } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

const mockComments = [
  { id: "1", author: "김민수", content: "정말 유익한 전자책이었습니다! 강력 추천합니다.", target: "유튜브 알고리즘 마스터", date: "2026-03-30 14:22", reported: false },
  { id: "2", author: "이수진", content: "가격 대비 내용이 좀 부실한 것 같아요.", target: "인스타 릴스로 월 500만원", date: "2026-03-30 11:05", reported: false },
  { id: "3", author: "박영호", content: "부적절한 광고 내용이 포함되어 있습니다.", target: "제휴마케팅 완전 가이드", date: "2026-03-29 09:30", reported: true },
  { id: "4", author: "최지은", content: "초보자에게 딱 맞는 내용이에요. 감사합니다.", target: "ChatGPT 자동화 파이프라인", date: "2026-03-28 16:45", reported: false },
  { id: "5", author: "오진우", content: "PDF 열리지 않아요 확인 부탁드립니다.", target: "유튜브 알고리즘 마스터", date: "2026-03-27 10:15", reported: false },
];

const AdminComments = () => (
  <div className="space-y-4">
    <div className="flex items-center gap-3">
      <p className="text-sm text-muted-foreground">
        총 {mockComments.length}개 · 신고 {mockComments.filter(c => c.reported).length}건
      </p>
    </div>

    <div className="hidden tablet:block rounded-xl border border-border bg-background overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-secondary/50">
            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">작성자</th>
            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">내용</th>
            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">대상</th>
            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">날짜</th>
            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">신고</th>
            <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {mockComments.map(c => (
            <tr key={c.id} className={`border-b border-border last:border-0 hover:bg-secondary/30 transition-colors ${c.reported ? "bg-red-50/50" : ""}`}>
              <td className="px-4 py-3 text-sm font-medium">{c.author}</td>
              <td className="px-4 py-3 text-sm max-w-[300px] truncate">{c.content}</td>
              <td className="px-4 py-3 text-sm text-muted-foreground max-w-[150px] truncate">{c.target}</td>
              <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{c.date}</td>
              <td className="px-4 py-3">
                {c.reported && <Flag className="h-3.5 w-3.5 text-red-500" />}
              </td>
              <td className="px-4 py-3 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-1 rounded-lg hover:bg-secondary"><MoreVertical className="h-4 w-4 text-muted-foreground" /></button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="text-sm">숨김</DropdownMenuItem>
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
      {mockComments.map(c => (
        <div key={c.id} className={`rounded-xl border bg-background p-4 space-y-2 ${c.reported ? "border-red-200" : "border-border"}`}>
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">{c.author}</p>
            {c.reported && <Flag className="h-3.5 w-3.5 text-red-500" />}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">{c.content}</p>
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border">
            <span className="truncate">{c.target}</span>
            <span className="whitespace-nowrap ml-2">{c.date}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default AdminComments;
