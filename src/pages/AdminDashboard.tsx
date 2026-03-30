import { useState } from "react";
import {
  LayoutDashboard, BookOpen, Users, DollarSign,
  Megaphone, Settings, ChevronDown, ChevronRight, Menu
} from "lucide-react";
import { cn } from "@/lib/utils";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminOverview from "@/components/admin/AdminOverview";
import AdminUsers from "@/components/admin/AdminUsers";
import AdminEbooks from "@/components/admin/AdminEbooks";
import { Button } from "@/components/ui/button";
import {
  Sheet, SheetContent, SheetTrigger
} from "@/components/ui/sheet";

const mobileMenuItems = [
  { label: "대시보드", id: "overview", icon: LayoutDashboard },
  { label: "전자책", id: "ebooks-all", icon: BookOpen },
  { label: "심사대기", id: "ebooks-pending", icon: BookOpen },
  { label: "회원", id: "users", icon: Users },
  { label: "매출", id: "sales-overview", icon: DollarSign },
  { label: "공지", id: "notices", icon: Megaphone },
  { label: "설정", id: "settings", icon: Settings },
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setMobileOpen(false);
  };

  const getTitle = () => {
    const map: Record<string, string> = {
      overview: "대시보드 홈",
      "ebooks-all": "전체 전자책",
      "ebooks-pending": "심사 대기 전자책",
      users: "회원 관리",
      "sales-overview": "매출 현황",
      "sales-settlement": "정산 관리",
      notices: "공지사항",
      settings: "설정",
    };
    return map[activeTab] || "대시보드";
  };

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <AdminOverview />;
      case "users":
        return <AdminUsers />;
      case "ebooks-all":
        return <AdminEbooks filter="all" />;
      case "ebooks-pending":
        return <AdminEbooks filter="pending" />;
      case "sales-overview":
        return <PlaceholderSection title="매출 현황" desc="매출 차트 및 상세 현황이 표시됩니다." />;
      case "sales-settlement":
        return <PlaceholderSection title="정산 관리" desc="강사별 정산 내역이 표시됩니다." />;
      case "notices":
        return <PlaceholderSection title="공지사항" desc="공지사항 관리 기능이 표시됩니다." />;
      case "settings":
        return <PlaceholderSection title="설정" desc="사이트 설정이 표시됩니다." />;
      default:
        return <AdminOverview />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex">
        {/* Desktop sidebar */}
        <AdminSidebar activeTab={activeTab} onTabChange={handleTabChange} />

        {/* Main content */}
        <div className="flex-1 bg-secondary/30 min-w-0">
          {/* Mobile top bar */}
          <div className="desktop:hidden border-b border-border bg-background px-4 py-3 flex items-center gap-3">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <div className="p-4 border-b border-border">
                  <p className="text-xs text-muted-foreground">관리자</p>
                  <p className="text-sm font-bold mt-0.5">디하북스 어드민</p>
                </div>
                <nav className="p-2 space-y-0.5">
                  {mobileMenuItems.map(item => (
                    <button
                      key={item.id}
                      onClick={() => handleTabChange(item.id)}
                      className={cn(
                        "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors",
                        activeTab === item.id
                          ? "bg-primary text-primary-foreground font-medium"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      )}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
            <h1 className="text-sm font-bold">{getTitle()}</h1>
          </div>

          {/* Desktop header */}
          <div className="hidden desktop:block border-b border-border bg-background px-6 py-4">
            <h1 className="text-lg font-bold">{getTitle()}</h1>
          </div>

          {/* Content */}
          <div className="p-4 desktop:p-6">
            {renderContent()}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

const PlaceholderSection = ({ title, desc }: { title: string; desc: string }) => (
  <div className="rounded-xl border border-border bg-background p-8 text-center">
    <p className="text-lg font-bold">{title}</p>
    <p className="text-sm text-muted-foreground mt-2">{desc}</p>
  </div>
);

export default AdminDashboard;
