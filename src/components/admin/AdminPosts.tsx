import { Plus, MoreVertical, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

const mockPosts = [
  { id: "1", title: "디하북스 오픈 안내", category: "공지사항", author: "관리자", date: "2026-03-28", views: 1250, status: "게시중" },
  { id: "2", title: "3월 이벤트: 전 상품 10% 할인", category: "이벤트", author: "관리자", date: "2026-03-25", views: 890, status: "게시중" },
  { id: "3", title: "전자책 제작 가이드", category: "가이드", author: "이매니저", date: "2026-03-20", views: 542, status: "게시중" },
  { id: "4", title: "서비스 이용약관 변경 안내", category: "공지사항", author: "관리자", date: "2026-03-15", views: 320, status: "비공개" },
  { id: "5", title: "판매자 등록 방법 안내", category: "가이드", author: "박에디터", date: "2026-03-10", views: 678, status: "게시중" },
];

const AdminPosts = () => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <p className="text-sm text-muted-foreground">총 {mockPosts.length}개</p>
      <Button size="sm" className="gap-1.5 text-xs bg-foreground text-background hover:bg-foreground/90">
        <Plus className="h-3.5 w-3.5" /> 새 게시물
      </Button>
    </div>

    <div className="hidden tablet:block rounded-xl border border-border bg-background overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-secondary/50">
            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">제목</th>
            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">카테고리</th>
            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">작성자</th>
            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">작성일</th>
            <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">조회수</th>
            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">상태</th>
            <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {mockPosts.map(p => (
            <tr key={p.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
              <td className="px-4 py-3 text-sm font-medium max-w-[250px] truncate">{p.title}</td>
              <td className="px-4 py-3">
                <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-secondary text-muted-foreground">{p.category}</span>
              </td>
              <td className="px-4 py-3 text-sm text-muted-foreground">{p.author}</td>
              <td className="px-4 py-3 text-sm text-muted-foreground">{p.date}</td>
              <td className="px-4 py-3 text-sm text-right text-muted-foreground">{p.views.toLocaleString()}</td>
              <td className="px-4 py-3">
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                  p.status === "게시중" ? "bg-green-100 text-green-700" : "bg-secondary text-muted-foreground"
                }`}>{p.status}</span>
              </td>
              <td className="px-4 py-3 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-1 rounded-lg hover:bg-secondary"><MoreVertical className="h-4 w-4 text-muted-foreground" /></button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="text-sm">편집</DropdownMenuItem>
                    <DropdownMenuItem className="text-sm">{p.status === "게시중" ? "비공개" : "게시"}</DropdownMenuItem>
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
      {mockPosts.map(p => (
        <div key={p.id} className="rounded-xl border border-border bg-background p-4 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium flex-1 truncate mr-2">{p.title}</p>
            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${
              p.status === "게시중" ? "bg-green-100 text-green-700" : "bg-secondary text-muted-foreground"
            }`}>{p.status}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{p.category} · {p.author}</span>
            <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {p.views.toLocaleString()}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default AdminPosts;
