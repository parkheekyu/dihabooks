import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, BookOpen, Users, DollarSign,
  Megaphone, Settings, ChevronDown, ChevronRight
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type MenuItem = {
  label: string;
  icon: React.ElementType;
  id: string;
  children?: { label: string; id: string }[];
};

const menuItems: MenuItem[] = [
  { label: "대시보드 홈", icon: LayoutDashboard, id: "overview" },
  {
    label: "전자책 관리", icon: BookOpen, id: "ebooks",
    children: [
      { label: "전체 전자책", id: "ebooks-all" },
      { label: "심사 대기", id: "ebooks-pending" },
    ],
  },
  { label: "회원 관리", icon: Users, id: "users" },
  {
    label: "매출/정산", icon: DollarSign, id: "sales",
    children: [
      { label: "매출 현황", id: "sales-overview" },
      { label: "정산 관리", id: "sales-settlement" },
    ],
  },
  { label: "공지사항", icon: Megaphone, id: "notices" },
  { label: "설정", icon: Settings, id: "settings" },
];

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const AdminSidebar = ({ activeTab, onTabChange }: AdminSidebarProps) => {
  const [expanded, setExpanded] = useState<string[]>(["ebooks", "sales"]);

  const toggleExpand = (id: string) => {
    setExpanded(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  return (
    <aside className="w-56 shrink-0 border-r border-border bg-background min-h-[calc(100vh-64px)] hidden desktop:block">
      <div className="p-4 border-b border-border">
        <p className="text-xs text-muted-foreground">관리자</p>
        <p className="text-sm font-bold mt-0.5">디하북스 어드민</p>
      </div>
      <nav className="p-2 space-y-0.5">
        {menuItems.map(item => {
          const isActive = activeTab === item.id || item.children?.some(c => activeTab === c.id);
          const isExpanded = expanded.includes(item.id);
          const hasChildren = !!item.children;

          return (
            <div key={item.id}>
              <button
                onClick={() => {
                  if (hasChildren) {
                    toggleExpand(item.id);
                    if (!isActive) onTabChange(item.children![0].id);
                  } else {
                    onTabChange(item.id);
                  }
                }}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground font-medium"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                <span className="flex-1 text-left">{item.label}</span>
                {hasChildren && (
                  isExpanded
                    ? <ChevronDown className="h-3.5 w-3.5" />
                    : <ChevronRight className="h-3.5 w-3.5" />
                )}
              </button>
              {hasChildren && isExpanded && (
                <div className="ml-6 mt-0.5 space-y-0.5">
                  {item.children!.map(child => (
                    <button
                      key={child.id}
                      onClick={() => onTabChange(child.id)}
                      className={cn(
                        "w-full text-left px-3 py-1.5 rounded-md text-xs transition-colors",
                        activeTab === child.id
                          ? "text-primary font-medium bg-primary/5"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {child.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
