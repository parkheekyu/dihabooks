import { Search, MoreVertical, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

const mockMembers = [
  { id: "1", name: "김민수", email: "kim@example.com", role: "일반회원", joinDate: "2026-01-15", purchases: 3, status: "활성", lastLogin: "2026-03-30" },
  { id: "2", name: "이수진", email: "lee@example.com", role: "작가", joinDate: "2025-11-02", purchases: 0, status: "활성", lastLogin: "2026-03-29" },
  { id: "3", name: "박영호", email: "park@example.com", role: "일반회원", joinDate: "2026-03-10", purchases: 1, status: "활성", lastLogin: "2026-03-28" },
  { id: "4", name: "최지은", email: "choi@example.com", role: "일반회원", joinDate: "2026-02-28", purchases: 5, status: "정지", lastLogin: "2026-02-20" },
  { id: "5", name: "정하나", email: "jung@example.com", role: "작가", joinDate: "2025-09-20", purchases: 0, status: "활성", lastLogin: "2026-03-30" },
  { id: "6", name: "오진우", email: "oh@example.com", role: "일반회원", joinDate: "2026-03-25", purchases: 2, status: "활성", lastLogin: "2026-03-30" },
];

const RoleBadge = ({ role }: { role: string }) => (
  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
    role === "작가" ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
  }`}>{role}</span>
);

const AdminMembers = () => (
  <div className="space-y-4">
    <div className="flex items-center gap-3 flex-wrap">
      <div className="relative flex-1 min-w-[200px] max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="이름, 이메일로 검색..." className="pl-9 rounded-lg bg-background" />
      </div>
      <Button variant="outline" size="sm" className="gap-1.5 text-xs">
        <Filter className="h-3.5 w-3.5" /> 필터
      </Button>
      <p className="text-sm text-muted-foreground ml-auto">총 {mockMembers.length}명</p>
    </div>

    {/* Desktop table */}
    <div className="hidden tablet:block rounded-xl border border-border bg-background overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-secondary/50">
            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">회원</th>
            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">역할</th>
            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">가입일</th>
            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">최근 로그인</th>
            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">구매</th>
            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">상태</th>
            <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {mockMembers.map(u => (
            <tr key={u.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold">{u.name[0]}</div>
                  <div>
                    <p className="text-sm font-medium">{u.name}</p>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3"><RoleBadge role={u.role} /></td>
              <td className="px-4 py-3 text-sm text-muted-foreground">{u.joinDate}</td>
              <td className="px-4 py-3 text-sm text-muted-foreground">{u.lastLogin}</td>
              <td className="px-4 py-3 text-sm">{u.purchases}건</td>
              <td className="px-4 py-3">
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                  u.status === "활성" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}>{u.status}</span>
              </td>
              <td className="px-4 py-3 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-1 rounded-lg hover:bg-secondary"><MoreVertical className="h-4 w-4 text-muted-foreground" /></button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="text-sm">상세 보기</DropdownMenuItem>
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
      {mockMembers.map(u => (
        <div key={u.id} className="rounded-xl border border-border bg-background p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center text-sm font-bold">{u.name[0]}</div>
              <div>
                <p className="text-sm font-medium">{u.name}</p>
                <p className="text-xs text-muted-foreground">{u.email}</p>
              </div>
            </div>
            <RoleBadge role={u.role} />
          </div>
          <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
            <span>가입: {u.joinDate}</span>
            <span>구매: {u.purchases}건</span>
            <span className={u.status === "활성" ? "text-green-600" : "text-red-600"}>{u.status}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default AdminMembers;
