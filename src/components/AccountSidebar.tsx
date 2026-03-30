import { Link, useLocation, useNavigate } from "react-router-dom";
import { User, Shield, Bell, LogOut, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const accountMenu = [
  { label: "내 정보", path: "/profile/edit", icon: User },
  { label: "알림 설정", path: "/profile/notifications", icon: Bell },
  { label: "보안 설정", path: "/profile/security", icon: Shield },
];

const AccountSidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden desktop:block w-52 shrink-0">
        <div className="sticky top-24">
          <h2 className="text-lg font-bold mb-4">계정 설정</h2>
          <nav className="space-y-0.5">
            {accountMenu.map((item) => {
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
          {accountMenu.map((item) => {
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
export { accountMenu };
