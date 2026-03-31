import { MoreVertical, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

const mockStaff = [
  { id: "1", name: "관리자", email: "admin@dihabooks.com", role: "최고관리자", lastLogin: "2026-03-30 14:22", status: "활성" },
  { id: "2", name: "이매니저", email: "manager@dihabooks.com", role: "운영매니저", lastLogin: "2026-03-30 11:05", status: "활성" },
  { id: "3", name: "박에디터", email: "editor@dihabooks.com", role: "콘텐츠 관리자", lastLogin: "2026-03-29 09:30", status: "활성" },
  { id: "4", name: "김상담", email: "cs@dihabooks.com", role: "고객상담", lastLogin: "2026-03-28 16:45", status: "비활성" },
];

const AdminStaff = () => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <p className="text-sm text-muted-foreground">총 {mockStaff.length}명</p>
      <Button size="sm" className="gap-1.5 text-xs bg-foreground text-background hover:bg-foreground/90">
        <Plus className="h-3.5 w-3.5" /> 운영진 추가
      </Button>
    </div>

    <div className="hidden tablet:block rounded-xl border border-border bg-background overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-secondary/50">
            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">이름</th>
            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">역할</th>
            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">최근 로그인</th>
            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">상태</th>
            <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {mockStaff.map(s => (
            <tr key={s.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{s.name[0]}</div>
                  <div>
                    <p className="text-sm font-medium">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.email}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">{s.role}</span>
              </td>
              <td className="px-4 py-3 text-sm text-muted-foreground">{s.lastLogin}</td>
              <td className="px-4 py-3">
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                  s.status === "활성" ? "bg-green-100 text-green-700" : "bg-secondary text-muted-foreground"
                }`}>{s.status}</span>
              </td>
              <td className="px-4 py-3 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-1 rounded-lg hover:bg-secondary"><MoreVertical className="h-4 w-4 text-muted-foreground" /></button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="text-sm">권한 수정</DropdownMenuItem>
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
      {mockStaff.map(s => (
        <div key={s.id} className="rounded-xl border border-border bg-background p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">{s.name[0]}</div>
              <div>
                <p className="text-sm font-medium">{s.name}</p>
                <p className="text-xs text-muted-foreground">{s.email}</p>
              </div>
            </div>
            <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">{s.role}</span>
          </div>
          <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
            <span>최근: {s.lastLogin}</span>
            <span className={s.status === "활성" ? "text-green-600" : "text-muted-foreground"}>{s.status}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default AdminStaff;
