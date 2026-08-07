import { Plus, MoreVertical, FileText, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

const mockForms = [
  { id: "1", name: "작가 신청서", fields: 8, submissions: 34, lastSubmission: "2026-03-30", status: "활성" },
  { id: "2", name: "고객 만족도 조사", fields: 12, submissions: 156, lastSubmission: "2026-03-29", status: "활성" },
  { id: "3", name: "전자책 심사 요청서", fields: 6, submissions: 18, lastSubmission: "2026-03-28", status: "활성" },
  { id: "4", name: "이벤트 참여 신청", fields: 5, submissions: 230, lastSubmission: "2026-03-15", status: "비활성" },
];

const AdminForms = () => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <p className="text-sm text-muted-foreground">총 {mockForms.length}개</p>
      <Button size="sm" className="gap-1.5 text-xs bg-foreground text-background hover:bg-foreground/90">
        <Plus className="h-3.5 w-3.5" /> 폼 생성
      </Button>
    </div>

    <div className="grid grid-cols-1 tablet:grid-cols-2 gap-3">
      {mockForms.map(f => (
        <div key={f.id} className="rounded-xl border border-border bg-background p-5 space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">{f.name}</p>
                <p className="text-xs text-muted-foreground">{f.fields}개 필드</p>
              </div>
            </div>
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
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              <span>응답 {f.submissions}건</span>
            </div>
            <span className={`inline-block px-2 py-0.5 rounded-full font-medium ${
              f.status === "활성" ? "bg-green-100 text-green-700" : "bg-secondary text-muted-foreground"
            }`}>{f.status}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default AdminForms;
