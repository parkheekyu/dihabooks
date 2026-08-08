import { Link, useLocation, useNavigate } from "react-router-dom";
import { User, ShoppingBag, Settings, LogOut, Mail, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const AccountSidebar = () => {
  const location = useLocation();
  const { role, logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { label: "프로필 수정", path: "/profile/edit", icon: User },
    ...(role === "expert"
      ? [
          { label: "작가 프로필 설정", path: "/seller-profile", icon: Settings },
        ]
      : []),
    { label: "구매 내역", path: "/purchases", icon: ShoppingBag },
    { label: "1:1 문의", path: "/support", icon: Mail },
    { label: "자주 묻는 질문", path: "/faq", icon: HelpCircle },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden desktop:block w-52 shrink-0">
        <div className="sticky top-24">
          <h2 className="text-lg font-bold mb-4">마이페이지</h2>
          <nav className="space-y-0.5">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors",
                    isActive
                      ? "text-foreground font-medium bg-secondary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-destructive hover:bg-destructive/5 transition-colors w-full"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              로그아웃
            </button>
          </nav>
        </div>
      </aside>

      {/* Mobile horizontal nav */}
      <div className="desktop:hidden border-b border-border bg-background -mx-4 px-4 mb-6">
        <div className="flex gap-1 overflow-x-auto scrollbar-hide">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "px-3 py-3 text-sm whitespace-nowrap border-b-2 transition-colors",
                  isActive
                    ? "border-primary text-primary font-medium"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default AccountSidebar;
