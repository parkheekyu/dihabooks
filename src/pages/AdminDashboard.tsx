import { useState } from "react";
import {
  LayoutDashboard, Users, ShieldCheck, HeadphonesIcon,
  Package, ShoppingCart, Tag, FileText, MessageSquare,
  ClipboardList, Image, BarChart3, Settings, Menu
} from "lucide-react";
import { cn } from "@/lib/utils";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminSidebar, { menuItems } from "@/components/admin/AdminSidebar";
import AdminOverview from "@/components/admin/AdminOverview";
import AdminMembers from "@/components/admin/AdminMembers";
import AdminStaff from "@/components/admin/AdminStaff";
import AdminCustomers from "@/components/admin/AdminCustomers";
import AdminEbooks from "@/components/admin/AdminEbooks";
import AdminOrders from "@/components/admin/AdminOrders";
import AdminPromotions from "@/components/admin/AdminPromotions";
import AdminPosts from "@/components/admin/AdminPosts";
import AdminComments from "@/components/admin/AdminComments";
import AdminForms from "@/components/admin/AdminForms";
import AdminPopups from "@/components/admin/AdminPopups";
import AdminStatistics from "@/components/admin/AdminStatistics";
import AdminSettings from "@/components/admin/AdminSettings";
import { Button } from "@/components/ui/button";
import {
  Sheet, SheetContent, SheetTrigger
} from "@/components/ui/sheet";

// Flatten menu items for mobile
const flatMenuItems = menuItems.flatMap(item =>
  item.children ? item.children.map(c => ({ ...c, icon: item.icon })) : [{ id: item.id, label: item.label, icon: item.icon }]
);

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setMobileOpen(false);
  };

  const getTitle = () => {
    const map: Record<string, string> = {
      overview: "대시보드",
      members: "멤버 목록",
      staff: "운영진",
      customers: "고객",
      "products-all": "전체 상품",
      "products-pending": "심사 대기",
      "orders-all": "주문 목록",
      "orders-refund": "환불/취소",
      promotions: "프로모션",
      posts: "게시물",
      comments: "댓글",
      forms: "입력폼 관리",
      popups: "팝업/배너",
      "stats-sales": "매출 분석",
      "stats-traffic": "유입 분석",
      "stats-pages": "페이지 분석",
      "settings-general": "일반 설정",
      "settings-seo": "SEO 설정",
      "settings-header": "헤더/푸터 설정",
    };
    return map[activeTab] || "대시보드";
  };

  const renderContent = () => {
    switch (activeTab) {
      case "overview": return <AdminOverview />;
      case "members": return <AdminMembers />;
      case "staff": return <AdminStaff />;
      case "customers": return <AdminCustomers />;
      case "products-all": return <AdminEbooks filter="all" />;
      case "products-pending": return <AdminEbooks filter="pending" />;
      case "orders-all": return <AdminOrders filter="all" />;
      case "orders-refund": return <AdminOrders filter="refund" />;
      case "promotions": return <AdminPromotions />;
      case "posts": return <AdminPosts />;
      case "comments": return <AdminComments />;
      case "forms": return <AdminForms />;
      case "popups": return <AdminPopups />;
      case "stats-sales": return <AdminStatistics view="sales" />;
      case "stats-traffic": return <AdminStatistics view="traffic" />;
      case "stats-pages": return <AdminStatistics view="pages" />;
      case "settings-general": return <AdminSettings view="general" />;
      case "settings-seo": return <AdminSettings view="seo" />;
      case "settings-header": return <AdminSettings view="header" />;
      default: return <AdminOverview />;
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
              <SheetContent side="left" className="w-64 p-0 overflow-y-auto">
                <div className="p-4 border-b border-border">
                  <p className="text-xs text-muted-foreground">관리자</p>
                  <p className="text-sm font-bold mt-0.5">디하북스 어드민</p>
                </div>
                <nav className="p-2 space-y-0.5">
                  {flatMenuItems.map(item => (
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

export default AdminDashboard;
