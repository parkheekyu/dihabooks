import { Plus, MoreVertical, Image, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

const mockPopups = [
  { id: "1", name: "봄맞이 할인 팝업", type: "팝업", position: "중앙", startDate: "2026-03-01", endDate: "2026-04-30", status: "활성", views: 12500 },
  { id: "2", name: "상단 공지 배너", type: "배너", position: "상단", startDate: "2026-03-15", endDate: "2026-03-31", status: "활성", views: 35000 },
  { id: "3", name: "신규 회원 환영 팝업", type: "팝업", position: "중앙", startDate: "2026-01-01", endDate: "2026-12-31", status: "활성", views: 8900 },
  { id: "4", name: "설날 이벤트 배너", type: "배너", position: "메인", startDate: "2026-01-25", endDate: "2026-02-10", status: "만료", views: 22000 },
];

const AdminPopups = () => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <p className="text-sm text-muted-foreground">총 {mockPopups.length}개</p>
      <Button size="sm" className="gap-1.5 text-xs bg-foreground text-background hover:bg-foreground/90">
        <Plus className="h-3.5 w-3.5" /> 생성
      </Button>
    </div>

    <div className="hidden tablet:block rounded-xl border border-border bg-background overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-secondary/50">
            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">이름</th>
            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">유형</th>
            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">위치</th>
            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">기간</th>
            <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">노출</th>
            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">상태</th>
            <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {mockPopups.map(p => (
            <tr key={p.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  {p.type === "팝업" ? <Image className="h-4 w-4 text-muted-foreground" /> : <Megaphone className="h-4 w-4 text-muted-foreground" />}
                  <span className="text-sm font-medium">{p.name}</span>
                </div>
              </td>
              <td className="px-4 py-3">
                <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-secondary text-muted-foreground">{p.type}</span>
              </td>
              <td className="px-4 py-3 text-sm text-muted-foreground">{p.position}</td>
              <td className="px-4 py-3 text-xs text-muted-foreground">{p.startDate} ~ {p.endDate}</td>
              <td className="px-4 py-3 text-sm text-right text-muted-foreground">{p.views.toLocaleString()}</td>
              <td className="px-4 py-3">
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                  p.status === "활성" ? "bg-green-100 text-green-700" : "bg-secondary text-muted-foreground"
                }`}>{p.status}</span>
              </td>
              <td className="px-4 py-3 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-1 rounded-lg hover:bg-secondary"><MoreVertical className="h-4 w-4 text-muted-foreground" /></button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="text-sm">편집</DropdownMenuItem>
                    <DropdownMenuItem className="text-sm">{p.status === "활성" ? "비활성화" : "활성화"}</DropdownMenuItem>
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
      {mockPopups.map(p => (
        <div key={p.id} className="rounded-xl border border-border bg-background p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {p.type === "팝업" ? <Image className="h-4 w-4 text-muted-foreground" /> : <Megaphone className="h-4 w-4 text-muted-foreground" />}
              <p className="text-sm font-medium">{p.name}</p>
            </div>
            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${
              p.status === "활성" ? "bg-green-100 text-green-700" : "bg-secondary text-muted-foreground"
            }`}>{p.status}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{p.type} · {p.position}</span>
            <span>노출 {p.views.toLocaleString()}</span>
          </div>
          <div className="text-xs text-muted-foreground">{p.startDate} ~ {p.endDate}</div>
        </div>
      ))}
    </div>
  </div>
);

export default AdminPopups;
